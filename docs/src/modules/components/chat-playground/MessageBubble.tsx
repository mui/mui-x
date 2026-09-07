import * as React from 'react';
import { ChatMessage, ChatMessageAvatar, ChatMessageContent, ChatMessageGroup } from '@mui/x-chat';

interface MessageBubbleProps {
  messageId: string;
  /** When omitted, the group is rendered too. Set to false to render only the bubble. */
  withGroup?: boolean;
}

/**
 * Renders a fully-styled message bubble — group → message → avatar + content —
 * for a given id. Mirrors the `DefaultMessageItem` used inside `ChatBox`.
 */
export function MessageBubble({ messageId, withGroup = true }: MessageBubbleProps) {
  const inner = (
    <ChatMessage messageId={messageId}>
      <ChatMessageAvatar />
      <ChatMessageContent />
    </ChatMessage>
  );
  if (!withGroup) {
    return inner;
  }
  return <ChatMessageGroup messageId={messageId}>{inner}</ChatMessageGroup>;
}

export default MessageBubble;
