import { DefaultizedProps, TreeViewPluginSignature } from '../../models';

export interface UseTreeViewNodesReorderInstance {}

export interface UseTreeViewNodesReorderParameters {
  /**
   * If `true`, the reordering of items is enabled.
   * @default false
   */
  itemsReordering?: boolean;
}

export type UseTreeViewNodesReorderDefaultizedParameters = DefaultizedProps<
  UseTreeViewNodesReorderParameters,
  'itemsReordering'
>;

interface UseTreeViewNodesReorderContextValue
  extends Pick<UseTreeViewNodesReorderDefaultizedParameters, 'itemsReordering'> {}

export type UseTreeViewNodesReorderSignature = TreeViewPluginSignature<{
  params: UseTreeViewNodesReorderParameters;
  defaultizedParams: UseTreeViewNodesReorderDefaultizedParameters;
  instance: UseTreeViewNodesReorderInstance;
  contextValue: UseTreeViewNodesReorderContextValue;
}>;
