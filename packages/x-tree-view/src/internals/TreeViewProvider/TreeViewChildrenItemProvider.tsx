'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTreeViewContext } from './TreeViewContext';
import { escapeOperandAttributeSelector } from '../utils/utils';
import { itemsSelectors } from '../plugins/items/selectors';
import { SimpleTreeViewStore } from '../SimpleTreeViewStore';

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
    const childrenIds = Array.from(childrenElements).map(
      (child) => childrenIdAttrToIdRef.current.get(child.id)!,
    );

    const hasChanged =
      childrenIds.length !== previousChildrenIds.length ||
      childrenIds.some((childId, index) => childId !== previousChildrenIds[index]);
    if (hasChanged) {
      store.jsxItems.setJSXItemsOrderedChildrenIds(itemId ?? null, childrenIds);
    }
  });

  const value = React.useMemo<TreeViewChildrenItemContextValue>(
    () => ({
      registerChild: (childIdAttribute, childItemId) =>
        childrenIdAttrToIdRef.current.set(childIdAttribute, childItemId),
      unregisterChild: (childIdAttribute) => childrenIdAttrToIdRef.current.delete(childIdAttribute),
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
