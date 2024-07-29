import * as React from 'react';
import PropTypes from 'prop-types';
import { useTreeViewContext } from './useTreeViewContext';
import { escapeOperandAttributeSelector } from '../utils/utils';
import type { UseTreeViewJSXItemsSignature } from '../plugins/useTreeViewJSXItems';
import type { UseTreeViewItemsSignature } from '../plugins/useTreeViewItems';

export const TreeViewChildrenItemContext =
  React.createContext<TreeViewChildrenItemContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  TreeViewChildrenItemContext.displayName = 'TreeViewChildrenItemContext';
}

interface TreeViewChildrenItemProviderProps {
  itemId?: string;
  children: React.ReactNode;
}

export function TreeViewChildrenItemProvider(props: TreeViewChildrenItemProviderProps) {
  const { children, itemId = null } = props;

  const { instance, rootRef } =
    useTreeViewContext<[UseTreeViewJSXItemsSignature, UseTreeViewItemsSignature]>();
  const childrenIdAttrToIdRef = React.useRef<Map<string, string>>(new Map());

  React.useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    let idAttr: string | null = null;
    if (itemId == null) {
      idAttr = rootRef.current.id;
    } else {
      // Undefined during 1st render
      const itemMeta = instance.getItemMeta(itemId);
      if (itemMeta !== undefined) {
        idAttr = instance.getTreeItemIdAttribute(itemId, itemMeta.idAttribute);
      }
    }

    if (idAttr == null) {
      return;
    }

    const previousChildrenIds = instance.getItemOrderedChildrenIds(itemId ?? null) ?? [];
    const escapedIdAttr = escapeOperandAttributeSelector(idAttr);
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
      instance.setJSXItemsOrderedChildrenIds(itemId ?? null, childrenIds);
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
