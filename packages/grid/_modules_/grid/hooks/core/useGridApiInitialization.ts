import * as React from 'react';
import { GridEvents } from '../../models/events';
import { useGridApiMethod } from '../utils/useGridApiMethod';
import { GridSignature } from '../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridApiRef, GridApiCommon, GridCoreApi } from '../../models';
import { EventManager } from '../../utils/EventManager';

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

export function useGridApiInitialization<GridApi extends GridApiCommon>(
  inputApiRef: GridApiRef<GridApi> | undefined,
  props: Pick<DataGridProcessedProps, 'signature'>,
): GridApiRef<GridApi> {
  const apiRef = React.useRef() as GridApiRef<GridApi>;

  if (!apiRef.current) {
    apiRef.current = {
      unstable_eventManager: new EventManager(),
      state: {} as GridApi['state'],
    } as GridApi;
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
      apiRef.current.publishEvent(GridEvents.componentError, args);
    },
    [apiRef],
  );

  useGridApiMethod(apiRef, { subscribeEvent, publishEvent, showError } as any, 'GridCoreApi');

  React.useEffect(() => {
    const api = apiRef.current;

    return () => {
      api.publishEvent(GridEvents.unmount);
    };
  }, [apiRef]);

  return apiRef;
}
