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

export interface ChatRegenerateInput {
  conversationId?: string;
  /** Id of the assistant message being regenerated (already removed from `messages`). */
  messageId: string;
  /** The user message that prompted the reply being regenerated. */
  message: ChatMessage;
  /** Thread context up to and including `message`; the regenerated assistant run is excluded. */
  messages: ChatMessage[];
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
  /**
   * Opt-in flag. When `true`, the chat runtime allows the `sendMessage`
   * stream to land more than one assistant message per call — the chunk
   * stream may carry multiple `start` chunks with distinct `messageId`s.
   * Used by adapters that fan out parallel responses (e.g. the grid
   * Copilot A/B adapter merges a primary + twin fetch into one logical
   * stream). Leave undefined / `false` for the single-response default.
   */
  allowMultipleMessages?: boolean;

  listConversations?(
    input?: ChatListConversationsInput<Cursor>,
  ): Promise<ChatListConversationsResult<Cursor>>;

  listMessages?(input: ChatListMessagesInput<Cursor>): Promise<ChatListMessagesResult<Cursor>>;

  sendMessage(
    input: ChatSendMessageInput,
  ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope>>;

  /**
   * Regenerate the assistant reply identified by `messageId`. Optional: when
   * absent the runtime falls back to re-sending the anchoring user message
   * through `sendMessage`. Implement it when the backend distinguishes
   * regeneration from a fresh send (e.g. AI SDK `trigger: 'regenerate-message'`).
   */
  regenerate?(
    input: ChatRegenerateInput,
  ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope>>;

  reconnectToStream?(
    input: ChatReconnectToStreamInput,
  ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope> | null>;

  /**
   * Sends an outbound typing signal to your backend for the active conversation.
   *
   * Optional. The runtime calls this automatically **only when the
   * `features.typingSignal` flag is enabled** (default `false`). When enabled
   * (and a conversation is active) the runtime sends `{ isTyping: true }` when
   * the composer value changes from empty (`''`) to non-empty, and
   * `{ isTyping: false }` when it changes back to empty — including when a
   * message is sent, since sending clears the composer. Switching conversations
   * sends `{ isTyping: false }` for the previous conversation and, if a draft is
   * present, `{ isTyping: true }` for the new one; the same applies at mount when
   * an initial draft exists, and unmounting sends a final `{ isTyping: false }`.
   * Keystrokes that keep the composer non-empty produce no additional calls, and
   * there is no built-in idle timeout (expire `isTyping: true` from inside this
   * method if needed). Failures are swallowed with a dev-only warning.
   *
   * With the flag off (the default), the runtime never calls this — wire it up
   * manually instead. If you enable the flag, remove any manual composer
   * `onChange` wiring to avoid double-firing.
   */
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
