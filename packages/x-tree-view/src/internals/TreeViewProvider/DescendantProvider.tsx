import * as React from 'react';
import PropTypes from 'prop-types';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
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

const DescendantContext = React.createContext<DescendantContextValue>({});

if (process.env.NODE_ENV !== 'production') {
  DescendantContext.displayName = 'DescendantContext';
}

const noop = () => {};

/**
 * This hook registers our descendant by passing it into an array. We can then
 * search that array by to find its index when registering it in the component.
 * We use this for focus management, keyboard navigation, and typeahead
 * functionality for some components.
 *
 * The hook accepts the element node
 *
 * Our main goals with this are:
 *   1) maximum composability,
 *   2) minimal API friction
 *   3) SSR compatibility*
 *   4) concurrent safe
 *   5) index always up-to-date with the tree despite changes
 *   6) works with memoization of any component in the tree (hopefully)
 *
 * * As for SSR, the good news is that we don't actually need the index on the
 * server for most use-cases, as we are only using it to determine the order of
 * composed descendants for keyboard navigation.
 */
export function useDescendant(descendant: TreeItemDescendant) {
  const [, forceUpdate] = React.useState<{}>();
  const {
    registerDescendant = noop,
    unregisterDescendant = noop,
    parentId = null,
  } = React.useContext(DescendantContext);

  // Prevent any flashing
  useEnhancedEffect(() => {
    if (descendant.element) {
      registerDescendant(descendant);

      return () => {
        unregisterDescendant(descendant.element);
      };
    }
    forceUpdate({});

    return undefined;
  }, [registerDescendant, unregisterDescendant, descendant]);

  return parentId;
}

interface DescendantProviderProps {
  id?: string;
  children: React.ReactNode;
}

export function DescendantProvider(props: DescendantProviderProps) {
  const { children, id } = props;

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
  registerDescendant?: (params: TreeItemDescendant) => void;
  unregisterDescendant?: (params: HTMLLIElement) => void;
  parentId?: string | null;
}
