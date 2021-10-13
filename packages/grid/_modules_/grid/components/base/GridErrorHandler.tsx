import * as React from 'react';
import { useGridState } from '../../hooks/utils/useGridState';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridLogger } from '../../hooks/utils/useGridLogger';
import { GridMainContainer } from '../containers/GridMainContainer';
import { ErrorBoundary } from '../ErrorBoundary';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridErrorHandler(props) {
  const { children } = props;
  const apiRef = useGridApiContext();
  const logger = useGridLogger(apiRef, 'GridErrorHandler');
  const rootProps = useGridRootProps();
  const [gridState] = useGridState(apiRef);

  return (
    <ErrorBoundary
      hasError={gridState.error != null}
      componentProps={gridState.error}
      api={apiRef}
      logger={logger}
      render={(errorProps) => (
        <GridMainContainer>
          <rootProps.components.ErrorOverlay
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
