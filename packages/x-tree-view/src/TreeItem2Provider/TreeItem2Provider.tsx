import { TreeItem2ProviderProps } from './TreeItem2Provider.types';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';

export function TreeItem2Provider(props: TreeItem2ProviderProps) {
  const { children, nodeId } = props;
  const { wrapItem } = useTreeViewContext<[]>();

  return wrapItem({ children, nodeId });
}
