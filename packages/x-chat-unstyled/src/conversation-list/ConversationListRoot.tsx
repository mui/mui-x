'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import {
  useChat,
  useChatStore,
  useConversations,
  type ChatConversation,
} from '@mui/x-chat-headless';
import { markChatLayoutPane } from '../chat/internals/chatLayoutPaneKind';
import { mergeReactProps } from '../internals/mergeReactProps';
import { ConversationListItem, type ConversationListItemProps } from './ConversationListItem';
import {
  ConversationListItemText,
  type ConversationListItemTextProps,
} from './ConversationListItemText';
import {
  ConversationListItemMeta,
  type ConversationListItemMetaProps,
} from './ConversationListItemMeta';
import {
  ConversationListItemAvatar,
  type ConversationListItemAvatarProps,
} from './ConversationListItemAvatar';
import {
  type ConversationListItemOwnerState,
  type ConversationListRootOwnerState,
} from './conversationList.types';

const lastFocusedConversationIdByStore = new WeakMap<object, string>();

export interface ConversationListRootSlots {
  root: React.ElementType;
  item: React.JSXElementConstructor<ConversationListItemProps>;
  itemText: React.JSXElementConstructor<ConversationListItemTextProps>;
  itemMeta: React.JSXElementConstructor<ConversationListItemMetaProps>;
  itemAvatar: React.JSXElementConstructor<ConversationListItemAvatarProps>;
}

export interface ConversationListRootSlotProps {
  root?: SlotComponentProps<'div', {}, ConversationListRootOwnerState>;
  item?: SlotComponentProps<typeof ConversationListItem, {}, ConversationListItemOwnerState>;
  itemText?: SlotComponentProps<
    typeof ConversationListItemText,
    {},
    ConversationListItemOwnerState
  >;
  itemMeta?: SlotComponentProps<
    typeof ConversationListItemMeta,
    {},
    ConversationListItemOwnerState
  >;
  itemAvatar?: SlotComponentProps<
    typeof ConversationListItemAvatar,
    {},
    ConversationListItemOwnerState
  >;
}

export interface ConversationListRootProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  slots?: Partial<ConversationListRootSlots>;
  slotProps?: ConversationListRootSlotProps;
}

interface ConversationListRenderedItemProps {
  conversation: ChatConversation;
  focused: boolean;
  selected: boolean;
  unread: boolean;
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
  };
  const Item = slots?.item ?? ConversationListItem;
  const ItemText = slots?.itemText ?? ConversationListItemText;
  const ItemMeta = slots?.itemMeta ?? ConversationListItemMeta;
  const ItemAvatar = slots?.itemAvatar ?? ConversationListItemAvatar;
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
  const itemTextProps = useSlotProps({
    elementType: ItemText,
    externalSlotProps: slotProps?.itemText,
    ownerState,
    additionalProps: {
      conversation,
      selected,
      unread,
      focused,
    },
  });
  const itemMetaProps = useSlotProps({
    elementType: ItemMeta,
    externalSlotProps: slotProps?.itemMeta,
    ownerState,
    additionalProps: {
      conversation,
      selected,
      unread,
      focused,
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

  return (
    <Item {...itemProps}>
      <ItemAvatar {...itemAvatarProps} />
      <ItemText {...itemTextProps} />
      <ItemMeta {...itemMetaProps} />
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

export const ConversationListRoot = markChatLayoutPane(
  React.forwardRef(function ConversationListRoot(
    props: ConversationListRootProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { slots, slotProps, ...other } = props;
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
    };
    const Root = slots?.root ?? 'div';
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
            />
          );
        })}
      </Root>
    );
  }) as ConversationListRootComponent,
  'conversations',
);
