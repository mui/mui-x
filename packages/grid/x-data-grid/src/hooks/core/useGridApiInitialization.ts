import * as React from 'react';
import { Store } from '../../utils/Store';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import type { GridCoreApi } from '../../models';
import type {
  GridApiCommon,
  GridPrivateApiCommon,
} from '../../models/api/gridApiCommon';
import { EventManager } from '../../utils/EventManager';

const API_TYPE = Symbol('mui.api_type')
const PRIVATE_SYMBOL = Symbol('mui.private_api')

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

let globalId = 0;

const wrapPublicApi = <PrivateApi extends GridPrivateApiCommon, PublicApi extends GridApiCommon>(
  publicApi: PublicApi,
) => {

  const privateApi = {
    ...publicApi,
    [API_TYPE]: 'private',
  } as unknown as PrivateApi;

  privateApi.getPublicApi = () => publicApi;

  privateApi.register = (visibility, methods) => {
    Object.keys(methods).forEach((methodName) => {
      if (visibility === 'public') {
        publicApi[methodName as keyof PublicApi] = (methods as any)[methodName];
        privateApi[methodName as keyof PrivateApi] = (methods as any)[methodName];
      } else {
        privateApi[methodName as keyof PrivateApi] = (methods as any)[methodName];
      }
    });
  };

  return privateApi;
};

export function useGridApiInitialization<
  PrivateApi extends GridPrivateApiCommon,
  Api extends GridApiCommon,
>(
  inputApiRef: React.MutableRefObject<Api> | undefined,
  props: Pick<DataGridProcessedProps, 'signature'>,
): React.MutableRefObject<PrivateApi> {

  const publicApiRef = inputApiRef ?? React.useRef() as React.MutableRefObject<Api>;
  if (!publicApiRef.current || !(publicApiRef.current as any)[API_TYPE]) {
    const state = {} as Api['state'];

    publicApiRef.current = {
      [API_TYPE]: 'public',
      state,
      store: Store.create(state),
      instanceId: { id: globalId },
    } as any as Api;

    globalId += 1;
  }

  const privateApiRef = React.useRef() as React.MutableRefObject<PrivateApi>;
  if (!privateApiRef.current) {
    privateApiRef.current = wrapPublicApi<PrivateApi, Api>(publicApiRef.current);
    (publicApiRef.current as any)[PRIVATE_SYMBOL] = privateApiRef.current;

    privateApiRef.current.register('private', {
      caches: {} as PrivateApi['caches'],
      eventManager: new EventManager(),
    });
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

  React.useEffect(() => {
    const api = privateApiRef.current;

    return () => {
      api.publishEvent('unmount');
    };
  }, [privateApiRef]);

  return privateApiRef;
}
