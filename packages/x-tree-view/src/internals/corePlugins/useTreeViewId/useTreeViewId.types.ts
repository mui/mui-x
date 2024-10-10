import { TreeViewPluginSignature } from '../../models';

export interface UseTreeViewIdParameters {
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id?: string;
}

export type UseTreeViewIdDefaultizedParameters = UseTreeViewIdParameters;

export interface UseTreeViewIdState {
  id: {
    treeId: string | undefined;
    providedTreeId: string | undefined;
  };
}

interface UseTreeViewIdContextValue {
  treeId: string | undefined;
}

export type UseTreeViewIdSignature = TreeViewPluginSignature<{
  params: UseTreeViewIdParameters;
  defaultizedParams: UseTreeViewIdDefaultizedParameters;
  state: UseTreeViewIdState;
  contextValue: UseTreeViewIdContextValue;
}>;
