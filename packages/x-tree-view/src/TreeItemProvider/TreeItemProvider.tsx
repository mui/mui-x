'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useStore } from '@mui/x-internals/store';
import { TreeItemProviderProps } from './TreeItemProvider.types';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import { idSelectors } from '../internals/plugins/id';
import { TreeViewAnyStore } from '../internals/models';

function TreeItemProvider(props: TreeItemProviderProps) {
  const { children, itemId, id } = props;
  const { wrapItem, store } = useTreeViewContext<TreeViewAnyStore>();
  const idAttribute = useStore(store, idSelectors.treeItemIdAttribute, itemId, id);

  return <React.Fragment>{wrapItem({ children, itemId, store, idAttribute })}</React.Fragment>;
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
