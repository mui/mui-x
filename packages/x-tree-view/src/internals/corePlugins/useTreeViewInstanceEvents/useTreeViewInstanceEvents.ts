import * as React from 'react';
import { EventManager } from '@mui/x-internals/EventManager';
import type { TreeViewPlugin } from '../../models';
import { UseTreeViewInstanceEventsSignature } from './useTreeViewInstanceEvents.types';
import type { TreeViewEventListener } from '../../models/events';

const isSyntheticEvent = (event: any): event is React.SyntheticEvent => {
  return event.isPropagationStopped !== undefined;
};

export const useTreeViewInstanceEvents: TreeViewPlugin<UseTreeViewInstanceEventsSignature> = () => {
  const [eventManager] = React.useState(() => new EventManager());

  const publishEvent = React.useCallback(
    (...args: any[]) => {
      const [name, params, event = {}] = args;
      event.defaultMuiPrevented = false;

      if (isSyntheticEvent(event) && event.isPropagationStopped()) {
        return;
      }

      eventManager.emit(name, params, event);
    },
    [eventManager],
  );

  const subscribeEvent = React.useCallback(
    (event: string, handler: TreeViewEventListener<any>) => {
      eventManager.on(event, handler);
      return () => {
        eventManager.removeListener(event, handler);
      };
    },
    [eventManager],
  );

  return {
    instance: {
      $$publishEvent: publishEvent,
      $$subscribeEvent: subscribeEvent,
    },
  };
};

useTreeViewInstanceEvents.params = {};
