import * as React from 'react';
import { ErrorInfo } from 'react';
import { GridApiCommunity } from '../models/api/gridApiCommunity';
import { Logger } from '../models/logger';

export interface ErrorBoundaryProps {
  logger: Logger;
  render: ({ error }: any) => React.ReactNode;
  api: React.MutableRefObject<GridApiCommunity>;
  hasError: boolean;
  componentProps?: any[];
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, any> {
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.api.current) {
      this.logError(error);

      // Allows to trigger the Error event and all listener can run on Error
      this.props.api.current.showError({ error, errorInfo });
    }
  }

  logError(error: Error, errorInfo?: ErrorInfo) {
    this.props.logger.error(
      `An unexpected error occurred. Error: ${error && error.message}. `,
      error,
      errorInfo,
    );
  }

  render() {
    if (this.props.hasError || this.state?.hasError) {
      // You can render any custom fallback UI
      return this.props.render(this.props.componentProps || this.state);
    }

    return this.props.children;
  }
}
