import * as React from 'react';
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
  const error = apiRef.current.state.error;

  return (
    <ErrorBoundary
      hasError={error != null}
      componentProps={error}
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
