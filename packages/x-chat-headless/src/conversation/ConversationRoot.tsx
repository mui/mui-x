'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import { useChat } from '../hooks/useChat';
import { useConversations } from '../hooks/useConversation';
import type { ChatConversation } from '../types/chat-entities';
import { markChatLayoutPane } from '../chat/internals/chatLayoutPaneKind';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { ConversationContextProvider } from './internals/ConversationContext';
import type { ConversationRootOwnerState } from './conversation.types';

export interface ConversationRootSlots {
  /**
   * The component that renders the root.
   */
  root: React.ElementType;
}

export interface ConversationRootSlotProps {
  /**
   * The props used for the root slot.
   */
  root?: SlotComponentProps<'div', {}, ConversationRootOwnerState>;
}

export interface ConversationRootProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: Partial<ConversationRootSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ConversationRootSlotProps;
}

type ConversationRootComponent = ((
  props: ConversationRootProps & React.RefAttributes<HTMLDivElement>,
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

export const ConversationRoot = markChatLayoutPane(
  React.forwardRef(function ConversationRoot(
    props: ConversationRootProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { children, slots, slotProps, ...other } = props;
    const { activeConversationId } = useChat();
    const localeText = useChatLocaleText();
    const conversations = useConversations();
    const conversation = React.useMemo(
      () => getActiveConversation(conversations, activeConversationId),
      [activeConversationId, conversations],
    );
    const ownerState: ConversationRootOwnerState = React.useMemo(
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
        // Landmark for the active-conversation (thread) area, so assistive
        // technology can jump between the conversations sidebar, the thread,
        // and the composer.
        role: 'region',
        'aria-label': localeText.threadLandmarkLabel,
      },
    });

    return (
      <ConversationContextProvider value={ownerState}>
        <Root {...rootProps}>{children}</Root>
      </ConversationContextProvider>
    );
  }) as ConversationRootComponent,
  'thread',
);
