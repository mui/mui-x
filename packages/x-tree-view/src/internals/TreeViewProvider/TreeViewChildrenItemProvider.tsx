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
  id?: string;
  rootRef?: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

export function TreeViewChildrenItemProvider(props: TreeViewChildrenItemProviderProps) {
  const { children, rootRef, id = null } = props;

  const { instance } = useTreeViewContext<[UseTreeViewJSXItemsSignature]>();
  const parentContext = React.useContext(TreeViewChildrenItemContext);
  const childrenElementRef = React.useRef<Map<string, HTMLLIElement>>(new Map());

  React.useEffect(() => {
    let element: HTMLElement | null | undefined;
    if (rootRef) {
      element = rootRef.current;
    } else if (id && parentContext) {
      // The TreeViewChildrenItemProvider is not aware of the ref of its own item,
      // but its parent can give him this information.
      element = parentContext.getChild(id);
    }

    if (element) {
      const childrenIds = Array.from(
        element.querySelectorAll(`[role="treeitem"]${id == null ? '' : `[data-parentid="${id}"]`}`),
      ).map((child) => (child as HTMLElement).dataset.id!);

      const previousIndexes = instance.getJSXItemsChildrenIndexes(id ?? null);
      const hasChanges =
        Object.keys(previousIndexes).length !== childrenIds.length ||
        childrenIds.some((childId, index) => index !== previousIndexes[childId]);
      if (hasChanges) {
        const newIndexes: TreeViewItemChildrenIndexes = {};
        childrenIds.forEach((childId, index) => {
          newIndexes[childId] = index;
        });
        instance.setJSXItemsChildrenIndexes(id ?? null, newIndexes);
      }
    }
  });

  const value = React.useMemo<TreeViewChildrenItemContextValue>(
    () => ({
      registerChild: (itemId, element) => childrenElementRef.current.set(itemId, element),
      unregisterChild: (itemId) => childrenElementRef.current.delete(itemId),
      getChild: (itemId) => childrenElementRef.current.get(itemId),
      parentId: id,
    }),
    [id],
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
  registerChild: (itemId: string, element: HTMLLIElement) => void;
  unregisterChild: (itemId: string) => void;
  getChild: (itemId: string) => HTMLLIElement | undefined;
  parentId: string | null;
}
