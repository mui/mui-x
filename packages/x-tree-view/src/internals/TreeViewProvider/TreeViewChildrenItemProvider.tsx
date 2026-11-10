'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTreeViewContext } from './TreeViewContext';
import { escapeOperandAttributeSelector } from '../utils/utils';
import { itemsSelectors } from '../plugins/items/selectors';
import type { TreeViewItemId } from '../../models';
import type { SimpleTreeViewStore } from '../SimpleTreeViewStore';

export const TreeViewChildrenItemContext =
  React.createContext<TreeViewChildrenItemContextValue | null>(null);

interface TreeViewChildrenItemProviderProps {
  itemId: string | null;
  idAttribute: string | null;
  children: React.ReactNode;
}

export function TreeViewChildrenItemProvider(props: TreeViewChildrenItemProviderProps) {
  const { children, itemId = null, idAttribute } = props;

  const { store, rootRef } = useTreeViewContext<SimpleTreeViewStore<any>>();
  const childrenIdAttrToIdRef = React.useRef<Map<string, string>>(new Map());
  const [, refreshChildrenIds] = React.useReducer((version: number) => version + 1, 0);

  React.useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const previousChildrenIds =
      itemsSelectors.itemOrderedChildrenIds(store.state, itemId ?? null) ?? [];
    const escapedIdAttr = escapeOperandAttributeSelector(idAttribute ?? rootRef.current.id);

    // If collapsed, skip childrenIds update prevents clearing the parent's indeterminate state after opening a sibling.
    if (itemId != null) {
      const itemRoot = rootRef.current.querySelector(
        `*[id="${escapedIdAttr}"][role="treeitem"]`,
      ) as HTMLElement | null;
      if (itemRoot && itemRoot.getAttribute('aria-expanded') === 'false') {
        return;
      }
    }

    const childrenElements = rootRef.current.querySelectorAll(
      `${itemId == null ? '' : `*[id="${escapedIdAttr}"] `}[role="treeitem"]:not(*[id="${escapedIdAttr}"] [role="treeitem"] [role="treeitem"])`,
    );
    // An element whose id is missing from the map is not currently a child: React
    // destroys the layout effect that registers it when it hides a suspended
    // subtree, but leaves the element in the DOM, so the query above still finds
    // it. Keeping the resulting `undefined` would be fatal, because
    // `itemsSelectors.itemOrderedChildrenIds` resolves a nullish item id to the
    // root of the tree, which makes the descendant traversals built on top of it
    // cycle back to the root and recurse until the stack overflows.
    const childrenIds = Array.from(childrenElements)
      .map((child) => childrenIdAttrToIdRef.current.get(child.id))
      .filter((childId): childId is TreeViewItemId => childId != null);

    const hasChanged =
      childrenIds.length !== previousChildrenIds.length ||
      childrenIds.some((childId, index) => childId !== previousChildrenIds[index]);
    if (hasChanged) {
      store.jsxItems.setJSXItemsOrderedChildrenIds(itemId ?? null, childrenIds);
    }
  });

  const value = React.useMemo<TreeViewChildrenItemContextValue>(
    () => ({
      // React hides a suspended subtree and reveals it again without rerendering this
      // provider, so writing to the ref is not enough: the rerender is what makes the
      // effect above recompute the order. Without it, a child that comes back is on
      // the screen but missing from the order, and keyboard navigation skips over it.
      registerChild: (childIdAttribute, childItemId) => {
        childrenIdAttrToIdRef.current.set(childIdAttribute, childItemId);
        refreshChildrenIds();
      },
      unregisterChild: (childIdAttribute) => {
        childrenIdAttrToIdRef.current.delete(childIdAttribute);
        refreshChildrenIds();
      },
      parentId: itemId,
    }),
    [itemId],
  );

  return (
    <TreeViewChildrenItemContext.Provider value={value}>
      {children}
    </TreeViewChildrenItemContext.Provider>
  );
}

TreeViewChildrenItemProvider.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
} as any;

interface TreeViewChildrenItemContextValue {
  registerChild: (idAttribute: string, itemId: string) => void;
  unregisterChild: (idAttribute: string) => void;
  parentId: string | null;
}
