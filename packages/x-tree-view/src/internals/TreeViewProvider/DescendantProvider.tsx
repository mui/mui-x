import * as React from 'react';
import PropTypes from 'prop-types';
import { useTreeViewContext } from './useTreeViewContext';
import type { UseTreeViewJSXNodesSignature } from '../plugins/useTreeViewJSXNodes';
import { TreeViewItemChildrenIndexes } from '../plugins/useTreeViewNodes/useTreeViewNodes.types';

function binaryFindPosition(otherDescendants: TreeItemDescendant[], element: HTMLLIElement) {
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

export const DescendantContext = React.createContext<DescendantContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  DescendantContext.displayName = 'DescendantContext';
}

interface DescendantProviderProps {
  id?: string;
  rootRef?: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

export function DescendantProvider(props: DescendantProviderProps) {
  const { children, rootRef, id = null } = props;

  const { instance } = useTreeViewContext<[UseTreeViewJSXNodesSignature]>();
  const descendantContext = React.useContext(DescendantContext);

  const descendantElementRef = React.useRef<Map<string, HTMLLIElement>>(new Map());
  const registerDescendant = React.useCallback((descendant: TreeItemDescendant) => {
    descendantElementRef.current.set(descendant.id, descendant.element);
  }, []);

  const unregisterDescendant = React.useCallback((itemId: string) => {
    descendantElementRef.current.delete(itemId);
  }, []);

  const getDescendant = React.useCallback((itemId: string) => {
    return descendantElementRef.current.get(itemId);
  }, []);

  const cachedDescendantIds = React.useRef('');
  React.useEffect(() => {
    let element: HTMLElement | null | undefined;
    if (rootRef) {
      element = rootRef.current;
    } else if (id && descendantContext) {
      element = descendantContext.getDescendant(id);
    }

    // Weak but quick way to check if the descendants have changed and avoid the expensive DOM operations.
    // This is not sufficient to get the new order because this includes grand-children.
    if (element) {
      const newDescendantIds = Array.from(element.querySelectorAll('[role="treeitem"]'))
        .map((child) => child.id)
        .join('\n');
      if (newDescendantIds === cachedDescendantIds.current) {
        return;
      }

      cachedDescendantIds.current = newDescendantIds;
    }

    const orderedDescendants: TreeItemDescendant[] = [];
    descendantElementRef.current.forEach((descendantElement, descendantId) => {
      if (orderedDescendants.length === 0) {
        orderedDescendants.push({ id: descendantId, element: descendantElement });
      } else {
        const newPosition = binaryFindPosition(orderedDescendants, descendantElement);
        orderedDescendants.splice(newPosition, 0, { id: descendantId, element: descendantElement });
      }
    });

    const previousIndexes = instance.getJSXItemsChildrenIndexes(id ?? null);
    const hasChanges =
      Object.keys(previousIndexes).length !== orderedDescendants.length ||
      orderedDescendants.some((descendant, index) => index !== previousIndexes[descendant.id]);
    if (hasChanges) {
      const newIndexes: TreeViewItemChildrenIndexes = {};
      orderedDescendants.forEach((descendant, index) => {
        newIndexes[descendant.id] = index;
      });

      instance.setJSXItemsChildrenIndexes(id ?? null, newIndexes);
    }
  });

  const value = React.useMemo(
    () => ({
      registerDescendant,
      unregisterDescendant,
      getDescendant,
      parentId: id,
    }),
    [registerDescendant, unregisterDescendant, id],
  );

  return <DescendantContext.Provider value={value}>{children}</DescendantContext.Provider>;
}

DescendantProvider.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
} as any;

export interface TreeItemDescendant {
  element: HTMLLIElement;
  id: string;
}

interface DescendantContextValue {
  registerDescendant: (descendant: TreeItemDescendant) => void;
  unregisterDescendant: (itemId: string) => void;
  getDescendant: (itemId: string) => HTMLLIElement | undefined;
  parentId: string | null;
}
