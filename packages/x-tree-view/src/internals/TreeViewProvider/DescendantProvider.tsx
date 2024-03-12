import * as React from 'react';
import PropTypes from 'prop-types';
import { useTreeViewContext } from './useTreeViewContext';
import type { UseTreeViewJSXNodesSignature } from '../plugins/useTreeViewJSXNodes';
import { TreeViewItemChildrenIndexes } from '../plugins/useTreeViewNodes/useTreeViewNodes.types';

/** Credit: https://github.com/reach/reach-ui/blob/86a046f54d53b6420e392b3fa56dd991d9d4e458/packages/descendants/README.md
 *  Modified slightly to suit our purposes.
 */
function binaryFindPosition(otherDescendants: TreeItemDescendant[], element: HTMLLIElement) {
  let start = 0;
  let end = otherDescendants.length;

  while (start < end - 1) {
    const middle = Math.floor((start + end) / 2);

    if (
      // eslint-disable-next-line no-bitwise
      otherDescendants[middle].element.compareDocumentPosition(element) &
      Node.DOCUMENT_POSITION_PRECEDING
    ) {
      end = middle;
    } else {
      start = middle;
    }
  }

  return end;
}

export const DescendantContext = React.createContext<DescendantContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  DescendantContext.displayName = 'DescendantContext';
}

interface DescendantProviderProps {
  id?: string;
  children: React.ReactNode;
}

export function DescendantProvider(props: DescendantProviderProps) {
  const { children, id = null } = props;

  const { instance } = useTreeViewContext<[UseTreeViewJSXNodesSignature]>();

  const descendantElementRef = React.useRef<Map<string, HTMLLIElement>>(new Map());
  const registerDescendant = React.useCallback((descendant: TreeItemDescendant) => {
    descendantElementRef.current.set(descendant.id, descendant.element);
  }, []);

  const unregisterDescendant = React.useCallback((element: HTMLLIElement) => {
    descendantElementRef.current.delete(element.id);
  }, []);

  React.useEffect(() => {
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
  registerDescendant: (params: TreeItemDescendant) => void;
  unregisterDescendant: (params: HTMLLIElement) => void;
  parentId: string | null;
}
