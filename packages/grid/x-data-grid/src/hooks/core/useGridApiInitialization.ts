import * as React from 'react';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridCoreApi } from '../../models';
import type {
  GridApiCommon,
  GridPrivateApiCommon,
  GridPrivateOnlyApiCommon,
} from '../../models/api/gridApiCommon';
import { EventManager } from '../../utils/EventManager';

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

let globalId = 0;

const wrapPublicApi = <PrivateApi extends GridPrivateApiCommon, PublicApi extends GridApiCommon>(
  publicApi: PublicApi,
) => {
  const privateOnlyApi = {} as GridPrivateOnlyApiCommon<PublicApi, PrivateApi>;

  privateOnlyApi.getPublicApi = () => publicApi;

  privateOnlyApi.register = (visibility, methods) => {
    Object.keys(methods).forEach((methodName) => {
      if (visibility === 'public') {
        if (!publicApi.hasOwnProperty(methodName)) {
          // TODO: Fix
          // @ts-expect-error
          publicApi[methodName] = methods[methodName];
        }
      } else if (!privateOnlyApi.hasOwnProperty(methodName)) {
        // TODO: Fix
        // @ts-expect-error
        privateOnlyApi[methodName] = methods[methodName];
      }
    });
  };

  const handler: ProxyHandler<GridApiCommon> = {
    get: (obj, prop) => {
      // TODO: Fix
      // @ts-expect-error
      if (obj[prop] !== undefined) {
        // TODO: Fix
        // @ts-expect-error
        return obj[prop];
      }

      // TODO: Fix
      // @ts-expect-error
      return privateOnlyApi[prop];
    },
    set: (obj, prop, value) => {
      // TODO: Fix
      // @ts-expect-error
      obj[prop] = value;
      return true;
    },
  };

  return new Proxy(publicApi, handler) as PrivateApi;
};

export function useGridApiInitialization<
  PrivateApi extends GridPrivateApiCommon,
  Api extends GridApiCommon,
>(
  inputApiRef: React.MutableRefObject<Api> | undefined,
  props: Pick<DataGridProcessedProps, 'signature'>,
): React.MutableRefObject<PrivateApi> {
  const publicApiRef = React.useRef() as React.MutableRefObject<Api>;

  if (!publicApiRef.current) {
    publicApiRef.current = {
      unstable_eventManager: new EventManager(),
      unstable_caches: {} as Api['unstable_caches'],
      state: {} as Api['state'],
      instanceId: globalId,
    } as Api;

    globalId += 1;
  }

  const privateApiRef = React.useRef() as React.MutableRefObject<PrivateApi>;
  if (!privateApiRef.current) {
    privateApiRef.current = wrapPublicApi<PrivateApi, Api>(publicApiRef.current);
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
        props.signature === GridSignature.DataGridPro
          ? { api: privateApiRef.current.getPublicApi() }
          : {};
      privateApiRef.current.unstable_eventManager.emit(name, params, event, details);
    },
    [privateApiRef, props.signature],
  );

  const subscribeEvent = React.useCallback<GridCoreApi['subscribeEvent']>(
    (event, handler, options?) => {
      privateApiRef.current.unstable_eventManager.on(event, handler, options);
      const api = privateApiRef.current;
      return () => {
        api.unstable_eventManager.removeListener(event, handler);
      };
    },
    [privateApiRef],
  );

  const showError = React.useCallback<GridCoreApi['showError']>(
    (args) => {
      privateApiRef.current.publishEvent('componentError', args);
    },
    [privateApiRef],
  );

  useGridApiMethod(privateApiRef, { subscribeEvent, publishEvent, showError } as any, 'public');

  React.useEffect(() => {
    const api = privateApiRef.current;

    return () => {
      api.publishEvent('unmount');
    };
  }, [privateApiRef]);

  return privateApiRef;
}
