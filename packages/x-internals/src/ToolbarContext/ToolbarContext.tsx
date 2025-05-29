'use client';
import * as React from 'react';

export interface ToolbarContextValue {
  focusableItemId: string | null;
  registerItem: (id: string, ref: React.RefObject<HTMLButtonElement | null>) => void;
  unregisterItem: (id: string) => void;
  onItemKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onItemFocus: (id: string) => void;
  onItemDisabled: (id: string, disabled: boolean) => void;
}

export const ToolbarContext = React.createContext<ToolbarContextValue | undefined>(undefined);

export function useToolbarContext() {
  const context = React.useContext(ToolbarContext);

  if (context === undefined) {
    throw new Error(
      'MUI X: Missing context. Toolbar subcomponents must be placed within a <Toolbar /> component.',
    );
  }

  return context;
}

type Item = {
  id: string;
  ref: React.RefObject<HTMLButtonElement | null>;
};

export function ToolbarContextProvider({ children }: React.PropsWithChildren) {
  const [focusableItemId, setFocusableItemId] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<Item[]>([]);

  const getSortedItems = React.useCallback(() => items.sort(sortByDocumentPosition), [items]);

  const findEnabledItem = React.useCallback(
    (startIndex: number, step: number, wrap = true): number => {
      let index = startIndex;
      const sortedItems = getSortedItems();
      const itemCount = sortedItems.length;

      // Look for enabled items in the specified direction
      for (let i = 0; i < itemCount; i += 1) {
        index += step;

        // Handle wrapping around the ends
        if (index >= itemCount) {
          if (!wrap) {
            return -1;
          }
          index = 0;
        } else if (index < 0) {
          if (!wrap) {
            return -1;
          }
          index = itemCount - 1;
        }

        // Return if we found an enabled item
        if (
          !sortedItems[index].ref.current?.disabled &&
          sortedItems[index].ref.current?.ariaDisabled !== 'true'
        ) {
          return index;
        }
      }

      // If we've checked all items and found none enabled
      return -1;
    },
    [getSortedItems],
  );

  const registerItem = React.useCallback(
    (id: string, itemRef: React.RefObject<HTMLButtonElement | null>) => {
      setItems((prevItems) => [...prevItems, { id, ref: itemRef }]);
    },
    [],
  );

  const unregisterItem = React.useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  }, []);

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!focusableItemId) {
        return;
      }

      const sortedItems = getSortedItems();
      const focusableItemIndex = sortedItems.findIndex((item) => item.id === focusableItemId);

      let newIndex = -1;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        newIndex = findEnabledItem(focusableItemIndex, 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        newIndex = findEnabledItem(focusableItemIndex, -1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        newIndex = findEnabledItem(-1, 1, false);
      } else if (event.key === 'End') {
        event.preventDefault();
        newIndex = findEnabledItem(sortedItems.length, -1, false);
      }

      // TODO: Check why this is necessary
      if (newIndex >= 0 && newIndex < sortedItems.length) {
        const item = sortedItems[newIndex];
        setFocusableItemId(item.id);
        item.ref.current?.focus();
      }
    },
    [getSortedItems, focusableItemId, findEnabledItem],
  );

  const onItemFocus = React.useCallback(
    (id: string) => {
      if (focusableItemId !== id) {
        setFocusableItemId(id);
      }
    },
    [focusableItemId, setFocusableItemId],
  );

  const onItemDisabled = React.useCallback(
    (id: string) => {
      const sortedItems = getSortedItems();
      const currentIndex = sortedItems.findIndex((item) => item.id === id);
      const newIndex = findEnabledItem(currentIndex, 1);
      if (newIndex >= 0 && newIndex < sortedItems.length) {
        const item = sortedItems[newIndex];
        setFocusableItemId(item.id);
        item.ref.current?.focus();
      }
    },
    [getSortedItems, findEnabledItem],
  );

  React.useEffect(() => {
    const sortedItems = getSortedItems();

    if (sortedItems.length > 0) {
      // Set initial focusable item
      if (!focusableItemId) {
        setFocusableItemId(sortedItems[0].id);
        return;
      }

      const focusableItemIndex = sortedItems.findIndex((item) => item.id === focusableItemId);

      if (!sortedItems[focusableItemIndex]) {
        // Last item has been removed from the items array
        const item = sortedItems[sortedItems.length - 1];
        if (item) {
          setFocusableItemId(item.id);
          item.ref.current?.focus();
        }
      } else if (focusableItemIndex === -1) {
        // Focused item has been removed from the items array
        const item = sortedItems[focusableItemIndex];
        if (item) {
          setFocusableItemId(item.id);
          item.ref.current?.focus();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSortedItems, findEnabledItem]);

  const contextValue = React.useMemo(
    () => ({
      focusableItemId,
      registerItem,
      unregisterItem,
      onItemKeyDown,
      onItemFocus,
      onItemDisabled,
    }),
    [focusableItemId, registerItem, unregisterItem, onItemKeyDown, onItemFocus, onItemDisabled],
  );

  return <ToolbarContext.Provider value={contextValue}>{children}</ToolbarContext.Provider>;
}

/* eslint-disable no-bitwise */
function sortByDocumentPosition(
  a: { ref: React.RefObject<HTMLButtonElement | null> },
  b: { ref: React.RefObject<HTMLButtonElement | null> },
) {
  if (!a.ref.current || !b.ref.current) {
    return 0;
  }

  const position = a.ref.current.compareDocumentPosition(b.ref.current);

  if (!position) {
    return 0;
  }

  if (
    position & Node.DOCUMENT_POSITION_FOLLOWING ||
    position & Node.DOCUMENT_POSITION_CONTAINED_BY
  ) {
    return -1;
  }

  if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
    return 1;
  }

  return 0;
}
