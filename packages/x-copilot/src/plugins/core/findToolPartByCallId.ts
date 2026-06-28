import type { ChatMessagePart, ChatToolMessagePart } from '@mui/x-chat-headless';

/**
 * Look up a tool part by its tool-call id within a message's parts. Plugin
 * renderers use this to render the right invocation when multiple tool calls
 * of the same toolName appear in a single message.
 */
export function findToolPartByCallId(
  parts: ChatMessagePart[] | undefined,
  toolCallId: string,
): ChatToolMessagePart | undefined {
  if (!parts || !toolCallId) {
    return undefined;
  }
  for (const part of parts) {
    if (
      part.type === 'tool' &&
      (part as ChatToolMessagePart).toolInvocation?.toolCallId === toolCallId
    ) {
      return part as ChatToolMessagePart;
    }
  }
  return undefined;
}
