'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChat, useMessageIds, type ChatMessage } from '@mui/x-chat-headless';
import {
  ScrollRoot,
  ScrollViewport,
  ScrollScrollbar,
  ScrollThumb,
  scrollbarStyle,
  thumbStyle,
} from '../internals/ScrollAreaSlots';
import { MessageListContextProvider } from './internals/MessageListContext';
import { type MessageListRootOwnerState } from './messageList.types';

const DEFAULT_ESTIMATED_ITEM_SIZE = 84;
const DEFAULT_AUTO_SCROLL_BUFFER = 150;

type ScrollAnchor = {
  id: string;
  offsetFromBottom: number;
};

type ChangeKind = 'none' | 'append' | 'prepend' | 'other';

export interface MessageListRootHandle {
  scrollToBottom(options?: { behavior?: ScrollBehavior }): void;
}

export interface MessageListRootSlots {
  messageList: React.ElementType;
  messageListScroller: React.ElementType;
  messageListContent: React.ElementType;
  messageListOverlay: React.ElementType;
  messageListScrollbar: React.ElementType;
  messageListScrollbarThumb: React.ElementType;
}

export interface MessageListRootSlotProps {
  messageList?: SlotComponentProps<'div', {}, MessageListRootOwnerState>;
  messageListScroller?: SlotComponentProps<'div', {}, MessageListRootOwnerState>;
  messageListContent?: SlotComponentProps<'div', {}, MessageListRootOwnerState>;
  messageListOverlay?: SlotComponentProps<'div', {}, MessageListRootOwnerState>;
  messageListScrollbar?: SlotComponentProps<'div', {}, MessageListRootOwnerState>;
  messageListScrollbarThumb?: SlotComponentProps<'div', {}, MessageListRootOwnerState>;
}

export interface MessageListRootAutoScrollConfig {
  /**
   * Distance in pixels from the bottom of the scroll container within which the
   * user is still considered "at the bottom" and auto-scroll will trigger.
   * @default 150
   */
  buffer?: number;
}

export interface MessageListRootProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  items?: string[];
  overlay?: React.ReactNode;
  renderItem(params: { id: string; index: number }): React.ReactNode;
  getItemKey?: (id: string, index: number) => React.Key;
  estimatedItemSize?: number;
  onReachTop?: () => void;
  /**
   * Controls automatic scrolling to the bottom when new messages arrive or
   * streaming content grows, as long as the user is within `buffer` pixels of
   * the bottom.
   *
   * - `true` – enable with the default buffer (150 px).
   * - `{ buffer: number }` – enable with a custom threshold.
   * - `false` – disable (the scroll-to-bottom affordance is still available).
   *
   * Scrolling when the *user* sends a message is always active.
   * @default true
   */
  autoScroll?: boolean | MessageListRootAutoScrollConfig;
  slots?: Partial<MessageListRootSlots>;
  slotProps?: MessageListRootSlotProps;
}

type MessageListRootComponent = ((
  props: MessageListRootProps & React.RefAttributes<MessageListRootHandle>,
) => React.JSX.Element) & { propTypes?: any };

interface MessageListViewProps {
  itemIds: string[];
  overlay: React.ReactNode;
  renderItem: MessageListRootProps['renderItem'];
  getItemKey: NonNullable<MessageListRootProps['getItemKey']>;
  slots: Partial<MessageListRootSlots> | undefined;
  slotProps: MessageListRootSlotProps | undefined;
  other: Omit<
    MessageListRootProps,
    | 'estimatedItemSize'
    | 'getItemKey'
    | 'items'
    | 'onReachTop'
    | 'renderItem'
    | 'slotProps'
    | 'slots'
  >;
  behavior: ReturnType<typeof useMessageListBehavior>;
}

function arraysEqual(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

function startsWithSequence(values: string[], prefix: string[]) {
  if (prefix.length > values.length) {
    return false;
  }

  return prefix.every((value, index) => values[index] === value);
}

function endsWithSequence(values: string[], suffix: string[]) {
  if (suffix.length > values.length) {
    return false;
  }

  const offset = values.length - suffix.length;

  return suffix.every((value, index) => values[offset + index] === value);
}

function classifyItemChange(previous: string[], next: string[]): ChangeKind {
  if (arraysEqual(previous, next)) {
    return 'none';
  }

  if (next.length > previous.length && startsWithSequence(next, previous)) {
    return 'append';
  }

  if (next.length > previous.length && endsWithSequence(next, previous)) {
    return 'prepend';
  }

  return 'other';
}

function isScrollableToBottom(root: HTMLElement | null, threshold: number) {
  if (!root) {
    return true;
  }

  return root.scrollHeight - root.clientHeight - root.scrollTop <= threshold;
}

interface MessageListRenderedRowProps {
  id: string;
  index: number;
  renderItem: MessageListRootProps['renderItem'];
  registerRowElement(id: string, element: HTMLDivElement | null): void;
  onRowResize(): void;
}

function MessageListRenderedRow(props: MessageListRenderedRowProps) {
  const { id, index, renderItem, registerRowElement, onRowResize } = props;
  const rowRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    registerRowElement(id, rowRef.current);

    return () => {
      registerRowElement(id, null);
    };
  }, [id, registerRowElement]);

  React.useEffect(() => {
    if (!rowRef.current || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    let frameId = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        onRowResize();
      });
    });

    observer.observe(rowRef.current);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [onRowResize]);

  return (
    <div data-message-id={id} data-message-list-row="" ref={rowRef} style={{ width: '100%' }}>
      {renderItem({ id, index })}
    </div>
  );
}

function useMessageListBehavior(parameters: {
  itemIds: string[];
  estimatedItemSize: number;
  onReachTop?: () => void;
  messages: ChatMessage[];
  hasMoreHistory: boolean;
  loadMoreHistory(): Promise<void>;
  autoScrollEnabled: boolean;
  autoScrollBuffer: number;
}) {
  const {
    itemIds,
    estimatedItemSize,
    onReachTop,
    messages,
    hasMoreHistory,
    loadMoreHistory,
    autoScrollEnabled,
    autoScrollBuffer,
  } = parameters;
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const rowElementsRef = React.useRef(new Map<string, HTMLDivElement | null>());
  const previousItemIdsRef = React.useRef<string[]>(itemIds);
  const itemIdsRef = React.useRef(itemIds);
  itemIdsRef.current = itemIds;
  const anchorRef = React.useRef<ScrollAnchor | null>(null);
  const topReachedRef = React.useRef(false);
  const topLoadInFlightRef = React.useRef(false);
  const resizeFrameRef = React.useRef(0);
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const [unseenMessageCount, setUnseenMessageCount] = React.useState(0);
  const isAtBottomRef = React.useRef(true);
  const unseenMessageCountRef = React.useRef(0);
  const setRootElement = React.useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;
  }, []);
  const messageById = React.useMemo(() => {
    const nextMap = new Map<string, ChatMessage>();

    messages.forEach((message) => {
      nextMap.set(message.id, message);
    });

    return nextMap;
  }, [messages]);

  const updateIsAtBottom = React.useCallback(() => {
    const nextIsAtBottom = isScrollableToBottom(rootRef.current, autoScrollBuffer);

    isAtBottomRef.current = nextIsAtBottom;
    setIsAtBottom((previous) => (previous === nextIsAtBottom ? previous : nextIsAtBottom));

    return nextIsAtBottom;
  }, [autoScrollBuffer]);

  const updateUnseenMessageCount = React.useCallback((nextCount: number) => {
    unseenMessageCountRef.current = nextCount;
    setUnseenMessageCount((previous) => (previous === nextCount ? previous : nextCount));
  }, []);

  const captureAnchor = React.useCallback((ids: string[]): ScrollAnchor | null => {
    const root = rootRef.current;

    if (!root) {
      return null;
    }

    const containerRect = root.getBoundingClientRect();

    for (const id of ids) {
      const element = rowElementsRef.current.get(id);

      if (!element) {
        continue;
      }

      const rect = element.getBoundingClientRect();

      if (rect.bottom <= containerRect.top || rect.top >= containerRect.bottom) {
        continue;
      }

      return {
        id,
        offsetFromBottom: containerRect.bottom - rect.bottom,
      };
    }

    return null;
  }, []);

  const restoreAnchor = React.useCallback((anchor: ScrollAnchor | null) => {
    const root = rootRef.current;

    if (!root || !anchor) {
      return false;
    }

    const element = rowElementsRef.current.get(anchor.id);

    if (!element) {
      return false;
    }

    const containerBottom = root.getBoundingClientRect().bottom;
    const nextOffsetFromBottom = containerBottom - element.getBoundingClientRect().bottom;

    root.scrollTop += anchor.offsetFromBottom - nextOffsetFromBottom;

    return true;
  }, []);

  const scrollToBottom = React.useCallback(
    (options?: { behavior?: ScrollBehavior }) => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      if (typeof root.scrollTo === 'function') {
        root.scrollTo({
          top: root.scrollHeight,
          behavior: options?.behavior ?? 'auto',
        });
      } else {
        root.scrollTop = root.scrollHeight;
      }
      updateIsAtBottom();
      updateUnseenMessageCount(0);
      anchorRef.current = captureAnchor(itemIdsRef.current);
    },
    [captureAnchor, updateIsAtBottom, updateUnseenMessageCount],
  );

  const registerRowElement = React.useCallback((id: string, element: HTMLDivElement | null) => {
    if (element == null) {
      rowElementsRef.current.delete(id);
      return;
    }

    rowElementsRef.current.set(id, element);
  }, []);

  const scheduleResizeRestore = React.useCallback(() => {
    cancelAnimationFrame(resizeFrameRef.current);
    resizeFrameRef.current = requestAnimationFrame(() => {
      if (isAtBottomRef.current && autoScrollEnabled) {
        // Follow streaming content: the row grew (new tokens), scroll to stay at bottom.
        // scrollToBottom() already calls updateIsAtBottom() and captureAnchor() internally.
        scrollToBottom();
      } else {
        if (!isAtBottomRef.current) {
          restoreAnchor(anchorRef.current);
        }
        updateIsAtBottom();
        anchorRef.current = captureAnchor(itemIdsRef.current);
      }
    });
  }, [autoScrollEnabled, captureAnchor, restoreAnchor, scrollToBottom, updateIsAtBottom]);

  const maybeLoadMoreHistory = React.useCallback(async () => {
    const root = rootRef.current;

    if (!root || !hasMoreHistory || topLoadInFlightRef.current) {
      return;
    }

    if (root.scrollTop > estimatedItemSize) {
      topReachedRef.current = false;
      return;
    }

    if (topReachedRef.current) {
      return;
    }

    topReachedRef.current = true;
    topLoadInFlightRef.current = true;
    onReachTop?.();

    try {
      await loadMoreHistory();
    } finally {
      topLoadInFlightRef.current = false;
    }
  }, [estimatedItemSize, hasMoreHistory, loadMoreHistory, onReachTop]);

  const handleScroll = React.useCallback(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    anchorRef.current = captureAnchor(itemIdsRef.current);
    const nextIsAtBottom = updateIsAtBottom();

    if (nextIsAtBottom) {
      updateUnseenMessageCount(0);
    }

    if (root.scrollTop > estimatedItemSize) {
      topReachedRef.current = false;
      return;
    }

    void maybeLoadMoreHistory();
  }, [
    captureAnchor,
    estimatedItemSize,
    maybeLoadMoreHistory,
    updateIsAtBottom,
    updateUnseenMessageCount,
  ]);

  React.useLayoutEffect(() => {
    updateIsAtBottom();
    anchorRef.current = captureAnchor(itemIdsRef.current);
  }, [captureAnchor, updateIsAtBottom]);

  React.useLayoutEffect(() => {
    const previousItemIds = previousItemIdsRef.current;
    const changeKind = classifyItemChange(previousItemIds, itemIds);

    if (changeKind === 'prepend' || changeKind === 'other') {
      restoreAnchor(anchorRef.current);
    } else if (changeKind === 'append') {
      const appendedIds = itemIds.slice(previousItemIds.length);
      const lastAppendedMessage = appendedIds.length
        ? messageById.get(appendedIds[appendedIds.length - 1])
        : null;

      if ((autoScrollEnabled && isAtBottomRef.current) || lastAppendedMessage?.role === 'user') {
        scrollToBottom();
      } else if (appendedIds.length > 0) {
        updateUnseenMessageCount(unseenMessageCountRef.current + appendedIds.length);
      }
    }

    const nextIsAtBottom = updateIsAtBottom();

    if (nextIsAtBottom) {
      updateUnseenMessageCount(0);
    }

    anchorRef.current = captureAnchor(itemIds);
    topReachedRef.current = false;
    previousItemIdsRef.current = itemIds;
  }, [
    autoScrollEnabled,
    captureAnchor,
    itemIds,
    messageById,
    restoreAnchor,
    scrollToBottom,
    updateIsAtBottom,
    updateUnseenMessageCount,
  ]);

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(resizeFrameRef.current);
    };
  }, []);

  const contextValue = React.useMemo(
    () => ({
      isAtBottom,
      unseenMessageCount,
      scrollToBottom,
    }),
    [isAtBottom, scrollToBottom, unseenMessageCount],
  );

  return {
    contextValue,
    handleScroll,
    ownerState: {
      messageCount: itemIds.length,
      isAtBottom,
    } satisfies MessageListRootOwnerState,
    registerRowElement,
    scheduleResizeRestore,
    scrollToBottom,
    setRootElement,
  };
}

// ---------------------------------------------------------------------------
// Functional default styles for the scroll slots.
// These are applied via `additionalProps` so consumers can override them
// through `slotProps` or direct `style` props (which take higher priority
// in the `mergeSlotProps` merge order).
// ---------------------------------------------------------------------------

const scrollRootStyle: React.CSSProperties = {
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
};

const scrollViewportStyle: React.CSSProperties = {
  overscrollBehavior: 'contain',
  paddingRight: 8,
};

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  pointerEvents: 'none',
};

// Fallback styles used when the outer `messageList` slot is overridden
// (which removes the ScrollArea context).
const fallbackRootStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: 0,
};

const fallbackScrollerStyle: React.CSSProperties = {
  overflowY: 'auto',
  overscrollBehavior: 'contain',
};

function StaticMessageListView(props: MessageListViewProps) {
  const { itemIds, overlay, renderItem, getItemKey, slots, slotProps, other, behavior } = props;
  // When the outer messageList slot is overridden, the ScrollArea context is
  // absent, so the scroller / scrollbar must fall back to plain elements.
  const hasScrollArea = slots?.messageList == null;
  const MessageList = slots?.messageList ?? ScrollRoot;
  const MessageListScroller =
    slots?.messageListScroller ?? (hasScrollArea ? ScrollViewport : 'div');
  const MessageListContent = slots?.messageListContent ?? 'div';
  const MessageListOverlay = slots?.messageListOverlay ?? 'div';
  const MessageListScrollbar =
    slots?.messageListScrollbar ?? (hasScrollArea ? ScrollScrollbar : 'div');
  const MessageListScrollbarThumb =
    slots?.messageListScrollbarThumb ?? (hasScrollArea ? ScrollThumb : 'div');
  const messageListProps = useSlotProps({
    elementType: MessageList,
    externalSlotProps: slotProps?.messageList,
    ownerState: behavior.ownerState,
    additionalProps: {
      style: hasScrollArea ? scrollRootStyle : fallbackRootStyle,
    },
  });
  const messageListScrollerProps = useSlotProps({
    elementType: MessageListScroller,
    externalSlotProps: slotProps?.messageListScroller,
    externalForwardedProps: other,
    ownerState: behavior.ownerState,
    additionalProps: {
      ref: behavior.setRootElement,
      role: 'log',
      'aria-live': 'polite',
      onScroll: behavior.handleScroll,
      style: hasScrollArea ? scrollViewportStyle : fallbackScrollerStyle,
    },
  });
  const messageListContentProps = useSlotProps({
    elementType: MessageListContent,
    externalSlotProps: slotProps?.messageListContent,
    ownerState: behavior.ownerState,
  });
  const messageListOverlayProps = useSlotProps({
    elementType: MessageListOverlay,
    externalSlotProps: slotProps?.messageListOverlay,
    ownerState: behavior.ownerState,
    additionalProps: {
      style: overlayStyle,
    },
  });
  const scrollbarProps = useSlotProps({
    elementType: MessageListScrollbar,
    externalSlotProps: slotProps?.messageListScrollbar,
    ownerState: behavior.ownerState,
    additionalProps: {
      orientation: 'vertical' as const,
      style: scrollbarStyle,
    },
  });
  const thumbProps = useSlotProps({
    elementType: MessageListScrollbarThumb,
    externalSlotProps: slotProps?.messageListScrollbarThumb,
    ownerState: behavior.ownerState,
    additionalProps: {
      style: thumbStyle,
    },
  });

  return (
    <MessageListContextProvider value={behavior.contextValue}>
      <MessageList {...messageListProps}>
        <MessageListScroller {...messageListScrollerProps}>
          <MessageListContent {...messageListContentProps}>
            {itemIds.map((id, index) => (
              <MessageListRenderedRow
                id={id}
                index={index}
                key={getItemKey(id, index)}
                onRowResize={behavior.scheduleResizeRestore}
                registerRowElement={behavior.registerRowElement}
                renderItem={renderItem}
              />
            ))}
          </MessageListContent>
        </MessageListScroller>
        {hasScrollArea ? (
          <MessageListScrollbar {...scrollbarProps}>
            <MessageListScrollbarThumb {...thumbProps} />
          </MessageListScrollbar>
        ) : null}
        {overlay != null ? (
          <MessageListOverlay {...messageListOverlayProps}>{overlay}</MessageListOverlay>
        ) : null}
      </MessageList>
    </MessageListContextProvider>
  );
}

export const MessageListRoot = React.forwardRef(function MessageListRoot(
  props: MessageListRootProps,
  ref: React.Ref<MessageListRootHandle>,
) {
  const {
    items: itemsProp,
    overlay = null,
    renderItem,
    getItemKey = (id) => id,
    estimatedItemSize = DEFAULT_ESTIMATED_ITEM_SIZE,
    onReachTop,
    autoScroll = true,
    slots,
    slotProps,
    ...other
  } = props;
  const defaultItems = useMessageIds();
  const { hasMoreHistory, loadMoreHistory, messages } = useChat();
  const itemIds = itemsProp ?? defaultItems;

  const autoScrollEnabled = autoScroll !== false;
  const autoScrollBuffer = autoScrollEnabled
    ? (typeof autoScroll === 'object' ? (autoScroll.buffer ?? DEFAULT_AUTO_SCROLL_BUFFER) : DEFAULT_AUTO_SCROLL_BUFFER)
    : estimatedItemSize; // fall back to estimatedItemSize so isAtBottom tracking still works

  const behavior = useMessageListBehavior({
    itemIds,
    estimatedItemSize,
    onReachTop,
    messages,
    hasMoreHistory,
    loadMoreHistory,
    autoScrollEnabled,
    autoScrollBuffer,
  });

  React.useImperativeHandle(
    ref,
    () => ({
      scrollToBottom: behavior.scrollToBottom,
    }),
    [behavior.scrollToBottom],
  );

  return (
    <StaticMessageListView
      behavior={behavior}
      getItemKey={getItemKey}
      itemIds={itemIds}
      overlay={overlay}
      other={other}
      renderItem={renderItem}
      slotProps={slotProps}
      slots={slots}
    />
  );
}) as MessageListRootComponent;
