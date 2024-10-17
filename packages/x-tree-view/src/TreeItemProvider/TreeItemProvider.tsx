import PropTypes from 'prop-types';
import { TreeItemProviderProps } from './TreeItemProvider.types';
import { useTreeViewContext } from '../internals/TreeViewProvider';

/**
 * @ignore - internal component.
 */
function TreeItemProvider(props: TreeItemProviderProps) {
  const { children, itemId } = props;
  const { wrapItem, instance } = useTreeViewContext<[]>();

  return wrapItem({ children, itemId, instance });
}

TreeItemProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  itemId: PropTypes.string.isRequired,
} as any;

export { TreeItemProvider };
