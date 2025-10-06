import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('ErrorBoundary caught an error:', error, errorInfo);
    
    // Clean up any problematic DOM elements that might be causing issues
    try {
      // Clean up any orphaned warp overlays
      const overlays = document.querySelectorAll('.warp-overlay, [data-warp-overlay="true"]');
      overlays.forEach(overlay => {
        try {
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        } catch (e) {
          // Silently ignore cleanup errors
        }
      });
    } catch (cleanupError) {
      console.warn('Error during ErrorBoundary cleanup:', cleanupError);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default error UI
      return (
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ff6b6b', 
          borderRadius: '8px', 
          background: 'rgba(255, 107, 107, 0.1)',
          color: '#ff6b6b',
          margin: '10px 0'
        }}>
          <h3>🔧 Something went wrong</h3>
          <p>A component error occurred, but the app is still functional.</p>
          <button
            onClick={this.resetError}
            style={{
              padding: '8px 16px',
              border: '1px solid #ff6b6b',
              background: 'transparent',
              color: '#ff6b6b',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Try Again
          </button>
          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: '10px', fontSize: '12px' }}>
              <summary>Error Details (Development)</summary>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px', marginTop: '5px' }}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;