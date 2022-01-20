import * as React from 'react';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridLogger } from '../../hooks/utils/useGridLogger';
import { GridMainContainer } from '../containers/GridMainContainer';
import { ErrorBoundary } from '../ErrorBoundary';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridAutoSizer, AutoSizerSize } from '../GridAutoSizer';
import { GridEvents } from '../../models/events/gridEvents';

export function GridErrorHandler(props) {
  const { children } = props;
  const apiRef = useGridApiContext();
  const logger = useGridLogger(apiRef, 'GridErrorHandler');
  const rootProps = useGridRootProps();
  const error = apiRef.current.state.error;

  const handleResize = React.useCallback(
    (size: AutoSizerSize) => {
      apiRef.current.publishEvent(GridEvents.resize, size);
    },
    [apiRef],
  );

  return (
    <ErrorBoundary
      hasError={error != null}
      componentProps={error}
      api={apiRef}
      logger={logger}
      render={(errorProps) => (
        <GridMainContainer>
          <GridAutoSizer
            nonce={rootProps.nonce}
            disableHeight={rootProps.autoHeight}
            onResize={handleResize}
          >
            {() => (
              <rootProps.components.ErrorOverlay
                {...errorProps}
                {...rootProps.componentsProps?.errorOverlay}
              />
            )}
          </GridAutoSizer>
        </GridMainContainer>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
