import * as React from 'react';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useGridApiContext } from './hooks/root/useGridApiContext';
import { useGridState } from './hooks/features/core/useGridState';
import { useLogger } from './hooks/utils/useLogger';
import { useGridRootProps } from './hooks/utils/useGridRootProps';

export function GridErrorHandler(props) {
  const { children } = props;
  const logger = useLogger('GridErrorHandler');
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
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
            {...rootProps.componentsProps?.errorOverlay}
          />
        </GridMainContainer>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
