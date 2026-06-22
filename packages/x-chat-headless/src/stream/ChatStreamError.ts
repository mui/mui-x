import type { ChatError } from '../types/chat-error';

/**
 * A typed error thrown by the stream processor when a handled stream failure occurs.
 * Carries the `ChatError` that was already set in the store via `failStream()`.
 * Callers can distinguish stream failures from unexpected bugs via `instanceof ChatStreamError`.
 */
export class ChatStreamError extends Error {
  public readonly chatError: ChatError;

  constructor(chatError: ChatError) {
    super(chatError.message);
    this.name = 'ChatStreamError';
    this.chatError = chatError;
  }
}
