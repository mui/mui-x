import * as React from 'react';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GridApiContext } from './components/GridApiContext';
import { GridPropsContext } from './context/GridPropsContext';
import { useGridState } from './hooks/features/core/useGridState';
import { useLogger } from './hooks/utils/useLogger';

export function GridErrorHandler(props) {
  const { children } = props
  const logger = useLogger('GridErrorHandler');
  const apiRef = React.useContext(GridApiContext)!;
  const props = React.useContext(GridPropsContext)!;
  const [gridState] = useGridState(apiRef);

  return (
    <ErrorBoundary
      hasError={gridState.error != null}
      componentProps={gridState.error}
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
      {children}
    </ErrorBoundary>
  );
}
