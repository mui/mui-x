import * as React from 'react';
import { EventManager } from '@mui/x-internals/EventManager';
import { Store } from '../../utils/Store';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridCoreApi } from '../../models';
import type { GridApiCommon, GridPrivateApiCommon } from '../../models/api/gridApiCommon';

const SYMBOL_API_PRIVATE = Symbol('mui.api_private');

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

export function unwrapPrivateAPI<
  PrivateApi extends GridPrivateApiCommon,
  Api extends GridApiCommon,
>(publicApi: Api): PrivateApi {
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
  } as any as PrivateApi;

  globalId += 1;

  privateApi.getPublicApi = () => publicApiRef.current;

  privateApi.register = (visibility, methods) => {
    Object.keys(methods).forEach((methodName) => {
      const method = (methods as any)[methodName];

      const currentPrivateMethod = privateApi[methodName as keyof typeof privateApi] as any;
      if (currentPrivateMethod?.spying === true) {
        currentPrivateMethod.target = method;
      } else {
        privateApi[methodName as keyof typeof privateApi] = method;
      }

      if (visibility === 'public') {
        const publicApi = publicApiRef.current;

        const currentPublicMethod = publicApi[methodName as keyof typeof publicApi] as any;
        if (currentPublicMethod?.spying === true) {
          currentPublicMethod.target = method;
        } else {
          publicApi[methodName as keyof typeof publicApi] = method;
        }
      }
    });
  };

  privateApi.register('private', {
    caches: {} as any,
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
    get store() {
      return privateApiRef.current.store;
    },
    get instanceId() {
      return privateApiRef.current.instanceId;
    },
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

  if (!publicApiRef.current) {
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
        props.signature === GridSignature.DataGridPro ||
        props.signature === GridSignature.DataGridPremium
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

  if (inputApiRef && !inputApiRef.current?.state) {
    inputApiRef.current = publicApiRef.current;
  }

  React.useImperativeHandle(inputApiRef, () => publicApiRef.current, [publicApiRef]);

  React.useEffect(() => {
    const api = privateApiRef.current;

    return () => {
      api.publishEvent('unmount');
    };
  }, [privateApiRef]);

  return privateApiRef;
}
