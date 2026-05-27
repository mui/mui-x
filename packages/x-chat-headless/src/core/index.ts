export { ChatProvider } from '../ChatProvider';

export { useChat } from '../hooks/useChat';
export { useChatComposer } from '../hooks/useChatComposer';
export { useChatPartRenderer } from '../hooks/useChatPartRenderer';
export { useChatStatus } from '../hooks/useChatStatus';
export { useChatStore } from '../hooks/useChatStore';
export { useConversation, useConversations } from '../hooks/useConversation';
export { useMessage, useMessageIds } from '../hooks/useMessage';

export {
  chatSelectors,
  selectMessageIds,
  selectMessagesById,
  selectConversationIds,
  selectConversationsById,
  selectActiveConversationId,
  selectIsStreaming,
  selectHasMoreHistory,
  selectError,
  selectMessages,
  selectMessage,
  selectConversations,
  selectConversation,
  selectActiveConversation,
  selectMessageCount,
  selectConversationCount,
  selectComposerValue,
  selectComposerAttachments,
  selectTypingUserIds,
} from '../selectors/chatSelectors';

export type { ChatProviderProps } from '../ChatProvider';

export type { ChatAdapter, PaginationDirection } from '../adapters/chatAdapter';

export type {
  ChatPartRenderer,
  ChatPartRendererMap,
  ChatPartRendererProps,
} from '../renderers/chatPartRenderer';

export type {
  ChatAddToolApproveResponseInput,
  ChatOnData,
  ChatOnFinish,
  ChatOnFinishPayload,
  ChatOnToolCall,
  ChatOnToolCallPayload,
  UseChatSendMessageInput,
} from '../types/chat-callbacks';

export type {
  ChatAttachmentRejection,
  ChatAttachmentRejectionReason,
  ChatAttachmentsConfig,
  ChatConversation,
  ChatDateTimeString,
  ChatDraftAttachment,
  ChatDraftAttachmentStatus,
  ChatMessage,
  ChatMessageStatus,
  ChatRole,
  ChatUser,
  ConversationReadState,
} from '../types/chat-entities';

export type { ChatError, ChatErrorCode } from '../types/chat-error';

export type {
  ChatBuiltInMessagePart,
  ChatCustomMessagePart,
  ChatDataMessagePart,
  ChatDataPartType,
  ChatDynamicToolInvocation,
  ChatDynamicToolMessagePart,
  ChatFileMessagePart,
  ChatMessagePart,
  ChatMessagePartStatus,
  ChatReasoningMessagePart,
  ChatSourceDocumentMessagePart,
  ChatSourceUrlMessagePart,
  ChatStepStartMessagePart,
  ChatTextMessagePart,
  ChatToolApproval,
  ChatToolInvocation,
  ChatToolInvocationState,
  ChatToolMessagePart,
} from '../types/chat-message-parts';

export type { ChatRealtimeEvent } from '../types/chat-realtime';

export type { ChatPublicState } from '../types/chat-state';

export type { ChatMessageChunk, ChatStreamEnvelope } from '../types/chat-stream';

export { ChatStreamError } from '../stream/ChatStreamError';
