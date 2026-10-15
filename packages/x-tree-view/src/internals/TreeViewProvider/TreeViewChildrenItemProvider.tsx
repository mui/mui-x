'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useStore } from '@base-ui/utils/store';
import { useTreeViewContext } from './TreeViewContext';
import { idSelectors } from '../plugins/id';
import type { SimpleTreeViewStore } from '../SimpleTreeViewStore';

export const TreeViewChildrenItemContext = React.createContext<{ parentId: string | null } | null>(
  null,
);

const ROOT_PARENT_CONTEXT = { parentId: null };

interface TreeViewChildrenItemProviderProps {
  children: React.ReactNode;
  items: React.ReactNode;
}

export function TreeViewChildrenItemProvider(props: TreeViewChildrenItemProviderProps) {
  const { children, items } = props;
  const { store, rootRef } = useTreeViewContext<SimpleTreeViewStore<any>>();
  const treeId = useStore(store, idSelectors.treeId);
  const [, refresh] = React.useReducer((version: number) => version + 1, 0);

  useIsoLayoutEffect(() => store.jsxItems.setOrderingRoot(rootRef, refresh), [store, rootRef]);
  useIsoLayoutEffect(() => {
    store.jsxItems.requestOrderUpdate(null);
  }, [store, items, treeId]);

  // Flush after all item layout effects. A single root refresh also covers
  // subtree-only updates and Suspense, without deferring public API updates to a microtask.
  React.useEffect(() => {
    store.jsxItems.syncItemOrder();
  });

  return (
    <TreeViewChildrenItemContext.Provider value={ROOT_PARENT_CONTEXT}>
      {children}
    </TreeViewChildrenItemContext.Provider>
  );
}

TreeViewChildrenItemProvider.propTypes = {
  children: PropTypes.node,
  items: PropTypes.node,
} as any;
