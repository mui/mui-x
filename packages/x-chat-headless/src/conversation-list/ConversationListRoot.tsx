'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
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
import { useRovingFocus } from '../internals/useRovingFocus';
import { ConversationListItem } from './ConversationListItem';
import type { ConversationListItemProps } from './ConversationListItem';
import { ConversationListItemAvatar } from './ConversationListItemAvatar';
import type { ConversationListItemAvatarProps } from './ConversationListItemAvatar';
import { ConversationListItemContent } from './ConversationListItemContent';
import type { ConversationListItemContentProps } from './ConversationListItemContent';
import { ConversationListTitle } from './ConversationListTitle';
import type { ConversationListTitleProps } from './ConversationListTitle';
import { ConversationListPreview } from './ConversationListPreview';
import type { ConversationListPreviewProps } from './ConversationListPreview';
import { ConversationListTimestamp } from './ConversationListTimestamp';
import type { ConversationListTimestampProps } from './ConversationListTimestamp';
import { ConversationListUnreadBadge } from './ConversationListUnreadBadge';
import type { ConversationListUnreadBadgeProps } from './ConversationListUnreadBadge';
import { ConversationListItemActions } from './ConversationListItemActions';
import type { ConversationListItemActionsProps } from './ConversationListItemActions';
import type {
  ConversationListItemOwnerState,
  ConversationListRootOwnerState,
  ConversationListVariant,
} from './conversationList.types';

export interface ConversationListRootSlots {
  /**
   * The component that renders the root.
   */
  root: React.ElementType;
  /**
   * The component that renders the scroller.
   */
  scroller: React.ElementType;
  /**
   * The component that renders the viewport.
   */
  viewport: React.ElementType;
  /**
   * The component that renders the scrollbar.
   */
  scrollbar: React.ElementType;
  /**
   * The component that renders the scrollbar thumb.
   */
  scrollbarThumb: React.ElementType;
  /**
   * The component that renders the item.
   */
  item: React.JSXElementConstructor<ConversationListItemProps>;
  /**
   * The component that renders the item avatar.
   */
  itemAvatar: React.JSXElementConstructor<ConversationListItemAvatarProps>;
  /**
   * The component that renders the item content.
   */
  itemContent: React.JSXElementConstructor<ConversationListItemContentProps>;
  /**
   * The component that renders the title.
   */
  title: React.JSXElementConstructor<ConversationListTitleProps>;
  /**
   * The component that renders the preview.
   */
  preview: React.JSXElementConstructor<ConversationListPreviewProps>;
  /**
   * The component that renders the timestamp.
   */
  timestamp: React.JSXElementConstructor<ConversationListTimestampProps>;
  /**
   * The component that renders the unread badge.
   */
  unreadBadge: React.JSXElementConstructor<ConversationListUnreadBadgeProps>;
  /**
   * The component that renders the item actions.
   */
  itemActions: React.JSXElementConstructor<ConversationListItemActionsProps>;
}

export interface ConversationListRootSlotProps {
  /**
   * The props used for the root slot.
   */
  root?: SlotComponentProps<'div', {}, ConversationListRootOwnerState>;
  /**
   * The props used for the scroller slot.
   */
  scroller?: SlotComponentProps<'div', {}, ConversationListRootOwnerState>;
  /**
   * The props used for the viewport slot.
   */
  viewport?: SlotComponentProps<'div', {}, ConversationListRootOwnerState>;
  /**
   * The props used for the scrollbar slot.
   */
  scrollbar?: SlotComponentProps<'div', {}, ConversationListRootOwnerState>;
  /**
   * The props used for the scrollbar thumb slot.
   */
  scrollbarThumb?: SlotComponentProps<'div', {}, ConversationListRootOwnerState>;
  /**
   * The props used for the item slot.
   */
  item?: SlotComponentProps<typeof ConversationListItem, {}, ConversationListItemOwnerState>;
  /**
   * The props used for the item avatar slot.
   */
  itemAvatar?: SlotComponentProps<
    typeof ConversationListItemAvatar,
    {},
    ConversationListItemOwnerState
  >;
  /**
   * The props used for the item content slot.
   */
  itemContent?: SlotComponentProps<
    typeof ConversationListItemContent,
    {},
    ConversationListItemOwnerState
  >;
  /**
   * The props used for the title slot.
   */
  title?: SlotComponentProps<typeof ConversationListTitle, {}, ConversationListItemOwnerState>;
  /**
   * The props used for the preview slot.
   */
  preview?: SlotComponentProps<typeof ConversationListPreview, {}, ConversationListItemOwnerState>;
  /**
   * The props used for the timestamp slot.
   */
  timestamp?: SlotComponentProps<
    typeof ConversationListTimestamp,
    {},
    ConversationListItemOwnerState
  >;
  /**
   * The props used for the unread badge slot.
   */
  unreadBadge?: SlotComponentProps<
    typeof ConversationListUnreadBadge,
    {},
    ConversationListItemOwnerState
  >;
  /**
   * The props used for the item actions slot.
   */
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
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: Partial<ConversationListRootSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ConversationListRootSlotProps;
}

interface ConversationListRenderedItemProps {
  /**
   * The conversation the item renders.
   */
  conversation: ChatConversation;
  /**
   * If `true`, the item has keyboard focus.
   */
  focused: boolean;
  /**
   * If `true`, the conversation is selected.
   */
  selected: boolean;
  /**
   * If `true`, the conversation has unread messages.
   */
  unread: boolean;
  variant: ConversationListVariant;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: Partial<ConversationListRootSlots> | undefined;
  /**
   * The props used for each component slot.
   * @default {}
   */
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
    const conversationIds = React.useMemo(
      () => conversations.map((conversation) => conversation.id),
      [conversations],
    );
    const titleById = React.useMemo(
      () => new Map(conversations.map((conversation) => [conversation.id, conversation.title])),
      [conversations],
    );
    const getTypeAheadLabel = React.useCallback(
      (id: string) => titleById.get(id) ?? undefined,
      [titleById],
    );
    const handleActivate = React.useCallback(
      (id: string) => {
        void setActiveConversation(id);
      },
      [setActiveConversation],
    );
    const {
      effectiveFocusedId: focusedConversationId,
      registerItemRef,
      setFocusedId,
      handleKeyDown,
    } = useRovingFocus({
      itemIds: conversationIds,
      restoreKey: store,
      scope: 'conversation-list',
      preferredId: activeConversationId,
      onActivate: handleActivate,
      getTypeAheadLabel,
      restoreFocusOnMount: true,
    });
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

    const handleSelect = React.useCallback(
      (id: string) => {
        setFocusedId(id);
        void setActiveConversation(id);
      },
      [setFocusedId, setActiveConversation],
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
                  onFocus={setFocusedId}
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
