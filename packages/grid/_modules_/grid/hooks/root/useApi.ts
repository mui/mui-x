import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { useLogger } from '../utils/useLogger';
import { XGRID_COMPONENT_ERROR, XGRID_UNMOUNT } from '../../constants/eventsConstants';
import { useGridApiMethod } from './useGridApiMethod';

export function useApi(
  gridRootRef: React.RefObject<HTMLDivElement>,
  columnHeadersContainerRef: React.RefObject<HTMLDivElement>,
  apiRef: ApiRef,
): boolean {
  const [initialised, setInit] = React.useState(false);
  const logger = useLogger('useApi');

  const publishEvent = React.useCallback(
    (name: string, ...args: any[]) => {
      apiRef.current.emit(name, ...args);
    },
    [apiRef],
  );

  const subscribeEvent = React.useCallback(
    (event: string, handler: (param: any) => void): (() => void) => {
      logger.debug(`Binding ${event} event`);
      apiRef.current.on(event, handler);
      const api = apiRef.current;
      return () => {
        logger.debug(`Clearing ${event} event`);
        api.removeListener(event, handler);
      };
    },
    [apiRef, logger],
  );

  const showError = React.useCallback(
    (args) => {
      publishEvent(XGRID_COMPONENT_ERROR, args);
    },
    [publishEvent],
  );

  React.useEffect(() => {
    logger.debug('Initializing grid api.');
    apiRef.current.isInitialised = true;
    apiRef.current.rootElementRef = gridRootRef;
    apiRef.current.columnHeadersElementRef = columnHeadersContainerRef;

    setInit(true);
    const api = apiRef.current;

    return () => {
      logger.debug('Unmounting Grid component');
      api.emit(XGRID_UNMOUNT);
      logger.debug('Clearing all events listeners');
      api.removeAllListeners();
    };
  }, [gridRootRef, logger, apiRef, columnHeadersContainerRef]);

  useGridApiMethod(apiRef, { subscribeEvent, publishEvent, showError }, 'CoreApi');

  return initialised;
}
