import PropTypes from 'prop-types';
import { TreeItemProviderProps } from './TreeItemProvider.types';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import { generateTreeItemIdAttribute } from '../internals/corePlugins/useTreeViewId/useTreeViewId.utils';

/**
 * @ignore - internal component.
 */
function TreeItemProvider(props: TreeItemProviderProps) {
  const { children, itemId, id } = props;
  const { wrapItem, instance, treeId } = useTreeViewContext<[]>();
  const idAttribute = generateTreeItemIdAttribute({ itemId, treeId, id });

  return wrapItem({ children, itemId, instance, idAttribute });
}

TreeItemProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  id: PropTypes.string,
  itemId: PropTypes.string.isRequired,
} as any;

export { TreeItemProvider };
