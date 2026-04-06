'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChat } from '../hooks/useChat';
import { useMessageIds } from '../hooks/useMessage';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
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
import { type MessageListRootOwnerState } from './messageList.types';

const DEFAULT_ESTIMATED_ITEM_SIZE = 84;
const DEFAULT_AUTO_SCROLL_BUFFER = 150;

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
    slots,
    slotProps,
    ...other
  } = props;
  const defaultItems = useMessageIds();
  const { hasMoreHistory, loadMoreHistory, messages, isStreaming: isAdapterStreaming } = useChat();
  const itemIds = itemsProp ?? defaultItems;

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
