import * as React from 'react';
import PropTypes from 'prop-types';
import { useTreeViewContext } from './useTreeViewContext';
import type { UseTreeViewJSXNodesSignature } from '../plugins/useTreeViewJSXNodes';
import { TreeViewItemChildrenIndexes } from '../plugins/useTreeViewNodes/useTreeViewNodes.types';

function binaryFindPosition(
  otherDescendants: { id: string; element: HTMLLIElement }[],
  element: HTMLLIElement,
) {
  let start = 0;
  let end = otherDescendants.length - 1;

  while (start <= end) {
    const middle = Math.floor((start + end) / 2);

    if (
      // eslint-disable-next-line no-bitwise
      otherDescendants[middle].element.compareDocumentPosition(element) &
      Node.DOCUMENT_POSITION_PRECEDING
    ) {
      end = middle - 1;
    } else {
      start = middle + 1;
    }
  }

  return start;
}

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

  const { instance } = useTreeViewContext<[UseTreeViewJSXNodesSignature]>();
  const parentContext = React.useContext(TreeViewChildrenItemContext);
  const childrenElementRef = React.useRef<Map<string, HTMLLIElement>>(new Map());
  const cachedDescendantIds = React.useRef('');

  React.useEffect(() => {
    let element: HTMLElement | null | undefined;
    if (rootRef) {
      element = rootRef.current;
    } else if (id && parentContext) {
      // The DescendantProvider is not aware of the ref of its own item,
      // but its parent can give him this information.
      element = parentContext.getChild(id);
    }

    // Weak but quick way to check if the descendants have changed and avoid the expensive DOM operations.
    // This is not sufficient to get the new order because this includes grand-children, not only direct children.
    if (element) {
      const newDescendantIds = Array.from(element.querySelectorAll('[role="treeitem"]'))
        .map((child) => child.id)
        .join('\n');
      if (newDescendantIds === cachedDescendantIds.current) {
        return;
      }

      cachedDescendantIds.current = newDescendantIds;
    }

    const orderedChildren: { id: string; element: HTMLLIElement }[] = [];
    childrenElementRef.current.forEach((childElement, childId) => {
      if (orderedChildren.length === 0) {
        orderedChildren.push({ id: childId, element: childElement });
      } else {
        const newPosition = binaryFindPosition(orderedChildren, childElement);
        orderedChildren.splice(newPosition, 0, { id: childId, element: childElement });
      }
    });

    const previousIndexes = instance.getJSXItemsChildrenIndexes(id ?? null);
    const hasChanges =
      Object.keys(previousIndexes).length !== orderedChildren.length ||
      orderedChildren.some((child, index) => index !== previousIndexes[child.id]);
    if (hasChanges) {
      const newIndexes: TreeViewItemChildrenIndexes = {};
      orderedChildren.forEach((child, index) => {
        newIndexes[child.id] = index;
      });
      instance.setJSXItemsChildrenIndexes(id ?? null, newIndexes);
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
