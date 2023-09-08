import { TreeViewNode, TreeViewPluginSignature } from '../../models';

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
  []
>;
