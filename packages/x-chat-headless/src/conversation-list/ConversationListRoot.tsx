'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChat } from '../hooks/useChat';
import { useChatStore } from '../hooks/useChatStore';
import { useConversations } from '../hooks/useConversation';
import type { ChatConversation } from '../types/chat-entities';
import { markChatLayoutPane } from '../chat/internals/chatLayoutPaneKind';
import {
  ScrollRoot,
  ScrollViewport,
  ScrollScrollbar,
  ScrollThumb,
  scrollbarStyle,
  thumbStyle,
} from '../internals/ScrollAreaSlots';
import { mergeReactProps } from '../internals/mergeReactProps';
import { ConversationListItem, type ConversationListItemProps } from './ConversationListItem';
import {
  ConversationListItemAvatar,
  type ConversationListItemAvatarProps,
} from './ConversationListItemAvatar';
import {
  ConversationListItemContent,
  type ConversationListItemContentProps,
} from './ConversationListItemContent';
import { ConversationListTitle, type ConversationListTitleProps } from './ConversationListTitle';
import {
  ConversationListPreview,
  type ConversationListPreviewProps,
} from './ConversationListPreview';
import {
  ConversationListTimestamp,
  type ConversationListTimestampProps,
} from './ConversationListTimestamp';
import {
  ConversationListUnreadBadge,
  type ConversationListUnreadBadgeProps,
} from './ConversationListUnreadBadge';
import {
  ConversationListItemActions,
  type ConversationListItemActionsProps,
} from './ConversationListItemActions';
import {
  type ConversationListItemOwnerState,
  type ConversationListRootOwnerState,
  type ConversationListVariant,
} from './conversationList.types';

const lastFocusedConversationIdByStore = new WeakMap<object, string>();

export interface ConversationListRootSlots {
  root: React.ElementType;
  scroller: React.ElementType;
  viewport: React.ElementType;
  scrollbar: React.ElementType;
  scrollbarThumb: React.ElementType;
  item: React.JSXElementConstructor<ConversationListItemProps>;
  itemAvatar: React.JSXElementConstructor<ConversationListItemAvatarProps>;
  itemContent: React.JSXElementConstructor<ConversationListItemContentProps>;
  title: React.JSXElementConstructor<ConversationListTitleProps>;
  preview: React.JSXElementConstructor<ConversationListPreviewProps>;
  timestamp: React.JSXElementConstructor<ConversationListTimestampProps>;
  unreadBadge: React.JSXElementConstructor<ConversationListUnreadBadgeProps>;
  itemActions: React.JSXElementConstructor<ConversationListItemActionsProps>;
}

export interface ConversationListRootSlotProps {
  root?: SlotComponentProps<'div', {}, ConversationListRootOwnerState>;
  scroller?: SlotComponentProps<'div', {}, ConversationListRootOwnerState>;
  viewport?: SlotComponentProps<'div', {}, ConversationListRootOwnerState>;
  scrollbar?: SlotComponentProps<'div', {}, ConversationListRootOwnerState>;
  scrollbarThumb?: SlotComponentProps<'div', {}, ConversationListRootOwnerState>;
  item?: SlotComponentProps<typeof ConversationListItem, {}, ConversationListItemOwnerState>;
  itemAvatar?: SlotComponentProps<
    typeof ConversationListItemAvatar,
    {},
    ConversationListItemOwnerState
  >;
  itemContent?: SlotComponentProps<
    typeof ConversationListItemContent,
    {},
    ConversationListItemOwnerState
  >;
  title?: SlotComponentProps<typeof ConversationListTitle, {}, ConversationListItemOwnerState>;
  preview?: SlotComponentProps<typeof ConversationListPreview, {}, ConversationListItemOwnerState>;
  timestamp?: SlotComponentProps<
    typeof ConversationListTimestamp,
    {},
    ConversationListItemOwnerState
  >;
  unreadBadge?: SlotComponentProps<
    typeof ConversationListUnreadBadge,
    {},
    ConversationListItemOwnerState
  >;
  itemActions?: SlotComponentProps<
    typeof ConversationListItemActions,
    {},
    ConversationListItemOwnerState
  >;
}

export interface ConversationListRootProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * The visual variant of the conversation list.
   * - `'default'` – shows avatar, title, preview, timestamp, and unread badge.
   * - `'compact'` – shows only a small unread indicator, the title, and an actions button.
   * @default 'default'
   */
  variant?: ConversationListVariant;
  slots?: Partial<ConversationListRootSlots>;
  slotProps?: ConversationListRootSlotProps;
}

interface ConversationListRenderedItemProps {
  conversation: ChatConversation;
  focused: boolean;
  selected: boolean;
  unread: boolean;
  variant: ConversationListVariant;
  slots: Partial<ConversationListRootSlots> | undefined;
  slotProps: ConversationListRootSlotProps | undefined;
  registerItemRef(id: string, element: HTMLElement | null): void;
  onFocus(id: string): void;
  onSelect(id: string): void;
  onKeyDown(event: React.KeyboardEvent<HTMLDivElement>, id: string): void;
}

function ConversationListRenderedItem(props: ConversationListRenderedItemProps) {
  const {
    conversation,
    focused,
    selected,
    unread,
    variant,
    slots,
    slotProps,
    registerItemRef,
    onFocus,
    onSelect,
    onKeyDown,
  } = props;
  const ownerState: ConversationListItemOwnerState = {
    conversation,
    focused,
    selected,
    unread,
    variant,
  };
  const Item = slots?.item ?? ConversationListItem;
  const ItemAvatar = slots?.itemAvatar ?? ConversationListItemAvatar;
  const ItemContent = slots?.itemContent ?? ConversationListItemContent;
  const Title = slots?.title ?? ConversationListTitle;
  const Preview = slots?.preview ?? ConversationListPreview;
  const Timestamp = slots?.timestamp ?? ConversationListTimestamp;
  const UnreadBadge = slots?.unreadBadge ?? ConversationListUnreadBadge;
  const ItemActions = slots?.itemActions ?? ConversationListItemActions;

  const itemSlotProps = useSlotProps({
    elementType: Item,
    externalSlotProps: slotProps?.item,
    ownerState,
    additionalProps: {
      conversation,
      selected,
      unread,
      focused,
      role: 'option',
      tabIndex: focused ? 0 : -1,
      'aria-selected': selected,
      ref: (element: HTMLElement | null) => {
        registerItemRef(conversation.id, element);
      },
    },
  });
  const itemProps = mergeReactProps(itemSlotProps, {
    onClick: () => {
      onSelect(conversation.id);
    },
    onFocus: () => {
      onFocus(conversation.id);
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown(event, conversation.id);
    },
  });
  const itemAvatarProps = useSlotProps({
    elementType: ItemAvatar,
    externalSlotProps: slotProps?.itemAvatar,
    ownerState,
    additionalProps: {
      conversation,
      selected,
      unread,
      focused,
    },
  });
  const itemContentProps = useSlotProps({
    elementType: ItemContent,
    externalSlotProps: slotProps?.itemContent,
    ownerState,
    additionalProps: {
      conversation,
      selected,
      unread,
      focused,
    },
  });
  const titleProps = useSlotProps({
    elementType: Title,
    externalSlotProps: slotProps?.title,
    ownerState,
    additionalProps: {
      conversation,
      selected,
      unread,
      focused,
    },
  });
  const previewProps = useSlotProps({
    elementType: Preview,
    externalSlotProps: slotProps?.preview,
    ownerState,
    additionalProps: {
      conversation,
      selected,
      unread,
      focused,
    },
  });
  const timestampProps = useSlotProps({
    elementType: Timestamp,
    externalSlotProps: slotProps?.timestamp,
    ownerState,
    additionalProps: {
      conversation,
      selected,
      unread,
      focused,
    },
  });
  const unreadBadgeProps = useSlotProps({
    elementType: UnreadBadge,
    externalSlotProps: slotProps?.unreadBadge,
    ownerState,
    additionalProps: {
      conversation,
      selected,
      unread,
      focused,
    },
  });
  const itemActionsProps = useSlotProps({
    elementType: ItemActions,
    externalSlotProps: slotProps?.itemActions,
    ownerState,
    additionalProps: {
      conversation,
      selected,
      unread,
      focused,
    },
  });

  if (variant === 'compact') {
    return (
      <Item {...itemProps}>
        <UnreadBadge {...unreadBadgeProps} />
        <ItemContent {...itemContentProps}>
          <Title {...titleProps} />
        </ItemContent>
        <ItemActions {...itemActionsProps} />
      </Item>
    );
  }

  return (
    <Item {...itemProps}>
      <ItemAvatar {...itemAvatarProps} />
      <ItemContent {...itemContentProps}>
        <Title {...titleProps} />
        <Preview {...previewProps} />
      </ItemContent>
      <Timestamp {...timestampProps} />
      <UnreadBadge {...unreadBadgeProps} />
    </Item>
  );
}

type ConversationListRootComponent = ((
  props: ConversationListRootProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

function getInitialFocusedConversationId(
  conversations: ChatConversation[],
  activeConversationId: string | undefined,
  storedFocusedConversationId: string | undefined,
) {
  const hasConversation = (id: string | undefined) =>
    id != null && conversations.some((conversation) => conversation.id === id);

  if (hasConversation(storedFocusedConversationId)) {
    return storedFocusedConversationId;
  }

  if (hasConversation(activeConversationId)) {
    return activeConversationId;
  }

  return conversations[0]?.id;
}

// ---------------------------------------------------------------------------
// Functional default styles for the scroll slots.
// ---------------------------------------------------------------------------

const clScrollRootStyle: React.CSSProperties = {
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
};

const clScrollViewportStyle: React.CSSProperties = {
  overscrollBehavior: 'contain',
};

export const ConversationListRoot = markChatLayoutPane(
  React.forwardRef(function ConversationListRoot(
    props: ConversationListRootProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { variant = 'default', slots, slotProps, ...other } = props;
    const conversations = useConversations();
    const { activeConversationId, setActiveConversation } = useChat();
    const store = useChatStore();
    const storedFocusedConversationId = lastFocusedConversationIdByStore.get(store);
    const restoreFocusIdRef = React.useRef<string | null>(
      conversations.some((conversation) => conversation.id === storedFocusedConversationId)
        ? storedFocusedConversationId!
        : null,
    );
    const [focusedConversationId, setFocusedConversationId] = React.useState(() =>
      getInitialFocusedConversationId(
        conversations,
        activeConversationId,
        storedFocusedConversationId,
      ),
    );
    const itemRefs = React.useRef(new Map<string, HTMLElement | null>());
    const conversationIds = React.useMemo(
      () => conversations.map((conversation) => conversation.id),
      [conversations],
    );
    const ownerState: ConversationListRootOwnerState = {
      conversationCount: conversations.length,
      activeConversationId,
      variant,
    };
    const Scroller = slots?.scroller ?? ScrollRoot;
    const Viewport = slots?.viewport ?? ScrollViewport;
    const ListScrollbar = slots?.scrollbar ?? ScrollScrollbar;
    const ListScrollbarThumb = slots?.scrollbarThumb ?? ScrollThumb;
    const Root = slots?.root ?? 'div';
    const scrollerProps = useSlotProps({
      elementType: Scroller,
      externalSlotProps: slotProps?.scroller,
      ownerState,
      additionalProps: {
        style: clScrollRootStyle,
      },
    });
    const viewportProps = useSlotProps({
      elementType: Viewport,
      externalSlotProps: slotProps?.viewport,
      ownerState,
      additionalProps: {
        style: clScrollViewportStyle,
      },
    });
    const scrollbarProps = useSlotProps({
      elementType: ListScrollbar,
      externalSlotProps: slotProps?.scrollbar,
      ownerState,
      additionalProps: {
        orientation: 'vertical' as const,
        style: scrollbarStyle,
      },
    });
    const scrollbarThumbProps = useSlotProps({
      elementType: ListScrollbarThumb,
      externalSlotProps: slotProps?.scrollbarThumb,
      ownerState,
      additionalProps: {
        style: thumbStyle,
      },
    });
    const rootProps = useSlotProps({
      elementType: Root,
      externalSlotProps: slotProps?.root,
      externalForwardedProps: other,
      ownerState,
      additionalProps: {
        ref,
        role: 'listbox',
      },
    });

    const focusConversation = React.useCallback((id: string | undefined) => {
      if (id == null) {
        return;
      }

      itemRefs.current.get(id)?.focus();
    }, []);

    React.useEffect(() => {
      if (focusedConversationId == null || conversationIds.includes(focusedConversationId)) {
        return;
      }

      setFocusedConversationId(
        getInitialFocusedConversationId(
          conversations,
          activeConversationId,
          storedFocusedConversationId,
        ),
      );
    }, [
      activeConversationId,
      conversationIds,
      conversations,
      focusedConversationId,
      storedFocusedConversationId,
    ]);

    React.useEffect(() => {
      if (restoreFocusIdRef.current == null) {
        return;
      }

      focusConversation(restoreFocusIdRef.current);
      restoreFocusIdRef.current = null;
    }, [conversations, focusConversation]);

    const registerItemRef = React.useCallback((id: string, element: HTMLElement | null) => {
      if (element == null) {
        itemRefs.current.delete(id);
        return;
      }

      itemRefs.current.set(id, element);
    }, []);

    const handleFocusedConversationChange = React.useCallback(
      (id: string) => {
        setFocusedConversationId(id);
        lastFocusedConversationIdByStore.set(store, id);
      },
      [store],
    );

    const moveFocus = React.useCallback(
      (targetIndex: number) => {
        const boundedIndex = Math.max(0, Math.min(targetIndex, conversationIds.length - 1));
        const targetId = conversationIds[boundedIndex];

        if (targetId == null) {
          return;
        }

        handleFocusedConversationChange(targetId);
        focusConversation(targetId);
      },
      [conversationIds, focusConversation, handleFocusedConversationChange],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>, id: string) => {
        const currentIndex = conversationIds.indexOf(id);

        if (currentIndex === -1) {
          return;
        }

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            moveFocus(currentIndex + 1);
            break;
          case 'ArrowUp':
            event.preventDefault();
            moveFocus(currentIndex - 1);
            break;
          case 'Home':
            event.preventDefault();
            moveFocus(0);
            break;
          case 'End':
            event.preventDefault();
            moveFocus(conversationIds.length - 1);
            break;
          case 'Enter':
            event.preventDefault();
            void setActiveConversation(id);
            break;
          default:
            break;
        }
      },
      [conversationIds, moveFocus, setActiveConversation],
    );

    const handleSelect = React.useCallback(
      (id: string) => {
        handleFocusedConversationChange(id);
        void setActiveConversation(id);
      },
      [handleFocusedConversationChange, setActiveConversation],
    );

    return (
      <Scroller {...scrollerProps}>
        <Viewport {...viewportProps}>
          <Root {...rootProps}>
            {conversations.map((conversation) => {
              const unread =
                (conversation.unreadCount != null && conversation.unreadCount > 0) ||
                conversation.readState === 'unread';

              return (
                <ConversationListRenderedItem
                  conversation={conversation}
                  focused={focusedConversationId === conversation.id}
                  key={conversation.id}
                  onFocus={handleFocusedConversationChange}
                  onKeyDown={handleKeyDown}
                  onSelect={handleSelect}
                  registerItemRef={registerItemRef}
                  selected={activeConversationId === conversation.id}
                  slotProps={slotProps}
                  slots={slots}
                  unread={unread}
                  variant={variant}
                />
              );
            })}
          </Root>
        </Viewport>
        <ListScrollbar {...scrollbarProps}>
          <ListScrollbarThumb {...scrollbarThumbProps} />
        </ListScrollbar>
      </Scroller>
    );
  }) as ConversationListRootComponent,
  'conversations',
);
