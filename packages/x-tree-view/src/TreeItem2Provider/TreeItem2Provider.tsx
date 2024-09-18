import PropTypes from 'prop-types';
import { TreeItem2ProviderProps } from './TreeItem2Provider.types';
import { useTreeViewContext } from '../internals/TreeViewProvider';

function TreeItem2Provider(props: TreeItem2ProviderProps) {
  const { children, itemId, idAttribute } = props;
  const { wrapItem } = useTreeViewContext<[]>();

  return wrapItem({ children, itemId, idAttribute });
}

TreeItem2Provider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  itemId: PropTypes.string.isRequired,
} as any;

export { TreeItem2Provider };
