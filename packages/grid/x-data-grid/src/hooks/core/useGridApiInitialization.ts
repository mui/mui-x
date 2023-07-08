import * as React from 'react';
import { Store } from '../../utils/Store';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridCoreApi } from '../../models';
import type { GridApiCommon, GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import { EventManager } from '../../utils/EventManager';

const SYMBOL_API_TYPE = Symbol('mui.api_type');
const SYMBOL_API_PRIVATE = Symbol('mui.api_private');

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

export function unwrapPrivateAPI<PrivateApi extends GridPrivateApiCommon, Api extends GridApiCommon>(
  publicApi: Api
): PrivateApi {
  return (publicApi as any)[SYMBOL_API_PRIVATE];
}

let globalId = 0;

function createPrivateAPI<PrivateApi extends GridPrivateApiCommon, Api extends GridApiCommon>(
  publicApiRef: React.MutableRefObject<Api>,
): PrivateApi {
  const existingPrivateApi = (publicApiRef.current as any)?.[SYMBOL_API_PRIVATE];
  if (existingPrivateApi) {
    return existingPrivateApi;
  }

  const state = {} as Api['state'];
  const privateApi = {
    state,
    store: Store.create(state),
    instanceId: { id: globalId },
    [SYMBOL_API_TYPE]: 'private',
  } as any as PrivateApi;

  globalId += 1;

  privateApi.getPublicApi = () => publicApiRef.current;

  privateApi.register = (visibility, methods) => {
    Object.keys(methods).forEach((methodName) => {
      if (visibility === 'public') {
        publicApiRef.current[methodName as keyof Api] = (methods as any)[methodName];
        privateApi[methodName as keyof PrivateApi] = (methods as any)[methodName];
      } else {
        privateApi[methodName as keyof PrivateApi] = (methods as any)[methodName];
      }
    });
  };

  privateApi.register('private', {
    caches: {} as PrivateApi['caches'],
    eventManager: new EventManager(),
  });

  return privateApi;
}

function createPublicAPI<PrivateApi extends GridPrivateApiCommon, Api extends GridApiCommon>(
  privateApiRef: React.MutableRefObject<PrivateApi>,
): Api {
  const publicApi = {
    get state() {
      return privateApiRef.current.state;
    },
    set state(value) {
      // XXX: need to prevent this, setting state should be done on the private instance
      privateApiRef.current.state = value;
    },
    get store() {
      return privateApiRef.current.store;
    },
    instanceId: privateApiRef.current.instanceId,
    [SYMBOL_API_TYPE]: 'public',
    [SYMBOL_API_PRIVATE]: privateApiRef.current,
  } as any as Api;

  return publicApi;
}

export function useGridApiInitialization<
  PrivateApi extends GridPrivateApiCommon,
  Api extends GridApiCommon,
>(
  inputApiRef: React.MutableRefObject<Api> | undefined,
  props: Pick<DataGridProcessedProps, 'signature'>,
): React.MutableRefObject<PrivateApi> {
  const publicApiRef = React.useRef() as React.MutableRefObject<Api>;
  const privateApiRef = React.useRef() as React.MutableRefObject<PrivateApi>;

  if (!privateApiRef.current) {
    privateApiRef.current = createPrivateAPI(publicApiRef) as PrivateApi;
  }

  if (!publicApiRef.current || !(publicApiRef.current as any)[SYMBOL_API_TYPE]) {
    publicApiRef.current = createPublicAPI(privateApiRef);
  }

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

  React.useImperativeHandle(inputApiRef, () => publicApiRef.current, [publicApiRef]);

  React.useEffect(() => {
    const api = privateApiRef.current;

    return () => {
      api.publishEvent('unmount');
    };
  }, [privateApiRef]);

  return privateApiRef;
}
