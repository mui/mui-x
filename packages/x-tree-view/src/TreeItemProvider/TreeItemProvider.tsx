'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useStore } from '@mui/x-internals/store';
import { TreeItemProviderProps } from './TreeItemProvider.types';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import { generateTreeItemIdAttribute } from '../internals/corePlugins/useTreeViewId/useTreeViewId.utils';
import { idSelectors } from '../internals/corePlugins/useTreeViewId';

function TreeItemProvider(props: TreeItemProviderProps) {
  const { children, itemId, id } = props;
  const { wrapItem, instance, store } = useTreeViewContext<[]>();
  const treeId = useStore(store, idSelectors.treeId);
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
