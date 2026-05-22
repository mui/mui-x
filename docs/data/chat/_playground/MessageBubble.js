import * as React from 'react';
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
} from '@mui/x-chat';

/**
 * Renders a fully-styled message bubble — group → message → avatar + content —
 * for a given id. Mirrors the `DefaultMessageItem` used inside `ChatBox`.
 */
export function MessageBubble({ messageId, withGroup = true }) {
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
