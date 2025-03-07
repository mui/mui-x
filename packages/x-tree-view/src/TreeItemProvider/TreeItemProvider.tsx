'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { TreeItemProviderProps } from './TreeItemProvider.types';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import { generateTreeItemIdAttribute } from '../internals/corePlugins/useTreeViewId/useTreeViewId.utils';
import { useSelector } from '../internals/hooks/useSelector';
import { selectorTreeViewId } from '../internals/corePlugins/useTreeViewId/useTreeViewId.selectors';

function TreeItemProvider(props: TreeItemProviderProps) {
  const { children, itemId, id } = props;
  const { wrapItem, instance, store } = useTreeViewContext<[]>();
  const treeId = useSelector(store, selectorTreeViewId);
  const idAttribute = generateTreeItemIdAttribute({ itemId, treeId, id });

  return <React.Fragment>{wrapItem({ children, itemId, instance, idAttribute })}</React.Fragment>;
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
