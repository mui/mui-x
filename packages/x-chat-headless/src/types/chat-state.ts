import type { ChatConversation, ChatDraftAttachment, ChatMessage } from './chat-entities';
import type { ChatError } from './chat-error';

/**
 * Lifecycle of the initial history page for the active conversation.
 * - `'idle'`: no history load applies (no active conversation, or no `listMessages` adapter method).
 * - `'loading'`: the initial page is being fetched.
 * - `'loaded'`: the initial page resolved; an empty `messages` array means the conversation is empty.
 * - `'error'`: the initial page failed to load.
 */
export type ChatHistoryStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface ChatPublicState<Cursor = string> {
  conversations: ChatConversation[];
  activeConversationId?: string;
  messages: ChatMessage[];
  messageCount: number;
  isStreaming: boolean;
  hasMoreHistory: boolean;
  isLoadingHistory: boolean;
  historyStatus: ChatHistoryStatus;
  historyCursor?: Cursor;
  error: ChatError | null;
}

export interface ChatInternalState<Cursor = string> {
  conversationsById: Record<string, ChatConversation>;
  conversationIds: string[];
  activeConversationId?: string;
  messageIds: string[];
  messagesById: Record<string, ChatMessage>;
  messageErrorsById: Record<string, ChatError | undefined>;
  /** Tracks which users are typing per conversation: { [conversationId]: { [userId]: isTyping } } */
  typingByConversation: Record<string, Record<string, boolean>>;
  activeStreamAbortController: AbortController | null;
  isStreaming: boolean;
  /** The conversation the in-flight response stream belongs to, when known. */
  streamingConversationId?: string;
  hasMoreHistory: boolean;
  isLoadingHistory: boolean;
  historyStatus: ChatHistoryStatus;
  historyCursor?: Cursor;
  composerValue: string;
  composerIsComposing: boolean;
  composerAttachments: ChatDraftAttachment[];
  error: ChatError | null;
}
