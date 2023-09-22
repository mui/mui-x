import { UseTreeViewInstanceEventsInstance } from '../corePlugins/useTreeViewInstanceEvents/useTreeViewInstanceEvents.types';
import { TreeViewAnyPluginSignature, TreeViewUsedEvents } from '../models';

export const publishTreeViewEvent = <
  Instance extends UseTreeViewInstanceEventsInstance & {
    $$signature: TreeViewAnyPluginSignature;
  },
  E extends keyof TreeViewUsedEvents<Instance['$$signature']>,
>(
  instance: Instance,
  eventName: E,
  params: TreeViewUsedEvents<Instance['$$signature']>[E]['params'],
) => {
  instance.$$publishEvent(eventName as string, params);
};
