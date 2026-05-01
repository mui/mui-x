import { describe, expect, it } from 'vitest';
import { ChatStreamError } from './ChatStreamError';
import type { ChatError } from '../types/chat-error';

const chatError: ChatError = {
  code: 'STREAM_ERROR',
  message: 'Connection lost',
  source: 'stream',
  recoverable: true,
};

describe('ChatStreamError', () => {
  it('is an instance of both Error and ChatStreamError', () => {
    const error = new ChatStreamError(chatError);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ChatStreamError);
  });

  it('stores the chatError and inherits the message from it', () => {
    const error = new ChatStreamError(chatError);

    expect(error.chatError).toBe(chatError);
    expect(error.message).toBe('Connection lost');
  });

  it('has the name "ChatStreamError"', () => {
    const error = new ChatStreamError(chatError);

    expect(error.name).toBe('ChatStreamError');
  });
});
