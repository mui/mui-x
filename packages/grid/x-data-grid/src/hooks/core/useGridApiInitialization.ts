import * as React from 'react';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridApiCommon, GridCoreApi } from '../../models';
import { EventManager } from '../../utils/EventManager';

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

let globalId = 0;

export function useGridApiInitialization<Api extends GridApiCommon>(
  inputApiRef: React.MutableRefObject<Api> | undefined,
  props: Pick<DataGridProcessedProps, 'signature'>,
): React.MutableRefObject<Api> {
  const apiRef = React.useRef() as React.MutableRefObject<Api>;

  if (!apiRef.current) {
    apiRef.current = {
      unstable_eventManager: new EventManager(),
      state: {} as Api['state'],
      instanceId: globalId,
    } as Api;

    globalId += 1;
  }

  React.useImperativeHandle(inputApiRef, () => apiRef.current, [apiRef]);

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
      apiRef.current.unstable_eventManager.on(event, handler, options);
      const api = apiRef.current;
      return () => {
        api.unstable_eventManager.removeListener(event, handler);
      };
    },
    [apiRef],
  );

  const showError = React.useCallback<GridCoreApi['showError']>(
    (args) => {
      apiRef.current.publishEvent('componentError', args);
    },
    [apiRef],
  );

  useGridApiMethod(apiRef, { subscribeEvent, publishEvent, showError } as any, 'GridCoreApi');

  React.useEffect(() => {
    const api = apiRef.current;

    return () => {
      api.publishEvent('unmount');
    };
  }, [apiRef]);

  return apiRef;
}
