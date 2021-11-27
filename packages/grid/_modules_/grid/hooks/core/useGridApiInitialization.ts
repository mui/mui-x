import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { useGridLogger } from '../utils/useGridLogger';
import { GridEvents } from '../../models/events';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { GridComponentProps } from '../../GridComponentProps';
import { GridCoreApi } from '../../models';

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

export function useGridApiInitialization(
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'signature'>,
): void {
  const logger = useGridLogger(apiRef, 'useApi');

  const publishEvent = React.useCallback<GridCoreApi['publishEvent']>(
    (...args: any[]) => {
      const [name, params, event = {}] = args;
      event.defaultMuiPrevented = false;

      if (isSyntheticEvent(event) && event.isPropagationStopped()) {
        return;
      }
      const details = props.signature === GridSignature.DataGridPro ? { api: apiRef.current } : {};
      apiRef.current.unstable_eventManager.emit(name, params, event, details);
    },
    [apiRef, props.signature],
  );

  const subscribeEvent = React.useCallback<GridCoreApi['subscribeEvent']>(
    (event, handler, options?) => {
      logger.debug(`Binding ${event} event`);
      apiRef.current.unstable_eventManager.on(event, handler, options);
      const api = apiRef.current;
      return () => {
        logger.debug(`Clearing ${event} event`);
        api.unstable_eventManager.removeListener(event, handler);
      };
    },
    [apiRef, logger],
  );

  const showError = React.useCallback<GridCoreApi['showError']>(
    (args) => {
      apiRef.current.publishEvent(GridEvents.componentError, args);
    },
    [apiRef],
  );

  useGridApiMethod(apiRef, { subscribeEvent, publishEvent, showError }, 'GridCoreApi');

  React.useEffect(() => {
    logger.debug('Initializing grid api.');
    const api = apiRef.current;

    return () => {
      logger.info('Unmounting Grid component. Clearing all events listeners.');
      api.publishEvent(GridEvents.unmount);
      api.unstable_eventManager.removeAllListeners();
    };
  }, [logger, apiRef]);
}
