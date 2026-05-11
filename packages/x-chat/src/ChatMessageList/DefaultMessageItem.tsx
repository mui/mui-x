'use client';
import * as React from 'react';
import { useChatVariant, useMessage } from '@mui/x-chat-headless';
import { ChatMessage, type ChatMessageProps } from '../ChatMessage/ChatMessage';
import {
  ChatMessageActions,
  type ChatMessageActionsProps,
} from '../ChatMessage/ChatMessageActions';
import { ChatMessageAvatar, type ChatMessageAvatarProps } from '../ChatMessage/ChatMessageAvatar';
import {
  ChatMessageContent,
  type ChatMessageContentProps,
} from '../ChatMessage/ChatMessageContent';
import { ChatMessageGroup, type ChatMessageGroupProps } from '../ChatMessage/ChatMessageGroup';
import { ChatMessageInlineMeta } from '../ChatMessage/ChatMessageInlineMeta';
import { ChatMessageMeta, type ChatMessageMetaProps } from '../ChatMessage/ChatMessageMeta';

/**
 * Per-row slot interface shared by `ChatBox` and `ChatMessageList`.
 *
 * These slots replace the components used by the default row builder.
 * They mirror the row-level subset of `ChatBoxSlots`.
 */
export interface ChatMessageRowSlots {
  /** Override the message group component. */
  messageGroup: React.ElementType;
  /** Override the message root component for each message. */
  messageRoot: React.ElementType;
  /** Override the message avatar component. */
  messageAvatar: React.ElementType;
  /** Override the message content (bubble) component. */
  messageContent: React.ElementType;
  /** Override the message meta component. */
  messageMeta: React.ElementType;
  /** Override the message actions component. */
  messageActions: React.ElementType;
}

export interface ChatMessageRowSlotProps {
  messageGroup?: Partial<ChatMessageGroupProps>;
  messageRoot?: Partial<ChatMessageProps>;
  messageAvatar?: Partial<ChatMessageAvatarProps>;
  messageContent?: Partial<ChatMessageContentProps>;
  messageMeta?: Partial<ChatMessageMetaProps>;
  messageActions?: Partial<ChatMessageActionsProps>;
}

export interface DefaultMessageItemProps {
  id: string;
  slots?: Partial<ChatMessageRowSlots>;
  slotProps?: ChatMessageRowSlotProps;
}

/**
 * Default message-row composition used by `ChatBox` and `ChatMessageList`
 * when no custom `renderItem` is provided.
 *
 * Renders a group → message → avatar → content tree, with the content's inline
 * meta shown in the default variant and external meta shown in the compact variant.
 * A custom `messageActions` slot is wrapped in `ChatMessageActions` when provided.
 */
export function DefaultMessageItem({ id, slots, slotProps }: DefaultMessageItemProps) {
  const variant = useChatVariant();
  const message = useMessage(id);
  const MessageGroupComponent = (slots?.messageGroup ??
    ChatMessageGroup) as typeof ChatMessageGroup;
  const MessageAvatarComponent = (slots?.messageAvatar ??
    ChatMessageAvatar) as typeof ChatMessageAvatar;
  const MessageContentComponent = (slots?.messageContent ??
    ChatMessageContent) as typeof ChatMessageContent;
  const MessageMetaComponent = (slots?.messageMeta ?? ChatMessageMeta) as typeof ChatMessageMeta;
  const MessageRootComponent = (slots?.messageRoot ?? ChatMessage) as typeof ChatMessage;
  const MessageActionsSlot = slots?.messageActions;

  const isDefault = variant !== 'compact';
  const isStreaming = message?.status === 'streaming';

  // Default variant: inline meta inside the bubble (Telegram-style).
  // Skip during streaming — there is no timestamp yet, and the streaming state
  // is already communicated via the MuiChatMessage-streaming CSS class.
  // Also skip when the message carries no displayable meta at all (no timestamp,
  // no edited label, no delivery status) so the spacer does not add dead space.
  const hasMeta =
    Boolean(message?.createdAt) || Boolean(message?.editedAt) || Boolean(message?.status);
  const inlineMeta = isDefault && !isStreaming && hasMeta ? <ChatMessageInlineMeta /> : undefined;

  return (
    <MessageGroupComponent messageId={id} {...(slotProps?.messageGroup ?? {})}>
      <MessageRootComponent messageId={id} {...(slotProps?.messageRoot ?? {})}>
        <MessageAvatarComponent {...(slotProps?.messageAvatar ?? {})} />
        <MessageContentComponent {...(slotProps?.messageContent ?? {})} afterContent={inlineMeta} />
        {/* External meta is only used in the compact variant */}
        {!isDefault && <MessageMetaComponent {...(slotProps?.messageMeta ?? {})} />}
        {MessageActionsSlot && (
          <ChatMessageActions {...(slotProps?.messageActions ?? {})}>
            <MessageActionsSlot messageId={id} />
          </ChatMessageActions>
        )}
      </MessageRootComponent>
    </MessageGroupComponent>
  );
}
