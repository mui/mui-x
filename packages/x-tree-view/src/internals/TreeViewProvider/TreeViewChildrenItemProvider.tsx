import * as React from 'react';
import PropTypes from 'prop-types';
import { useTreeViewContext } from './useTreeViewContext';
import type { UseTreeViewJSXItemsSignature } from '../plugins/useTreeViewJSXItems';
import { TreeViewItemChildrenIndexes } from '../plugins/useTreeViewItems/useTreeViewItems.types';

export const TreeViewChildrenItemContext =
  React.createContext<TreeViewChildrenItemContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  TreeViewChildrenItemContext.displayName = 'TreeViewChildrenItemContext';
}

interface TreeViewChildrenItemProviderProps {
  itemId?: string;
  rootRef?: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

export function TreeViewChildrenItemProvider(props: TreeViewChildrenItemProviderProps) {
  const { children, rootRef, itemId = null } = props;

  const { instance } = useTreeViewContext<[UseTreeViewJSXItemsSignature]>();
  const parentContext = React.useContext(TreeViewChildrenItemContext);
  const childrenElementRef = React.useRef<Map<string, HTMLLIElement>>(new Map());
  const childrenIdAttrToIdRef = React.useRef<Map<string, string>>(new Map());

  React.useEffect(() => {
    let element: HTMLElement | null | undefined;
    if (rootRef) {
      element = rootRef.current;
    } else if (itemId && parentContext) {
      // The TreeViewChildrenItemProvider is not aware of the ref of its own item,
      // but its parent can give him this information.
      element = parentContext.getChild(itemId);
    }

    if (element) {
      const childrenIds = Array.from(
        element.querySelectorAll(`[role="treeitem"]${id == null ? '' : `[data-parentid="${id}"]`}`),
      ).map((child) => childrenIdAttrToIdRef.current.get(child.id));

      const previousIndexes = instance.getJSXItemsChildrenIndexes(itemId ?? null);
      const hasChanges =
        Object.keys(previousIndexes).length !== childrenIds.length ||
        childrenIds.some((childId, index) => index !== previousIndexes[childId]);
      if (hasChanges) {
        const newIndexes: TreeViewItemChildrenIndexes = {};
        childrenIds.forEach((childId, index) => {
          newIndexes[childId] = index;
        });
        instance.setJSXItemsChildrenIndexes(itemId ?? null, newIndexes);
      }
    }
  });

  const value = React.useMemo<TreeViewChildrenItemContextValue>(
    () => ({
      registerChild: (childId, element, childIdAttribute) => {
        childrenElementRef.current.set(childId, element);
        childrenIdAttrToIdRef.current.set(childIdAttribute, childId);
      },
      unregisterChild: (childId, childIdAttribute) => {
        childrenElementRef.current.delete(childId);
        childrenIdAttrToIdRef.current.delete(childIdAttribute);
      },
      getChild: (childId) => childrenElementRef.current.get(childId),
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
  registerChild: (itemId: string, element: HTMLLIElement, idAttribute: string) => void;
  unregisterChild: (itemId: string, idAttribute: string) => void;
  getChild: (itemId: string) => HTMLLIElement | undefined;
  parentId: string | null;
}
