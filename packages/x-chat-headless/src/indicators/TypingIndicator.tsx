'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import { useChat } from '../hooks/useChat';
import { useChatStatus } from '../hooks/useChatStatus';
import type { ChatMessage, ChatUser } from '../types/chat-entities';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { getDataAttributes } from '../internals/getDataAttributes';
import type { TypingIndicatorOwnerState } from './indicators.types';

function resolveTypingUser(
  userId: string,
  participants: ChatUser[] | undefined,
  messages: ChatMessage[],
) {
  return (
    participants?.find((participant) => participant.id === userId) ??
    messages.find((message) => message.author?.id === userId)?.author ?? { id: userId }
  );
}

export interface TypingIndicatorSlots {
  /**
   * The component that renders the root.
   * @default 'div'
   */
  root: React.ElementType;
}

export interface TypingIndicatorSlotProps {
  /**
   * The props used for the root slot.
   */
  root?: SlotComponentProps<'div', {}, TypingIndicatorOwnerState>;
}

export interface TypingIndicatorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: Partial<TypingIndicatorSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TypingIndicatorSlotProps;
}

type TypingIndicatorComponent = ((
  props: TypingIndicatorProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const TypingIndicator = React.forwardRef(function TypingIndicator(
  props: TypingIndicatorProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { slots, slotProps, ...other } = props;
  const { activeConversationId, conversations, messages } = useChat();
  const { typingUserIds } = useChatStatus();
  const localeText = useChatLocaleText();
  const conversation = React.useMemo(
    () =>
      activeConversationId == null
        ? null
        : (conversations.find((candidate) => candidate.id === activeConversationId) ?? null),
    [activeConversationId, conversations],
  );
  const users = React.useMemo(
    () =>
      typingUserIds.map((userId) =>
        resolveTypingUser(userId, conversation?.participants, messages),
      ),
    [conversation?.participants, messages, typingUserIds],
  );
  const label = React.useMemo(
    () => (users.length === 0 ? '' : localeText.typingIndicatorLabel(users)),
    [localeText, users],
  );
  const ownerState = React.useMemo<TypingIndicatorOwnerState>(
    () => ({
      activeConversationId,
      users,
      count: users.length,
      label,
    }),
    [activeConversationId, label, users],
  );
  const Root = slots?.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      'aria-live': 'polite',
      ...getDataAttributes({
        count: ownerState.count,
      }),
    },
  });

  if (users.length === 0) {
    return null;
  }

  return <Root {...rootProps}>{label}</Root>;
}) as TypingIndicatorComponent;
