'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useLazyRef from '@mui/utils/useLazyRef';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import {
  useChat,
  useMessageIds,
  type ChatMessage,
} from '@mui/x-chat-headless';
import { LayoutList, useVirtualizer } from '@mui/x-virtualizer';
import { MessageListContextProvider } from './internals/MessageListContext';
import { type MessageListRootOwnerState } from './messageList.types';

const DEFAULT_ESTIMATED_ITEM_SIZE = 84;
const DEFAULT_OVERSCAN = 5;

type MessageListRowModel = {
  id: string;
  index: number;
};

type ScrollAnchor = {
  id: string;
  offsetFromBottom: number;
};

type ChangeKind = 'none' | 'append' | 'prepend' | 'other';

export interface MessageListRootHandle {
  scrollToBottom(): void;
}

export interface MessageListRootSlots {
  root: React.ElementType;
}

export interface MessageListRootSlotProps {
  root?: SlotComponentProps<'div', {}, MessageListRootOwnerState>;
}

export interface MessageListRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  items?: string[];
  renderItem(params: { id: string; index: number }): React.ReactNode;
  getItemKey?: (id: string, index: number) => React.Key;
  estimatedItemSize?: number;
  overscan?: number;
  onReachTop?: () => void;
  virtualization?: boolean;
  slots?: Partial<MessageListRootSlots>;
  slotProps?: MessageListRootSlotProps;
}

type MessageListRootComponent = ((
  props: MessageListRootProps & React.RefAttributes<MessageListRootHandle>,
) => React.JSX.Element) & { propTypes?: any };

interface MessageListViewProps {
  itemIds: string[];
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
    | 'overscan'
    | 'renderItem'
    | 'slotProps'
    | 'slots'
    | 'virtualization'
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

function createRows(ids: string[]) {
  return ids.map((id, index) => ({
    id,
    model: {
      id,
      index,
    },
  }));
}

interface MessageListRenderedRowProps {
  id: string;
  index: number;
  renderItem: MessageListRootProps['renderItem'];
  getItemKey: NonNullable<MessageListRootProps['getItemKey']>;
  registerRowElement(id: string, element: HTMLDivElement | null): void;
  onRowResize(): void;
  observeRowHeight?: (element: HTMLDivElement, rowId: string) => (() => void) | void;
  setLastMeasuredRowIndex?: (index: number) => void;
}

function MessageListRenderedRow(props: MessageListRenderedRowProps) {
  const {
    id,
    index,
    renderItem,
    getItemKey,
    registerRowElement,
    onRowResize,
    observeRowHeight,
    setLastMeasuredRowIndex,
  } = props;
  const rowRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    registerRowElement(id, rowRef.current);

    return () => {
      registerRowElement(id, null);
    };
  }, [id, registerRowElement]);

  React.useLayoutEffect(() => {
    if (!rowRef.current || !observeRowHeight) {
      return undefined;
    }

    setLastMeasuredRowIndex?.(index);

    return observeRowHeight(rowRef.current, id);
  }, [id, index, observeRowHeight, setLastMeasuredRowIndex]);

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
    <div
      data-message-id={id}
      data-message-list-row=""
      ref={rowRef}
      style={{ width: '100%' }}
    >
      {renderItem({ id, index })}
    </div>
  );
}

function useMessageListBehavior(parameters: {
  itemIds: string[];
  estimatedItemSize: number;
  onReachTop?: () => void;
  virtualizationEnabled: boolean;
  messages: ChatMessage[];
  hasMoreHistory: boolean;
  loadMoreHistory(): Promise<void>;
}) {
  const {
    itemIds,
    estimatedItemSize,
    onReachTop,
    virtualizationEnabled,
    messages,
    hasMoreHistory,
    loadMoreHistory,
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
    const nextIsAtBottom = isScrollableToBottom(rootRef.current, estimatedItemSize);

    isAtBottomRef.current = nextIsAtBottom;
    setIsAtBottom((previous) => (previous === nextIsAtBottom ? previous : nextIsAtBottom));

    return nextIsAtBottom;
  }, [estimatedItemSize]);

  const updateUnseenMessageCount = React.useCallback((nextCount: number) => {
    unseenMessageCountRef.current = nextCount;
    setUnseenMessageCount((previous) => (previous === nextCount ? previous : nextCount));
  }, []);

  const captureAnchor = React.useCallback(
    (ids: string[]): ScrollAnchor | null => {
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
    },
    [],
  );

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

  const scrollToBottom = React.useCallback(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    root.scrollTop = root.scrollHeight;
    updateIsAtBottom();
    updateUnseenMessageCount(0);
    anchorRef.current = captureAnchor(itemIdsRef.current);
  }, [captureAnchor, updateIsAtBottom, updateUnseenMessageCount]);

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
      if (!isAtBottomRef.current) {
        restoreAnchor(anchorRef.current);
      }

      updateIsAtBottom();
      anchorRef.current = captureAnchor(itemIdsRef.current);
    });
  }, [captureAnchor, restoreAnchor, updateIsAtBottom]);

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

      if (isAtBottomRef.current || lastAppendedMessage?.role === 'user') {
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
      virtualization: virtualizationEnabled,
      isAtBottom,
    } satisfies MessageListRootOwnerState,
    registerRowElement,
    scheduleResizeRestore,
    scrollToBottom,
    setRootElement,
  };
}

function StaticMessageListView(props: MessageListViewProps) {
  const { itemIds, renderItem, getItemKey, slots, slotProps, other, behavior } = props;
  const Root = slots?.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState: behavior.ownerState,
    additionalProps: {
      ref: behavior.setRootElement,
      role: 'log',
      'aria-live': 'polite',
      onScroll: behavior.handleScroll,
    },
  });

  return (
    <MessageListContextProvider value={behavior.contextValue}>
      <Root {...rootProps}>
        {itemIds.map((id, index) => (
          <MessageListRenderedRow
            getItemKey={getItemKey}
            id={id}
            index={index}
            key={getItemKey(id, index)}
            onRowResize={behavior.scheduleResizeRestore}
            registerRowElement={behavior.registerRowElement}
            renderItem={renderItem}
          />
        ))}
      </Root>
    </MessageListContextProvider>
  );
}

function VirtualizedMessageListView(
  props: MessageListViewProps & {
    estimatedItemSize: number;
    overscan: number;
  },
) {
  const {
    itemIds,
    renderItem,
    getItemKey,
    slots,
    slotProps,
    other,
    behavior,
    estimatedItemSize,
    overscan,
  } = props;
  const rows = React.useMemo(() => createRows(itemIds), [itemIds]);
  const range = React.useMemo(
    () => ({
      firstRowIndex: 0,
      lastRowIndex: rows.length,
    }),
    [rows.length],
  );
  const refs = React.useRef({
    container: React.createRef<HTMLDivElement>(),
    scroller: React.createRef<HTMLDivElement>(),
  }).current;
  const layout = useLazyRef(() => new LayoutList(refs)).current;
  const virtualizer = useVirtualizer({
    layout,
    dimensions: {
      rowHeight: estimatedItemSize,
    },
    virtualization: {
      rowBufferPx: overscan * estimatedItemSize,
    },
    rows,
    range,
    rowCount: rows.length,
    renderRow: ({ id, model }) => (
      <MessageListRenderedRow
        getItemKey={getItemKey}
        id={id}
        index={(model as MessageListRowModel).index}
        key={getItemKey(id, (model as MessageListRowModel).index)}
        onRowResize={behavior.scheduleResizeRestore}
        registerRowElement={behavior.registerRowElement}
        renderItem={renderItem}
      />
    ),
  });
  const containerProps = virtualizer.store.use(LayoutList.selectors.containerProps);
  const contentProps = virtualizer.store.use(LayoutList.selectors.contentProps);
  const positionerProps = virtualizer.store.use(LayoutList.selectors.positionerProps);
  const Root = slots?.root ?? 'div';
  const mergedRootRef = useForkRef(
    containerProps.ref as React.Ref<HTMLDivElement>,
    behavior.setRootElement,
  );
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState: behavior.ownerState,
    additionalProps: {
      ...containerProps,
      ref: mergedRootRef,
      role: 'log',
      'aria-live': 'polite',
      onScroll: behavior.handleScroll,
    },
  });
  const renderedRows = virtualizer.api.getters.getRows();

  return (
    <MessageListContextProvider value={behavior.contextValue}>
      <Root {...rootProps}>
        <React.Fragment>
          <div className="MessageList-filler" {...contentProps} />
          <div className="MessageList-positioner" {...positionerProps} />
          {renderedRows}
        </React.Fragment>
      </Root>
    </MessageListContextProvider>
  );
}

export const MessageListRoot = React.forwardRef(function MessageListRoot(
  props: MessageListRootProps,
  ref: React.Ref<MessageListRootHandle>,
) {
  const {
    items: itemsProp,
    renderItem,
    getItemKey = (id) => id,
    estimatedItemSize = DEFAULT_ESTIMATED_ITEM_SIZE,
    overscan = DEFAULT_OVERSCAN,
    onReachTop,
    virtualization = true,
    slots,
    slotProps,
    ...other
  } = props;
  const defaultItems = useMessageIds();
  const { hasMoreHistory, loadMoreHistory, messages } = useChat();
  const itemIds = itemsProp ?? defaultItems;
  const virtualizationEnabled =
    virtualization && typeof ResizeObserver !== 'undefined' && typeof window !== 'undefined';
  const behavior = useMessageListBehavior({
    itemIds,
    estimatedItemSize,
    onReachTop,
    virtualizationEnabled,
    messages,
    hasMoreHistory,
    loadMoreHistory,
  });

  React.useImperativeHandle(
    ref,
    () => ({
      scrollToBottom: behavior.scrollToBottom,
    }),
    [behavior.scrollToBottom],
  );

  if (!virtualizationEnabled) {
    return (
      <StaticMessageListView
        behavior={behavior}
        getItemKey={getItemKey}
        itemIds={itemIds}
        other={other}
        renderItem={renderItem}
        slotProps={slotProps}
        slots={slots}
      />
    );
  }

  return (
    <VirtualizedMessageListView
      behavior={behavior}
      estimatedItemSize={estimatedItemSize}
      getItemKey={getItemKey}
      itemIds={itemIds}
      other={other}
      overscan={overscan}
      renderItem={renderItem}
      slotProps={slotProps}
      slots={slots}
    />
  );
}) as MessageListRootComponent;
