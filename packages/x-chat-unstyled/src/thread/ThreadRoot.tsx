'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import {
  useChat,
  useConversations,
  type ChatConversation,
} from '@mui/x-chat-headless';
import { markChatLayoutPane } from '../chat/internals/chatLayoutPaneKind';
import { ThreadContextProvider } from './internals/ThreadContext';
import { type ThreadRootOwnerState } from './thread.types';

export interface ThreadRootSlots {
  root: React.ElementType;
}

export interface ThreadRootSlotProps {
  root?: SlotComponentProps<'div', {}, ThreadRootOwnerState>;
}

export interface ThreadRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  slots?: Partial<ThreadRootSlots>;
  slotProps?: ThreadRootSlotProps;
}

type ThreadRootComponent = ((
  props: ThreadRootProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

function getActiveConversation(
  conversations: ChatConversation[],
  activeConversationId: string | undefined,
) {
  if (activeConversationId == null) {
    return null;
  }

  return conversations.find((conversation) => conversation.id === activeConversationId) ?? null;
}

export const ThreadRoot = markChatLayoutPane(
  React.forwardRef(function ThreadRoot(
    props: ThreadRootProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { children, slots, slotProps, ...other } = props;
    const { activeConversationId } = useChat();
    const conversations = useConversations();
    const conversation = React.useMemo(
      () => getActiveConversation(conversations, activeConversationId),
      [activeConversationId, conversations],
    );
    const ownerState: ThreadRootOwnerState = React.useMemo(
      () => ({
        conversationId: activeConversationId,
        hasConversation: conversation != null,
        conversation,
      }),
      [activeConversationId, conversation],
    );
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

    return (
      <ThreadContextProvider value={ownerState}>
        <Root {...rootProps}>{children}</Root>
      </ThreadContextProvider>
    );
  }) as ThreadRootComponent,
  'thread',
);
