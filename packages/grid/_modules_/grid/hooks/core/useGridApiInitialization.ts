import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridListener, GridSubscribeEventOptions } from '../../utils/eventEmitter/GridEventEmitter';
import { useGridLogger } from '../utils/useGridLogger';
import { GridEvents } from '../../constants/eventsConstants';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { GridComponentProps } from '../../GridComponentProps';
import { MuiEvent } from '../../models/muiEvent';

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

export function useGridApiInitialization(
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'signature'>,
): void {
  const logger = useGridLogger(apiRef, 'useApi');

  const publishEvent = React.useCallback(
    (name: string, params: any, event: MuiEvent = {}) => {
      event.defaultMuiPrevented = false;
      if (event && isSyntheticEvent(event) && event.isPropagationStopped()) {
        return;
      }
      const details = props.signature === GridSignature.DataGridPro ? { api: apiRef.current } : {};
      apiRef.current.emit(name, params, event, details);
    },
    [apiRef, props.signature],
  );

  const subscribeEvent = React.useCallback(
    <Params, Event extends MuiEvent>(
      event: string,
      handler: GridListener<Params, Event>,
      options?: GridSubscribeEventOptions,
    ): (() => void) => {
      logger.debug(`Binding ${event} event`);
      apiRef.current.on(event, handler, options);
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
      apiRef.current.publishEvent(GridEvents.componentError, args);
    },
    [apiRef],
  );

  React.useEffect(() => {
    logger.debug('Initializing grid api.');
    const api = apiRef.current;

    return () => {
      logger.info('Unmounting Grid component. Clearing all events listeners.');
      api.publishEvent(GridEvents.unmount);
      api.removeAllListeners();
    };
  }, [logger, apiRef]);

  useGridApiMethod(apiRef, { subscribeEvent, publishEvent, showError }, 'GridCoreApi');
}
