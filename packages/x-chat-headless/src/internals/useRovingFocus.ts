'use client';
import * as React from 'react';

// Module-level persistence of the last focused item id, namespaced per consumer
// `scope` so multiple lists sharing the same restore key (e.g. the conversation
// list and the message list are both keyed by the chat store) cannot overwrite
// each other's stored focus.
const lastFocusedIdByKey = new WeakMap<object, Map<string, string>>();

function readStoredId(restoreKey: object, scope: string): string | undefined {
  return lastFocusedIdByKey.get(restoreKey)?.get(scope);
}

function writeStoredId(restoreKey: object, scope: string, id: string): void {
  let scopes = lastFocusedIdByKey.get(restoreKey);
  if (scopes == null) {
    scopes = new Map();
    lastFocusedIdByKey.set(restoreKey, scopes);
  }
  scopes.set(scope, id);
}

export interface UseRovingFocusParameters {
  /** Ordered item ids. Must match the rendered DOM order. */
  itemIds: string[];
  /**
   * Stable object key (typically the chat store) used to persist the last
   * focused id across unmounts of the consumer.
   */
  restoreKey: object;
  /**
   * Namespace within `restoreKey` (e.g. `'conversation-list'`,
   * `'message-list'`) so independent lists never collide.
   */
  scope: string;
  /**
   * Preferred tab stop when the user has not focused an item yet (e.g. the
   * active conversation). Consulted per render, after the stored/interactive
   * focus and before `fallback`.
   */
  preferredId?: string;
  /**
   * Which end of the list receives the tab stop when neither an interactive
   * focus nor `preferredId` resolves. The message list uses `'last'` so the
   * tab stop tracks the newest message until the user interacts.
   * @default 'first'
   */
  fallback?: 'first' | 'last';
  /**
   * Invoked on Enter / Space. When omitted those keys are ignored by the hook
   * and fall through to the consumer (the message list uses Enter for
   * drill-in instead of activation).
   */
  onActivate?: (id: string) => void;
  /**
   * Type-ahead label accessor. When omitted, printable keys are ignored by
   * the hook and fall through to the consumer.
   */
  getTypeAheadLabel?: (id: string) => string | undefined;
  /**
   * Whether PageUp/PageDown move focus by a page of items. The message list
   * disables this so the keys keep their native scrolling behavior (the only
   * way to read a message taller than the viewport with the keyboard).
   * @default true
   */
  enablePageKeys?: boolean;
  /**
   * Page-size divisor for PageUp/PageDown: page = max(1, floor(count / divisor)).
   * @default 10
   */
  pageSizeDivisor?: number;
  /**
   * Whether to actively move DOM focus to the stored item when the consumer
   * remounts (the conversation list restores focus when e.g. the drawer
   * reopens). The message list keeps this off — mounting a thread must not
   * steal focus.
   * @default false
   */
  restoreFocusOnMount?: boolean;
}

export interface UseRovingFocusReturn {
  /**
   * The id holding the single `tabIndex={0}` stop. Derived per render:
   * last interactive focus if still present, else `preferredId`, else the
   * `fallback` end of the list.
   */
  effectiveFocusedId: string | undefined;
  registerItemRef(id: string, element: HTMLElement | null): void;
  /** Record an interactive focus (call from the item's `onFocus`). */
  setFocusedId(id: string): void;
  handleKeyDown(event: React.KeyboardEvent<HTMLElement>, id: string): void;
  moveFocus(targetIndex: number): void;
  /**
   * Focus the item's element. If the element is not mounted yet (windowing),
   * the focus is retried when the element registers.
   */
  focusItem(id: string | undefined): void;
}

export function useRovingFocus(params: UseRovingFocusParameters): UseRovingFocusReturn {
  const {
    itemIds,
    restoreKey,
    scope,
    preferredId,
    fallback = 'first',
    onActivate,
    getTypeAheadLabel,
    enablePageKeys = true,
    pageSizeDivisor = 10,
    restoreFocusOnMount = false,
  } = params;

  const storedFocusedId = readStoredId(restoreKey, scope);
  const restoreFocusIdRef = React.useRef<string | null>(
    restoreFocusOnMount && storedFocusedId != null && itemIds.includes(storedFocusedId)
      ? storedFocusedId
      : null,
  );
  // Only an *interactive* focus is stored as state; before the user interacts
  // the tab stop is derived per render so it tracks list changes (e.g. the
  // newest message) without state churn.
  const [focusedId, setFocusedIdState] = React.useState<string | undefined>(() =>
    storedFocusedId != null && itemIds.includes(storedFocusedId) ? storedFocusedId : undefined,
  );
  const itemRefs = React.useRef(new Map<string, HTMLElement | null>());
  const pendingFocusIdRef = React.useRef<string | null>(null);

  let effectiveFocusedId: string | undefined;
  if (focusedId != null && itemIds.includes(focusedId)) {
    effectiveFocusedId = focusedId;
  } else if (preferredId != null && itemIds.includes(preferredId)) {
    effectiveFocusedId = preferredId;
  } else {
    effectiveFocusedId = fallback === 'last' ? itemIds[itemIds.length - 1] : itemIds[0];
  }

  const focusItem = React.useCallback((id: string | undefined) => {
    if (id == null) {
      return;
    }

    const element = itemRefs.current.get(id);
    if (element != null) {
      pendingFocusIdRef.current = null;
      element.focus();
    } else {
      // Windowing seam: the target row isn't mounted — retry on registration.
      pendingFocusIdRef.current = id;
    }
  }, []);

  const registerItemRef = React.useCallback((id: string, element: HTMLElement | null) => {
    if (element == null) {
      itemRefs.current.delete(id);
      return;
    }

    itemRefs.current.set(id, element);

    if (pendingFocusIdRef.current === id) {
      pendingFocusIdRef.current = null;
      element.focus();
    }
  }, []);

  const setFocusedId = React.useCallback(
    (id: string) => {
      setFocusedIdState(id);
      writeStoredId(restoreKey, scope, id);
    },
    [restoreKey, scope],
  );

  React.useEffect(() => {
    if (restoreFocusIdRef.current == null) {
      return;
    }

    focusItem(restoreFocusIdRef.current);
    restoreFocusIdRef.current = null;
  }, [focusItem]);

  const moveFocus = React.useCallback(
    (targetIndex: number) => {
      const boundedIndex = Math.max(0, Math.min(targetIndex, itemIds.length - 1));
      const targetId = itemIds[boundedIndex];

      if (targetId == null) {
        return;
      }

      setFocusedId(targetId);
      focusItem(targetId);
    },
    [focusItem, itemIds, setFocusedId],
  );

  const typeAheadRef = React.useRef<{
    buffer: string;
    resetTimer: ReturnType<typeof setTimeout> | null;
  }>({
    buffer: '',
    resetTimer: null,
  });

  const moveFocusToLabelPrefix = React.useCallback(
    (prefix: string, fromIndex: number) => {
      if (prefix === '' || getTypeAheadLabel == null) {
        return;
      }

      const lowercase = prefix.toLowerCase();
      const total = itemIds.length;

      for (let offset = 1; offset <= total; offset += 1) {
        const candidateId = itemIds[(fromIndex + offset) % total];
        const label = (candidateId == null ? undefined : getTypeAheadLabel(candidateId))
          ?.toLowerCase();

        if (label != null && label.startsWith(lowercase)) {
          setFocusedId(candidateId);
          focusItem(candidateId);
          return;
        }
      }
    },
    [focusItem, getTypeAheadLabel, itemIds, setFocusedId],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>, id: string) => {
      const currentIndex = itemIds.indexOf(id);

      if (currentIndex === -1) {
        return;
      }

      // Page-size moves a percentage of the list at a time, with a sane
      // minimum so short lists still move by at least one item.
      const pageSize = Math.max(1, Math.floor(itemIds.length / pageSizeDivisor));

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          moveFocus(currentIndex + 1);
          return;
        case 'ArrowUp':
          event.preventDefault();
          moveFocus(currentIndex - 1);
          return;
        case 'Home':
          event.preventDefault();
          moveFocus(0);
          return;
        case 'End':
          event.preventDefault();
          moveFocus(itemIds.length - 1);
          return;
        case 'PageDown':
          if (enablePageKeys) {
            event.preventDefault();
            moveFocus(currentIndex + pageSize);
          }
          return;
        case 'PageUp':
          if (enablePageKeys) {
            event.preventDefault();
            moveFocus(currentIndex - pageSize);
          }
          return;
        case 'Enter':
        case ' ':
        case 'Spacebar':
          if (onActivate != null) {
            event.preventDefault();
            onActivate(id);
          }
          return;
        default:
          break;
      }

      if (getTypeAheadLabel == null) {
        return;
      }

      // Type-ahead: a single printable character (no modifier) appends to a
      // small buffer and jumps focus to the first item whose label starts
      // with that buffer.
      const isPrintable =
        event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

      if (!isPrintable) {
        return;
      }

      event.preventDefault();
      typeAheadRef.current.buffer += event.key;

      if (typeAheadRef.current.resetTimer != null) {
        clearTimeout(typeAheadRef.current.resetTimer);
      }
      typeAheadRef.current.resetTimer = setTimeout(() => {
        typeAheadRef.current.buffer = '';
        typeAheadRef.current.resetTimer = null;
      }, 800);

      moveFocusToLabelPrefix(typeAheadRef.current.buffer, currentIndex);
    },
    [
      enablePageKeys,
      getTypeAheadLabel,
      itemIds,
      moveFocus,
      moveFocusToLabelPrefix,
      onActivate,
      pageSizeDivisor,
    ],
  );

  React.useEffect(
    () => () => {
      if (typeAheadRef.current.resetTimer != null) {
        clearTimeout(typeAheadRef.current.resetTimer);
      }
    },
    [],
  );

  return {
    effectiveFocusedId,
    registerItemRef,
    setFocusedId,
    handleKeyDown,
    moveFocus,
    focusItem,
  };
}
