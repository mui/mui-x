import type { ChatDraftAttachment, ChatMessage, ChatConversation } from '../types/chat-entities';
import type { ChatRealtimeEvent } from '../types/chat-realtime';
import type { ChatMessageChunk, ChatStreamEnvelope } from '../types/chat-stream';
import type { ChatAddToolApproveResponseInput } from '../types/chat-callbacks';

export type PaginationDirection = 'forward' | 'backward';

export interface ChatListConversationsInput<Cursor = string> {
  cursor?: Cursor;
  query?: string;
}

export interface ChatListConversationsResult<Cursor = string> {
  conversations: ChatConversation[];
  cursor?: Cursor;
  hasMore?: boolean;
}

export interface ChatListMessagesInput<Cursor = string> {
  conversationId: string;
  cursor?: Cursor;
  direction?: PaginationDirection;
}

export interface ChatListMessagesResult<Cursor = string> {
  messages: ChatMessage[];
  cursor?: Cursor;
  hasMore?: boolean;
}

export interface ChatSendMessageInput {
  conversationId?: string;
  message: ChatMessage;
  messages: ChatMessage[];
  attachments?: ChatDraftAttachment[];
  metadata?: Record<string, unknown>;
  signal: AbortSignal;
}

export interface ChatReconnectToStreamInput {
  conversationId?: string;
  messageId?: string;
  signal: AbortSignal;
}

export interface ChatSetTypingInput {
  conversationId: string;
  isTyping: boolean;
}

export interface ChatMarkReadInput {
  conversationId: string;
  messageId?: string;
}

export interface ChatSubscribeInput {
  onEvent: (event: ChatRealtimeEvent) => void;
}

export type ChatSubscriptionCleanup = () => void;

export interface ChatLoadMoreResult<Cursor = string> {
  messages: ChatMessage[];
  cursor?: Cursor;
  hasMore?: boolean;
}

export interface ChatAdapter<Cursor = string> {
  listConversations?(
    input?: ChatListConversationsInput<Cursor>,
  ): Promise<ChatListConversationsResult<Cursor>>;

  listMessages?(input: ChatListMessagesInput<Cursor>): Promise<ChatListMessagesResult<Cursor>>;

  sendMessage(
    input: ChatSendMessageInput,
  ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope>>;

  reconnectToStream?(
    input: ChatReconnectToStreamInput,
  ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope> | null>;

  setTyping?(input: ChatSetTypingInput): Promise<void>;

  markRead?(input: ChatMarkReadInput): Promise<void>;

  subscribe?(input: ChatSubscribeInput): Promise<ChatSubscriptionCleanup> | ChatSubscriptionCleanup;

  /**
   * @deprecated Use `listMessages` with `direction: 'backward'` instead.
   * `loadMoreHistory` now prefers `listMessages` for consistency with initial
   * message loading. `loadMore` is kept for backward compatibility only.
   * @see {@link ChatAdapter.listMessages}
   */
  loadMore?(cursor?: Cursor): Promise<ChatLoadMoreResult<Cursor>>;

  addToolApprovalResponse?(input: ChatAddToolApproveResponseInput): Promise<void>;

  stop?(): void;
}
