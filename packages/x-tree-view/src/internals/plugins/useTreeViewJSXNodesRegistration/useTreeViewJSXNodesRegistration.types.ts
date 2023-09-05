import { TreeViewNode, TreeViewPluginSignature } from '../../models';
import { UseTreeViewInstanceEventsSignature } from '../useTreeViewInstanceEvents';

export interface UseTreeViewJSXNodesRegistrationInstance {
  registerNode: (node: TreeViewNode) => () => void;
  getNodeMap: () => { [nodeId: string]: TreeViewNode };
}

export interface UseTreeViewJSXNodesRegistrationEventLookup {
  unRegisterNode: {
    params: { id: string };
  };
}

export type UseTreeViewJSXNodesRegistrationSignature = TreeViewPluginSignature<
  {},
  {},
  UseTreeViewJSXNodesRegistrationInstance,
  UseTreeViewJSXNodesRegistrationEventLookup,
  {},
  never,
  [UseTreeViewInstanceEventsSignature]
>;
