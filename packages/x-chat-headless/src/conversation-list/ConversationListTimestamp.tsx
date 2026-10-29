'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import type { ChatConversation } from '../types/chat-entities';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import type { ConversationListTimestampOwnerState } from './conversationList.types';

export interface ConversationListTimestampSlots {
  /**
   * The component that renders the root.
   */
  root: React.ElementType;
}

export interface ConversationListTimestampSlotProps {
  /**
   * The props used for the root slot.
   */
  root?: SlotComponentProps<'div', {}, ConversationListTimestampOwnerState>;
}

export interface ConversationListTimestampProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The conversation the item renders.
   */
  conversation: ChatConversation;
  /**
   * If `true`, the conversation is selected.
   */
  selected?: boolean;
  /**
   * If `true`, the conversation has unread messages.
   */
  unread?: boolean;
  /**
   * If `true`, the item has keyboard focus.
   */
  focused?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: Partial<ConversationListTimestampSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ConversationListTimestampSlotProps;
}

type ConversationListTimestampComponent = ((
  props: ConversationListTimestampProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const ConversationListTimestamp = React.forwardRef(function ConversationListTimestamp(
  props: ConversationListTimestampProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    conversation,
    selected = false,
    unread = false,
    focused = false,
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as ConversationListTimestampProps & {
    ownerState?: ConversationListTimestampOwnerState;
  };
  const ownerState: ConversationListTimestampOwnerState = {
    conversation,
    selected,
    unread,
    focused,
  };
  void ownerStateProp;

  const localeText = useChatLocaleText();

  const Root = slots?.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });

  if (!conversation.lastMessageAt) {
    return null;
  }

  return (
    <Root {...rootProps}>
      {/* suppressHydrationWarning: locale-sensitive formatting can differ between server and browser */}
      <time dateTime={conversation.lastMessageAt} suppressHydrationWarning>
        {localeText.conversationTimestampLabel(conversation.lastMessageAt)}
      </time>
    </Root>
  );
}) as ConversationListTimestampComponent;
