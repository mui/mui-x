import * as React from "react";

type FallbackRender = (
  error: Error,
  options: { resetError: () => void }
) => React.ReactNode;

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | FallbackRender;
  onError?: (error: Error, options: { resetError: () => void }) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.props.onError?.(error, {
      resetError: () => {
        this.setState({ error: null });
      },
    });
  }

  render() {
    const { error } = this.state;
    if (error) {
      const { fallback } = this.props;
      const resetError = () => this.setState({ error: null });
      if (typeof fallback === "function") {
        return (fallback as FallbackRender)(error, { resetError });
      }
      return fallback || null;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
