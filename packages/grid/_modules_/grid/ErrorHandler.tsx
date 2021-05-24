import * as React from 'react';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GridApiContext } from './components/GridApiContext';
import { useErrorHandler } from './hooks/utils/useErrorHandler';
import { useLogger } from './hooks/utils/useLogger';

export function ErrorHandler(props) {
  const logger = useLogger('GridErrorHandler');
  const apiRef = React.useContext(GridApiContext)!;
  const errorState = useErrorHandler(apiRef, props);

  return (
    <ErrorBoundary
      hasError={errorState != null}
      componentProps={errorState}
      api={apiRef!}
      logger={logger}
      render={(errorProps) => (
        <GridMainContainer>
          <apiRef.current.components.ErrorOverlay
            {...errorProps}
            {...props.componentsProps?.errorOverlay}
          />
        </GridMainContainer>
      )}
    >
      {props.children}
    </ErrorBoundary>
  );
}
