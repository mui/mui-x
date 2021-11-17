import * as React from 'react';
import { GridApiRef, GridPrivateApiRef } from '../../models/api/gridApiRef';
import { GridApi, GridPrivateApi } from '../../models/api/gridApi';
import { useGridLogger } from '../utils/useGridLogger';
import { GridEvents } from '../../constants/eventsConstants';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { GridComponentProps } from '../../GridComponentProps';
import { GridCoreApi } from '../../models';

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

const wrapPublicApi = (publicApi: GridApi) => {
  const privateOnlyApi = {
    registerMethod: (methodName: string, isPublic: boolean, method: (...args: any[]) => any) => {
      if (isPublic) {
        publicApi[methodName] = method;
      } else {
        privateOnlyApi[methodName] = method;
      }
    },
  } as Omit<GridPrivateApi, keyof GridApi>;

  const handler: ProxyHandler<GridApi> = {
    get: (obj, prop) => {
      if (obj[prop] !== undefined) {
        return obj[prop];
      }

      return privateOnlyApi[prop];
    },
    set: (obj, prop, value) => {
      obj[prop] = value;
      return true;
    },
  };

  return new Proxy(publicApi, handler) as GridPrivateApi;
};

export function useGridApiInitialization(
  publicApiRef: GridApiRef,
  props: Pick<GridComponentProps, 'signature'>,
): GridPrivateApiRef {
  const privateApiRef = React.useRef() as GridPrivateApiRef;
  if (!privateApiRef.current) {
    privateApiRef.current = wrapPublicApi(publicApiRef.current);
  }

  const logger = useGridLogger(publicApiRef, 'useApi');

  const publishEvent = React.useCallback<GridCoreApi['publishEvent']>(
    (...args: any[]) => {
      const [name, params, event = {}] = args;
      event.defaultMuiPrevented = false;

      if (isSyntheticEvent(event) && event.isPropagationStopped()) {
        return;
      }
      const details =
        props.signature === GridSignature.DataGridPro ? { api: privateApiRef.current } : {};
      privateApiRef.current.unstable_eventManager.emit(name, params, event, details);
    },
    [privateApiRef, props.signature],
  );

  const subscribeEvent = React.useCallback<GridCoreApi['subscribeEvent']>(
    (event, handler, options?) => {
      logger.debug(`Binding ${event} event`);
      privateApiRef.current.unstable_eventManager.on(event, handler, options);
      const api = privateApiRef.current;
      return () => {
        logger.debug(`Clearing ${event} event`);
        api.unstable_eventManager.removeListener(event, handler);
      };
    },
    [privateApiRef, logger],
  );

  const showError = React.useCallback<GridCoreApi['showError']>(
    (args) => {
      privateApiRef.current.publishEvent(GridEvents.componentError, args);
    },
    [privateApiRef],
  );

  useGridApiMethod(privateApiRef, { subscribeEvent, publishEvent, showError }, 'GridCoreApi');

  React.useEffect(() => {
    logger.debug('Initializing grid api.');
    const api = privateApiRef.current;

    return () => {
      logger.info('Unmounting Grid component. Clearing all events listeners.');
      api.publishEvent(GridEvents.unmount);
      api.unstable_eventManager.removeAllListeners();
    };
  }, [logger, privateApiRef]);

  return privateApiRef;
}
