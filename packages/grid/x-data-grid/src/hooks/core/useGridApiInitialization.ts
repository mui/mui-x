import * as React from 'react';
import { GridEvents } from '../../models/events';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridApiCommon, GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import { GridCoreApi, GridCorePrivateApi } from '../../models/api/gridCoreApi';
import { EventManager } from '../../utils/EventManager';

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

const wrapPublicApi = <PublicApi extends GridApiCommon, PrivateApi extends GridPrivateApiCommon>(
  publicApi: PublicApi,
) => {
  const privateApi = {} as PrivateApi;

  privateApi.getPublicApi = () => publicApi;

  const register: GridCorePrivateApi<PublicApi, PrivateApi>['register'] = (
    visibility: 'public' | 'private',
    methods,
  ) => {
    const api = visibility === 'public' ? publicApi : privateApi;
    Object.keys(methods.current).forEach((methodName) => {
      if (!api.hasOwnProperty(methodName)) {
        // @ts-ignore
        api[methodName] = (...args) => methods.current[methodName](...args);
      }
    });
  };

  privateApi.register = register;

  const handler: ProxyHandler<PublicApi> = {
    get: (obj, prop) => {
      if (obj.hasOwnProperty(prop)) {
        return obj[prop as keyof PublicApi];
      }

      return privateApi[prop as keyof PrivateApi];
    },
    set: (obj, prop, value) => {
      obj[prop as keyof PublicApi] = value;
      return true;
    },
  };

  return new Proxy(publicApi, handler) as PublicApi & PrivateApi;
};

let globalId = 0;

export function useGridApiInitialization<
  PublicApi extends GridApiCommon,
  PrivateApi extends GridPrivateApiCommon,
>(
  inputApiRef: React.MutableRefObject<PublicApi> | undefined,
  props: Pick<DataGridProcessedProps, 'signature'>,
) {
  const publicApiRef = React.useRef() as React.MutableRefObject<PublicApi>;

  if (!publicApiRef.current) {
    publicApiRef.current = {
      unstable_eventManager: new EventManager(),
      state: {} as PublicApi['state'],
      instanceId: globalId,
    } as PublicApi;

    globalId += 1;
  }

  const internalApiRef = React.useRef() as React.MutableRefObject<PublicApi & PrivateApi>;
  if (!internalApiRef.current) {
    internalApiRef.current = wrapPublicApi<PublicApi, PrivateApi>(publicApiRef.current);
  }

  React.useImperativeHandle(inputApiRef, () => publicApiRef.current, [publicApiRef]);

  const publishEvent = React.useCallback<GridCoreApi['publishEvent']>(
    (...args: any[]) => {
      const [name, params, event = {}] = args;
      event.defaultMuiPrevented = false;

      if (isSyntheticEvent(event) && event.isPropagationStopped()) {
        return;
      }
      const details =
        props.signature === GridSignature.DataGridPro ? { api: publicApiRef.current } : {};
      publicApiRef.current.unstable_eventManager.emit(name, params, event, details);
    },
    [publicApiRef, props.signature],
  );

  const subscribeEvent = React.useCallback<GridCoreApi['subscribeEvent']>(
    (event, handler, options?) => {
      publicApiRef.current.unstable_eventManager.on(event, handler, options);
      const api = publicApiRef.current;
      return () => {
        api.unstable_eventManager.removeListener(event, handler);
      };
    },
    [publicApiRef],
  );

  const showError = React.useCallback<GridCoreApi['showError']>(
    (args) => {
      publicApiRef.current.publishEvent(GridEvents.componentError, args);
    },
    [publicApiRef],
  );

  useGridApiMethod(publicApiRef, { subscribeEvent, publishEvent, showError } as any, 'GridCoreApi');

  React.useEffect(() => {
    const api = publicApiRef.current;

    return () => {
      api.publishEvent(GridEvents.unmount);
    };
  }, [publicApiRef]);

  return { publicApiRef, internalApiRef };
}
