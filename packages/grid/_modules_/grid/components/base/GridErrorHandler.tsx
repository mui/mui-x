import * as React from 'react';
import { useGridState } from '../../hooks/features/core/useGridState';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { useLogger } from '../../hooks/utils/useLogger';
import { GridMainContainer } from '../containers/GridMainContainer';
import { ErrorBoundary } from '../ErrorBoundary';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

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
