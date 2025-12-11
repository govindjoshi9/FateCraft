import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] h-full p-8 text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <div className="p-4 bg-rose-100 dark:bg-rose-900/20 rounded-full mb-4">
            <AlertTriangle size={48} className="text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
            We encountered an unexpected error. The application has been notified.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={18} />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
