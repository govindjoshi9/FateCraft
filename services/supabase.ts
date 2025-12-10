import { createClient } from '@supabase/supabase-js';

// These should be set in your environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabaseInstance;

// Check if credentials exist to avoid "supabaseUrl is required" error
if (supabaseUrl && supabaseKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("Supabase credentials missing. Using mock client for demonstration.");
  
  // Mock session state for demo mode
  let currentSession: any = null;
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
      signInWithPassword: async ({ email }: any) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        currentSession = { 
            access_token: 'mock-token',
            user: { id: 'mock-user-id', email: email } 
        };
        notify('SIGNED_IN', currentSession);
        return { data: { session: currentSession, user: currentSession.user }, error: null };
      },
      signUp: async ({ email }: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        // For mock, we pretend signup is successful.
        return { 
            data: { user: { id: 'mock-user-id', email: email }, session: null }, 
            error: null 
        };
      },
      signOut: async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        currentSession = null;
        notify('SIGNED_OUT', null);
        return { error: null };
      }
    }
  } as any;
}

export const supabase = supabaseInstance;