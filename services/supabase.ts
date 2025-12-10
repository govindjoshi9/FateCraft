import { createClient } from '@supabase/supabase-js';
import { UserRole } from '../types';

// These should be set in your environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabaseInstance;

// Helper to get user from local storage
const getStoredSession = () => {
  try {
    const stored = localStorage.getItem('fatecraft_session');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

const setStoredSession = (session: any) => {
  try {
    if (session) {
      localStorage.setItem('fatecraft_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('fatecraft_session');
    }
  } catch (e) {
    console.error("Local storage error", e);
  }
};

// Check if credentials exist to avoid "supabaseUrl is required" error
if (supabaseUrl && supabaseKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
} else {
  // Mock session state for demo mode
  let currentSession: any = getStoredSession();
  const authListeners: any[] = [];

  const notify = (event: string, session: any) => {
    authListeners.forEach(cb => cb(event, session));
  };

  // Create a proxy to mock the Supabase client auth methods
  supabaseInstance = {
    auth: {
      getSession: async () => ({ data: { session: currentSession }, error: null }),
      onAuthStateChange: (callback: any) => {
        authListeners.push(callback);
        // Fire initial state immediately
        try {
            callback(currentSession ? 'SIGNED_IN' : 'SIGNED_OUT', currentSession);
        } catch (e) { console.error(e); }
        
        return { data: { subscription: { unsubscribe: () => {
            const index = authListeners.indexOf(callback);
            if (index > -1) authListeners.splice(index, 1);
        } } } };
      },
      signInWithPassword: async ({ email, password }: any) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let role = UserRole.CITIZEN;
        let name = "Demo User";

        // Demo Logic
        if (email === 'demo@industry.com') {
          role = UserRole.INDUSTRY;
          name = "Industry Manager";
        } else if (email === 'demo@gov.com') {
          role = UserRole.GOVERNMENT;
          name = "Gov Official";
        } else {
          // Default or citizen login
          role = UserRole.CITIZEN;
          name = "Citizen Jane";
        }

        currentSession = { 
            access_token: 'mock-token',
            user: { 
              id: 'mock-user-id', 
              email: email,
              user_metadata: {
                role: role,
                full_name: name
              }
            } 
        };
        
        setStoredSession(currentSession);
        notify('SIGNED_IN', currentSession);
        return { data: { session: currentSession, user: currentSession.user }, error: null };
      },
      signUp: async ({ email, password, options }: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const role = options?.data?.role || UserRole.CITIZEN;
        
        currentSession = {
           access_token: 'mock-token',
           user: {
             id: 'new-user-id',
             email: email,
             user_metadata: {
               role: role,
               full_name: email.split('@')[0]
             }
           }
        };

        setStoredSession(currentSession);
        notify('SIGNED_IN', currentSession); // Auto login on signup for demo
        
        return { 
            data: { user: currentSession.user, session: currentSession }, 
            error: null 
        };
      },
      signOut: async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        currentSession = null;
        setStoredSession(null);
        notify('SIGNED_OUT', null);
        return { error: null };
      }
    }
  } as any;
}

export const supabase = supabaseInstance;