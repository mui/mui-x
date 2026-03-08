import type { ChatConversation, ChatDraftAttachment, ChatMessage } from './chat-entities';
import type { ChatError } from './chat-error';

export interface ChatPublicState<Cursor = string> {
  conversations: ChatConversation[];
  activeConversationId?: string;
  messages: ChatMessage[];
  messageCount: number;
  isStreaming: boolean;
  hasMoreHistory: boolean;
  historyCursor?: Cursor;
  error: ChatError | null;
}

export interface ChatInternalState<Cursor = string> {
  conversationsById: Record<string, ChatConversation>;
  conversationIds: string[];
  activeConversationId?: string;
  messageIds: string[];
  messagesById: Record<string, ChatMessage>;
  isStreaming: boolean;
  hasMoreHistory: boolean;
  historyCursor?: Cursor;
  composerValue: string;
  composerAttachments: ChatDraftAttachment[];
  error: ChatError | null;
}
