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
import { unstable_resetCreateSelectorCache } from '../../utils/createSelector';

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

let globalId = 0;

const wrapPublicApi = <PrivateApi extends GridPrivateApiCommon, PublicApi extends GridApiCommon>(
  publicApi: PublicApi,
) => {
  type PrivateOnlyApi = GridPrivateOnlyApiCommon<PublicApi, PrivateApi>;
  const privateOnlyApi = {} as PrivateOnlyApi;

  privateOnlyApi.getPublicApi = () => publicApi;

  privateOnlyApi.register = (visibility, methods) => {
    Object.keys(methods).forEach((methodName) => {
      if (visibility === 'public') {
        publicApi[methodName as keyof PublicApi] = (methods as any)[methodName];
      } else {
        privateOnlyApi[methodName as keyof PrivateOnlyApi] = (methods as any)[methodName];
      }
    });
  };

  const handler: ProxyHandler<GridApiCommon> = {
    get: (obj, prop) => {
      if (prop in obj) {
        return obj[prop as keyof typeof obj];
      }
      return privateOnlyApi[prop as keyof PrivateOnlyApi];
    },
    set: (obj, prop, value) => {
      obj[prop as keyof typeof obj] = value;
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
      state: {} as Api['state'],
      instanceId: globalId,
    } as Api;

    globalId += 1;
  }

  const privateApiRef = React.useRef() as React.MutableRefObject<PrivateApi>;
  if (!privateApiRef.current) {
    privateApiRef.current = wrapPublicApi<PrivateApi, Api>(publicApiRef.current);

    privateApiRef.current.register('private', {
      caches: {} as PrivateApi['caches'],
      eventManager: new EventManager(),
    });
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
      privateApiRef.current.eventManager.emit(name, params, event, details);
    },
    [privateApiRef, props.signature],
  );

  const subscribeEvent = React.useCallback<GridCoreApi['subscribeEvent']>(
    (event, handler, options?) => {
      privateApiRef.current.eventManager.on(event, handler, options);
      const api = privateApiRef.current;
      return () => {
        api.eventManager.removeListener(event, handler);
      };
    },
    [privateApiRef],
  );

  useGridApiMethod(privateApiRef, { subscribeEvent, publishEvent } as any, 'public');

  React.useEffect(() => {
    const api = privateApiRef.current;

    return () => {
      unstable_resetCreateSelectorCache(api.instanceId);
      api.publishEvent('unmount');
    };
  }, [privateApiRef]);

  return privateApiRef;
}
