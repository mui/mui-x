import { TreeViewAnyPluginSignature, TreeViewPluginSignature } from '../../models';
import { TreeViewEventListener } from '../../models/events';

export interface UseTreeViewInstanceEventsInstance {
  subscribeEvent: (eventName: string, handler: TreeViewEventListener<any>) => () => void;
  // TODO: Improve typing to avoid having to manually pass the generics.
  publishEvent: <Signature extends TreeViewAnyPluginSignature, E extends keyof Signature['events']>(
    eventName: E,
    params: Signature['events'][E]['params'],
  ) => void;
}

export type UseTreeViewInstanceEventsSignature = TreeViewPluginSignature<
  {},
  {},
  UseTreeViewInstanceEventsInstance,
  {},
  {},
  never,
  []
>;
