import * as React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
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
      if (typeof fallback === 'function') {
        return fallback(error, { resetError });
      }
      return fallback || null;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };

export default ErrorBoundary;
