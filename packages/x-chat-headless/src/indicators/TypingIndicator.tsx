'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useChat } from '../hooks/useChat';
import { useChatStatus } from '../hooks/useChatStatus';
import type { ChatUser } from '../types/chat-entities';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { getDataAttributes } from '../internals/getDataAttributes';
import { type TypingIndicatorOwnerState } from './indicators.types';

function resolveTypingUser(
  userId: string,
  participants: ChatUser[] | undefined,
  messageAuthors: ChatUser[],
) {
  return (
    participants?.find((participant) => participant.id === userId) ??
    messageAuthors.find((author) => author.id === userId) ?? { id: userId }
  );
}

export interface TypingIndicatorSlots {
  root: React.ElementType;
}

export interface TypingIndicatorSlotProps {
  root?: SlotComponentPropsFromProps<'div', {}, TypingIndicatorOwnerState>;
}

export interface TypingIndicatorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  slots?: Partial<TypingIndicatorSlots>;
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
  const messageAuthors = React.useMemo(
    () =>
      messages.reduce<ChatUser[]>((authors, message) => {
        if (message.author && !authors.some((author) => author.id === message.author!.id)) {
          authors.push(message.author);
        }

        return authors;
      }, []),
    [messages],
  );
  const users = React.useMemo(
    () =>
      typingUserIds.map((userId) =>
        resolveTypingUser(userId, conversation?.participants, messageAuthors),
      ),
    [conversation?.participants, messageAuthors, typingUserIds],
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
