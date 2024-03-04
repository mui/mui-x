import { TreeItemNextProviderProps } from './TreeItemNextProvider.types';
import { useTreeViewContext } from '../TreeViewProvider/useTreeViewContext';

export function TreeItemNextProvider(props: TreeItemNextProviderProps) {
  const { children, nodeId } = props;
  const { wrapItem } = useTreeViewContext<[]>();

  return wrapItem({ children, nodeId });
}
