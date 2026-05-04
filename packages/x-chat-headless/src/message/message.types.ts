'use client';
import type { ChatMessage, ChatMessageStatus, ChatRole } from '../types/chat-entities';
import type { ChatError } from '../types/chat-error';
import type { ChatVariant } from '../chat/internals/ChatVariantContext';
import type { ChatDensity } from '../chat/internals/ChatDensityContext';
import type { ResolvedMessageAuthor } from '../internals/messageAuthor';

export interface MessageOwnerState {
  messageId: string;
  message: ChatMessage | null;
  role?: ChatRole;
  status?: ChatMessageStatus;
  streaming: boolean;
  error: boolean;
  isGrouped: boolean;
  variant: ChatVariant;
  density: ChatDensity;
  resolvedAuthor: ResolvedMessageAuthor | null;
  /**
   * Whether the message has an avatar to display.
   * Drives the `--MuiChatMessage-avatarSize` CSS variable so the opposite-side
   * phantom column collapses when no avatar is present.
   */
  showAvatar: boolean;
}

export interface MessageRootOwnerState extends MessageOwnerState {}

export interface MessageAvatarOwnerState extends MessageOwnerState {}

export interface MessageAuthorLabelOwnerState extends MessageOwnerState {}

export interface MessageContentOwnerState extends MessageOwnerState {}

export interface MessageMetaOwnerState extends MessageOwnerState {}

export interface MessageActionsOwnerState extends MessageOwnerState {}

export interface MessageErrorOwnerState extends MessageOwnerState {
  /**
   * The error associated with this message, or `null` when none.
   * The primitive returns `null` when there is no error, so consumers
   * rendering the slot can assume this is non-null.
   */
  chatError: ChatError | null;
  /** Whether the chat error is retryable (convenience flag, mirrors `chatError.retryable`). */
  retryable: boolean;
  /**
   * Invoke the `retry(messageId)` action bound to the current message.
   * @returns {Promise<void> | void} Resolves once the retry has been scheduled, or `void` when no runtime is present.
   */
  retry: () => Promise<void> | void;
}
