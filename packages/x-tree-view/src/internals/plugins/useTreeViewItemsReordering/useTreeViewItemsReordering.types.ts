import { DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';

export interface UseTreeViewItemsReorderingHandler {
  enabled: boolean;
  handleDragStart: (nodeId: string) => void;
  handleDragOver: (nodeId: string) => void;
  handleDragEnd: (nodeId: string) => void;
}

export interface UseTreeViewItemsReorderingInstance {}

export interface UseTreeViewItemsReorderingParameters {
  /**
   * If `true`, the reordering of items is enabled.
   * @default false
   */
  itemsReordering?: boolean;
}

export type UseTreeViewItemsReorderingDefaultizedParameters = DefaultizedProps<
  UseTreeViewItemsReorderingParameters,
  'itemsReordering'
>;

interface UseTreeViewItemsReorderingState {
  draggedNodeId: string | null;
}

interface UseTreeViewItemsReorderingContextValue {
  itemsReordering: UseTreeViewItemsReorderingHandler;
}

export type UseTreeViewItemsReorderingSignature = TreeViewPluginSignature<{
  params: UseTreeViewItemsReorderingParameters;
  defaultizedParams: UseTreeViewItemsReorderingDefaultizedParameters;
  instance: UseTreeViewItemsReorderingInstance;
  state: UseTreeViewItemsReorderingState;
  contextValue: UseTreeViewItemsReorderingContextValue;
  dependantPlugins: [UseTreeViewNodesSignature];
}>;
