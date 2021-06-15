import * as React from 'react';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useGridApiContext } from './hooks/root/useGridApiContext';
import { GridRootPropsContext } from './context/GridRootPropsContext';
import { useGridState } from './hooks/features/core/useGridState';
import { useLogger } from './hooks/utils/useLogger';

export function GridErrorHandler(props) {
  const { children } = props;
  const logger = useLogger('GridErrorHandler');
  const apiRef = useGridApiContext();
  const propsContext = React.useContext(GridRootPropsContext)!;
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
            {...propsContext.componentsProps?.errorOverlay}
          />
        </GridMainContainer>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
