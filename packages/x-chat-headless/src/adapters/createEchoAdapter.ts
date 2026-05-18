import type { ChatAdapter } from './chatAdapter';
import type { ChatMessageChunk } from '../types/chat-stream';

export interface CreateEchoAdapterOptions {
  /* eslint-disable jsdoc/require-param, jsdoc/require-returns */
  /**
   * Build the assistant reply from the user's text.
   * Defaults to a "You said: …" echo with a hint to swap in a real adapter.
   */
  respond?: (text: string) => string;
  /* eslint-enable jsdoc/require-param, jsdoc/require-returns */
  /**
   * Milliseconds to wait between receiving the user message and emitting the reply.
   * Simulates network/model latency so the UI doesn't feel jarringly instant.
   * @default 400
   */
  delayMs?: number;
}

const defaultRespond = (text: string) =>
  `You said: "${text || 'nothing'}". Replace this demo adapter with your own API call.`;

/**
 * A minimal in-memory `ChatAdapter` that echoes the user's last message.
 *
 * Intended for quickstart demos, prototyping, and tests — not for production.
 * The reply is emitted as a single text chunk after `delayMs` (no simulated
 * token-by-token streaming).
 */
export function createEchoAdapter(options: CreateEchoAdapterOptions = {}): ChatAdapter {
  const respond = options.respond ?? defaultRespond;
  const delayMs = options.delayMs ?? 400;

  return {
    async sendMessage({ message, signal }) {
      const text = message.parts.map((part) => (part.type === 'text' ? part.text : '')).join('');
      const reply = respond(text);
      const replyId = `reply-${message.id}`;
      const partId = `${replyId}-text`;
      let closed = false;
      let timer: ReturnType<typeof setTimeout> | null = null;
      let streamController: ReadableStreamDefaultController<ChatMessageChunk> | null = null;
      let handleAbort = () => {};

      const cleanup = () => {
        if (timer != null) {
          clearTimeout(timer);
          timer = null;
        }
        signal.removeEventListener('abort', handleAbort);
      };

      const close = () => {
        if (closed) {
          return;
        }
        closed = true;
        cleanup();
        try {
          streamController?.close();
        } catch {
          // already closed
        }
      };

      handleAbort = () => close();

      return new ReadableStream<ChatMessageChunk>({
        start(controller) {
          streamController = controller;

          if (signal.aborted) {
            close();
            return;
          }

          timer = setTimeout(() => {
            timer = null;
            if (signal.aborted) {
              close();
              return;
            }
            closed = true;
            cleanup();
            controller.enqueue({ type: 'start', messageId: replyId });
            controller.enqueue({ type: 'text-start', id: partId });
            controller.enqueue({ type: 'text-delta', id: partId, delta: reply });
            controller.enqueue({ type: 'text-end', id: partId });
            controller.enqueue({ type: 'finish', messageId: replyId, finishReason: 'stop' });
            controller.close();
          }, delayMs);

          signal.addEventListener('abort', handleAbort, { once: true });
        },
        cancel() {
          closed = true;
          cleanup();
          streamController = null;
        },
      });
    },
  };
}
