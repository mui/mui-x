'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { SlotComponentProps } from '@mui/utils/types';
import { useChat } from '../hooks/useChat';
import { useChatStore } from '../hooks/useChatStore';
import { useMessageIds } from '../hooks/useMessage';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { useRovingFocus } from '../internals/useRovingFocus';
import { useMessageListBehavior } from './useMessageListBehavior';
import {
  ScrollRoot,
  ScrollViewport,
  ScrollScrollbar,
  ScrollThumb,
  scrollbarStyle,
  thumbStyle,
} from '../internals/ScrollAreaSlots';
import { MessageListContextProvider } from './internals/MessageListContext';
import {
  MessageRovingProvider,
  useMessageRovingController,
} from './internals/MessageRovingContext';
import { type MessageListRootOwnerState } from './messageList.types';

const DEFAULT_ESTIMATED_ITEM_SIZE = 84;
const DEFAULT_AUTO_SCROLL_BUFFER = 150;

export interface MessageListRootHandle {
  scrollToBottom(options?: { behavior?: ScrollBehavior }): void;
  /**
   * Move the roving focus to the given message (defaults to the newest one)
   * and focus its article element.
   */
  focusMessage(id?: string): void;
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
  /**
   * Whether the message list manages a roving tabindex over its messages:
   * the list is a single Tab stop, ArrowUp/ArrowDown (plus Home/End) move
   * focus between messages, Enter drills into a message's interior controls
   * and Escape returns to the message.
   *
   * Disable when rendering fully custom rows that manage focus themselves.
   * @default true
   */
  enableRovingFocus?: boolean;
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

  useEnhancedEffect(() => {
    registerRowElement(id, rowRef.current);

    return () => {
      registerRowElement(id, null);
    };
  }, [id, registerRowElement]);

  useEnhancedEffect(() => {
    if (!rowRef.current || typeof globalThis.ResizeObserver === 'undefined') {
      return undefined;
    }

    let frameId = 0;
    const observer = new globalThis.ResizeObserver(() => {
      if (typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(frameId);
      }

      if (typeof requestAnimationFrame !== 'function') {
        onRowResize();
        return;
      }

      frameId = requestAnimationFrame(() => {
        onRowResize();
      });
    });

    observer.observe(rowRef.current);

    return () => {
      if (typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(frameId);
      }
      observer.disconnect();
    };
  }, [onRowResize]);

  return (
    <div data-message-id={id} data-message-list-row="" ref={rowRef} style={{ width: '100%' }}>
      {renderItem({ id, index })}
    </div>
  );
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
  const localeText = useChatLocaleText();
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
      'aria-label': localeText.messageListLabel,
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
    enableRovingFocus = true,
    slots,
    slotProps,
    ...other
  } = props;
  const defaultItems = useMessageIds();
  const { hasMoreHistory, loadMoreHistory, messages, isStreaming: isAdapterStreaming } = useChat();
  const store = useChatStore();
  const itemIds = itemsProp ?? defaultItems;

  // One tab stop for the whole list: a roving tabindex over the message
  // articles. No `onActivate` (Enter is drill-in, not selection), no
  // type-ahead (messages have no short stable label), and no Page keys
  // (PageUp/PageDown keep their native scrolling — the only keyboard way to
  // read a message taller than the viewport). `fallback: 'last'` keeps the
  // tab stop on the newest message until the user interacts.
  const roving = useRovingFocus({
    itemIds,
    restoreKey: store,
    scope: 'message-list',
    fallback: 'last',
    enablePageKeys: false,
    restoreFocusOnMount: false,
  });
  const rovingContextValue = useMessageRovingController({
    enabled: enableRovingFocus,
    roving,
  });

  // Combine adapter-level streaming (active stream via processStream) with
  // message-level streaming (any message with status 'streaming').  This
  // ensures auto-scroll on resize works for externally-managed messages
  // (e.g. the Captions demo) that set status: 'streaming' without going
  // through the adapter stream flow.
  const isAnyMessageStreaming = messages.some((m) => m.status === 'streaming');
  const isStreaming = isAdapterStreaming || isAnyMessageStreaming;

  const autoScrollEnabled = autoScroll !== false;
  let autoScrollBuffer: number;
  if (!autoScrollEnabled) {
    // fall back to estimatedItemSize so isAtBottom tracking still works
    autoScrollBuffer = estimatedItemSize;
  } else if (typeof autoScroll === 'object') {
    autoScrollBuffer = autoScroll.buffer ?? DEFAULT_AUTO_SCROLL_BUFFER;
  } else {
    autoScrollBuffer = DEFAULT_AUTO_SCROLL_BUFFER;
  }

  const behavior = useMessageListBehavior({
    itemIds,
    estimatedItemSize,
    onReachTop,
    messages,
    hasMoreHistory,
    loadMoreHistory,
    autoScrollEnabled,
    autoScrollBuffer,
    isStreaming,
  });

  const { setFocusedId, focusItem } = roving;
  React.useImperativeHandle(
    ref,
    () => ({
      scrollToBottom: behavior.scrollToBottom,
      focusMessage: (id?: string) => {
        const targetId = id ?? itemIds[itemIds.length - 1];
        if (targetId == null) {
          return;
        }
        setFocusedId(targetId);
        focusItem(targetId);
      },
    }),
    [behavior.scrollToBottom, focusItem, itemIds, setFocusedId],
  );

  return (
    <MessageRovingProvider value={rovingContextValue}>
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
    </MessageRovingProvider>
  );
}) as MessageListRootComponent;
