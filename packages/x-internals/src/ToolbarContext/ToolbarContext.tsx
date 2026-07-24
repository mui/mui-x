'use client';
import * as React from 'react';

export interface ToolbarContextValue {
  focusableItemId: string | null;
  registerItem: (id: string, ref: React.RefObject<HTMLButtonElement | null>) => void;
  unregisterItem: (id: string) => void;
  onItemKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onItemFocus: (id: string) => void;
  onItemBlur: (id: string, event: React.FocusEvent<HTMLButtonElement>) => void;
  onItemDisabled: (id: string) => void;
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
  const focusableItemIdRef = React.useRef<string | null>(focusableItemId);
  // The item that currently has real DOM focus, `null` when focus is outside the toolbar.
  const focusedItemIdRef = React.useRef<string | null>(null);
  const [items, setItems] = React.useState<Item[]>([]);

  const updateFocusableItemId = React.useCallback((id: string | null) => {
    focusableItemIdRef.current = id;
    setFocusableItemId(id);
  }, []);

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

      if (newIndex >= 0 && newIndex < sortedItems.length) {
        const item = sortedItems[newIndex];
        updateFocusableItemId(item.id);
        item.ref.current?.focus();
      }
    },
    [getSortedItems, focusableItemId, findEnabledItem, updateFocusableItemId],
  );

  const onItemFocus = React.useCallback(
    (id: string) => {
      focusedItemIdRef.current = id;
      if (focusableItemId !== id) {
        updateFocusableItemId(id);
      }
    },
    [focusableItemId, updateFocusableItemId],
  );

  const onItemBlur = React.useCallback((id: string, event: React.FocusEvent<HTMLButtonElement>) => {
    // When a focused item becomes disabled, the browser blurs it before the
    // `onItemDisabled` effect runs. Keep tracking it as the focused item in that
    // case so `onItemDisabled` can move focus to the next enabled item.
    if (event.currentTarget.disabled) {
      return;
    }
    if (focusedItemIdRef.current === id) {
      focusedItemIdRef.current = null;
    }
  }, []);

  const onItemDisabled = React.useCallback(
    (id: string) => {
      const itemHadFocus = focusedItemIdRef.current === id;
      const itemWasTabStop = focusableItemIdRef.current === id;

      // Disabling an item the user is not interacting with must not move focus,
      // and only requires a new tab stop if the disabled item was the tab stop.
      if (!itemHadFocus && !itemWasTabStop) {
        return;
      }

      const sortedItems = getSortedItems();
      const currentIndex = sortedItems.findIndex((item) => item.id === id);
      if (currentIndex === -1) {
        return;
      }

      // An `aria-disabled` item is still focusable, so real focus can stay where
      // it is. Only a `disabled` item drops focus and needs it restored.
      const focusLost = itemHadFocus && Boolean(sortedItems[currentIndex].ref.current?.disabled);

      const newIndex = findEnabledItem(currentIndex, 1);
      if (newIndex >= 0 && newIndex < sortedItems.length) {
        const item = sortedItems[newIndex];
        updateFocusableItemId(item.id);
        if (focusLost) {
          focusedItemIdRef.current = item.id;
          item.ref.current?.focus();
        }
      } else if (focusLost) {
        // No enabled item to move focus to
        focusedItemIdRef.current = null;
      }
    },
    [getSortedItems, findEnabledItem, updateFocusableItemId],
  );

  React.useEffect(() => {
    const sortedItems = getSortedItems();

    if (sortedItems.length === 0) {
      return;
    }

    // Set initial focusable item
    if (!focusableItemIdRef.current) {
      updateFocusableItemId(sortedItems[0].id);
      return;
    }

    const focusableItemExists = sortedItems.some((item) => item.id === focusableItemIdRef.current);

    if (!focusableItemExists) {
      // The tab stop has been removed from the items array, assign it to the last item
      const fallbackItem = sortedItems[sortedItems.length - 1];
      updateFocusableItemId(fallbackItem.id);

      // Move real focus only if the removed item had focus
      if (
        focusedItemIdRef.current !== null &&
        !sortedItems.some((item) => item.id === focusedItemIdRef.current)
      ) {
        focusedItemIdRef.current = fallbackItem.id;
        fallbackItem.ref.current?.focus();
      }
    }
  }, [getSortedItems, updateFocusableItemId]);

  const contextValue = React.useMemo(
    () => ({
      focusableItemId,
      registerItem,
      unregisterItem,
      onItemKeyDown,
      onItemFocus,
      onItemBlur,
      onItemDisabled,
    }),
    [
      focusableItemId,
      registerItem,
      unregisterItem,
      onItemKeyDown,
      onItemFocus,
      onItemBlur,
      onItemDisabled,
    ],
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
