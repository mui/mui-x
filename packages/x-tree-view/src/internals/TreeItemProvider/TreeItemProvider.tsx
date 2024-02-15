import { TreeItemProviderProps } from './TreeItemProvider.types';
import { useTreeViewContext } from '../TreeViewProvider/useTreeViewContext';

export function TreeItemProvider(props: TreeItemProviderProps) {
  const { children, nodeId } = props;
  const { wrapItem } = useTreeViewContext<[]>();

  return wrapItem({ children, nodeId });
}
