
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
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
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">System Critical Failure</h1>
                    <p className="mb-4 text-gray-400">The application encountered an unexpected error.</p>
                    <pre className="bg-gray-900 p-4 rounded text-xs text-red-300 overflow-auto max-w-full">
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                    >
                        Reboot System
                    </button>
                </div>
            );
        }

        // @ts-ignore
        return this.props.children;
    }
}

export default ErrorBoundary;
