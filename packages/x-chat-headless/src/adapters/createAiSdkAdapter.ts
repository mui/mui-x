import type { ChatAdapter, ChatRegenerateInput, ChatSendMessageInput } from './chatAdapter';
import type { ChatMessage } from '../types/chat-entities';
import type { ChatError } from '../types/chat-error';
import type { ChatMessageChunk } from '../types/chat-stream';
import { ChatStreamError } from '../stream/ChatStreamError';

/**
 * Structural compatibility type for the Vercel AI SDK's UI Message Stream
 * (see https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol).
 *
 * Designed so users can pass `streamText(...).toUIMessageStream()` or
 * `response.body` from a `toUIMessageStreamResponse()` route without us
 * importing the `ai` package — the chunk shapes are mirrored locally.
 *
 * The AI SDK protocol is a near-superset of `ChatMessageChunk`; the only
 * shape exclusive to AI SDK that we handle specially is the `error` chunk.
 * Unknown `type` strings pass through untouched for forward-compat.
 */
export type AiSdkUIMessageChunk =
  | ChatMessageChunk
  | { type: 'error'; errorText?: string }
  | { type: string; [key: string]: unknown };

export interface CreateAiSdkAdapterRequest {
  message: ChatMessage;
  messages: ChatMessage[];
  attachments?: ChatSendMessageInput['attachments'];
  metadata?: ChatSendMessageInput['metadata'];
  /**
   * AI SDK trigger discriminant: `'submit-message'` for fresh sends,
   * `'regenerate-message'` for regenerations (mirrors AI SDK's
   * `prepareSendMessagesRequest`). A server that ignores it simply treats a
   * regeneration as a re-send.
   */
  trigger: 'submit-message' | 'regenerate-message';
  /** Set when `trigger === 'regenerate-message'`: id of the assistant message being regenerated. */
  regenerateMessageId?: string;
  signal: AbortSignal;
}

export interface CreateAiSdkAdapterStreamOptions {
  /* eslint-disable jsdoc/require-param, jsdoc/require-returns */
  /**
   * Called when the user sends a message. Return the UI Message Stream the
   * AI SDK produces. Two stream shapes are accepted:
   *
   * - `ReadableStream<AiSdkUIMessageChunk>` — object stream, what
   *   `streamText(...).toUIMessageStream()` returns in-process.
   * - `ReadableStream<Uint8Array>` — byte stream, what
   *   `(await fetch('/api/chat')).body` yields when the server uses
   *   `toUIMessageStreamResponse()`. NDJSON and SSE (`data: …\n\n`)
   *   framings are both decoded.
   */
  stream: (
    request: CreateAiSdkAdapterRequest,
  ) =>
    | Promise<ReadableStream<AiSdkUIMessageChunk | Uint8Array>>
    | ReadableStream<AiSdkUIMessageChunk | Uint8Array>;
  /* eslint-enable jsdoc/require-param, jsdoc/require-returns */
  chat?: never;
}

/**
 * Structural mirror of `@ai-sdk/react`'s `useChat()` return value.
 * Only the fields the adapter consumes are typed; anything else on the real
 * object is preserved by structural assignability.
 */
export interface AiSdkChatInstance {
  sendMessage: (
    message: { text?: string; files?: unknown[]; [k: string]: unknown },
    options?: unknown,
  ) => Promise<unknown>;
  stop: () => void;
  /* eslint-disable jsdoc/require-param, jsdoc/require-returns */
  /**
   * AI SDK v5 `useChat().regenerate`. Optional: when absent the adapter omits
   * `regenerate` and the MUI X runtime falls back to re-sending through
   * `sendMessage`.
   */
  regenerate?: (options?: { messageId?: string }) => Promise<unknown>;
  /* eslint-enable jsdoc/require-param, jsdoc/require-returns */
  messages: ReadonlyArray<{
    id: string;
    role: string;
    parts: ReadonlyArray<{ type: string; text?: string; [k: string]: unknown }>;
  }>;
}

export interface CreateAiSdkAdapterChatOptions {
  /**
   * A `@ai-sdk/react` `useChat()` return value (or anything matching the
   * `AiSdkChatInstance` shape). The adapter will:
   *
   * - call `chat.sendMessage({ text, files })` when the user sends a message,
   * - forward MUI X Chat's abort signal to `chat.stop()`,
   * - emit the assistant reply as a single text chunk once
   *   `chat.sendMessage` resolves.
   *
   * The reply arrives whole (not token-by-token) because `useChat`'s
   * `sendMessage` only resolves after streaming finishes. For real token
   * streaming, use the `{ stream }` option instead.
   *
   * Recreate the adapter when `chat` changes:
   * `useMemo(() => createAiSdkAdapter({ chat }), [chat])`.
   */
  chat: AiSdkChatInstance;
  stream?: never;
}

export type CreateAiSdkAdapterOptions =
  CreateAiSdkAdapterStreamOptions | CreateAiSdkAdapterChatOptions;

function streamError(message: string): ChatError {
  return {
    code: 'STREAM_ERROR',
    message,
    source: 'stream',
    recoverable: true,
    retryable: true,
  };
}

function getMessageText(message: ChatMessage): string {
  return message.parts.map((part) => (part.type === 'text' ? part.text : '')).join('');
}

function parseStreamLine(rawLine: string): unknown | null {
  // SSE framing prepends each event with `data: `. Strip it; ignore comments
  // (`:` prefix) and SSE field lines we don't care about (`event:`, `id:`, …).
  const trimmed = rawLine.trim();
  if (trimmed.length === 0 || trimmed.startsWith(':')) {
    return null;
  }
  if (!trimmed.startsWith('data:') && /^[\w-]+:/.test(trimmed)) {
    return null;
  }
  const payload = trimmed.startsWith('data:') ? trimmed.slice(5).trimStart() : trimmed;
  if (payload === '[DONE]') {
    return null;
  }
  return JSON.parse(payload);
}

function convertToChatStream(
  upstream: ReadableStream<AiSdkUIMessageChunk | Uint8Array>,
  signal: AbortSignal,
  nextSyntheticMessageId: () => string,
): ReadableStream<ChatMessageChunk> {
  const reader = upstream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  // Per-response synthetic ID used when the AI SDK doesn't supply one on
  // `start`/`finish`. `processStream` in the headless package requires a
  // `messageId` on the `start` chunk to bind subsequent text/reasoning
  // deltas to the right assistant message. The id generator is owned by the
  // adapter (not this per-call closure) so every response gets a distinct id;
  // see `createAiSdkAdapter` for why a per-call counter would collide.
  let syntheticMessageId: string | null = null;

  let hasAbortListener = false;
  const cancelReader = () => {
    if (hasAbortListener) {
      signal.removeEventListener('abort', cancelReader);
      hasAbortListener = false;
    }
    reader.cancel(signal.reason).catch(() => {});
  };
  const cleanupAbortListener = () => {
    if (hasAbortListener) {
      signal.removeEventListener('abort', cancelReader);
      hasAbortListener = false;
    }
  };

  if (signal.aborted) {
    cancelReader();
  } else {
    signal.addEventListener('abort', cancelReader, { once: true });
    hasAbortListener = true;
  }

  const emit = (
    chunk: AiSdkUIMessageChunk,
    controller: ReadableStreamDefaultController<ChatMessageChunk>,
  ) => {
    if (chunk.type === 'error') {
      const text =
        typeof (chunk as { errorText?: unknown }).errorText === 'string'
          ? (chunk as { errorText: string }).errorText
          : 'AI SDK stream emitted an error chunk.';
      cleanupAbortListener();
      controller.error(new ChatStreamError(streamError(text)));
      return;
    }

    if (chunk.type === 'start' || chunk.type === 'finish' || chunk.type === 'abort') {
      const existing = (chunk as { messageId?: unknown }).messageId;
      if (typeof existing === 'string' && existing.length > 0) {
        syntheticMessageId = existing;
      } else {
        if (syntheticMessageId == null) {
          syntheticMessageId = nextSyntheticMessageId();
        }
        controller.enqueue({
          ...(chunk as Record<string, unknown>),
          messageId: syntheticMessageId,
        } as ChatMessageChunk);
        return;
      }
    }

    controller.enqueue(chunk as ChatMessageChunk);
  };

  return new ReadableStream<ChatMessageChunk>({
    async pull(controller) {
      // Drain enough source chunks to enqueue at least one downstream chunk
      // (or signal end). Multi-enqueue per pull is fully supported by all
      // WebStreams implementations we target, including jsdom's polyfill.
      for (;;) {
        // eslint-disable-next-line no-await-in-loop
        const { value, done } = await reader.read();
        if (done) {
          const remaining = buffer + decoder.decode();
          buffer = '';
          if (remaining.trim().length > 0) {
            try {
              const parsed = parseStreamLine(remaining);
              if (parsed != null) {
                emit(parsed as AiSdkUIMessageChunk, controller);
              }
            } catch {
              // trailing garbage — ignore
            }
          }
          controller.close();
          cleanupAbortListener();
          return;
        }
        if (value === undefined) {
          continue;
        }
        if (isObjectChunk(value)) {
          emit(value, controller);
          return;
        }
        buffer += decoder.decode(coerceToBytes(value), { stream: true });
        let enqueued = false;
        let newlineIndex = buffer.indexOf('\n');
        while (newlineIndex !== -1) {
          const rawLine = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          try {
            const parsed = parseStreamLine(rawLine);
            if (parsed != null) {
              emit(parsed as AiSdkUIMessageChunk, controller);
              enqueued = true;
            }
          } catch (err) {
            controller.error(
              new ChatStreamError(
                streamError(`AI SDK stream produced invalid JSON: ${(err as Error).message}`),
              ),
            );
            cleanupAbortListener();
            return;
          }
          newlineIndex = buffer.indexOf('\n');
        }
        if (enqueued) {
          return;
        }
      }
    },
    cancel(reason) {
      cleanupAbortListener();
      reader.cancel(reason).catch(() => {});
    },
  });
}

// Distinguishes an AI SDK object chunk from a raw byte chunk.
// We can't rely on `instanceof Uint8Array` because jsdom's
// `ReadableStream` polyfill loses typed-array identity in transit
// (the chunk arrives as a plain object with numeric-string keys).
// Every AI SDK UI Message Stream chunk has a string `type` discriminant,
// so that's a reliable signal.
function isObjectChunk(value: unknown): value is AiSdkUIMessageChunk {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as { type?: unknown }).type === 'string'
  );
}

function coerceToBytes(value: unknown): Uint8Array {
  if (value instanceof Uint8Array) {
    return value;
  }
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  // jsdom polyfill fallback: typed array transported as `{ '0': 123, '1': 34, …, byteLength?: n }`.
  const obj = value as Record<string, number>;
  const length =
    typeof obj.byteLength === 'number'
      ? obj.byteLength
      : Object.keys(obj).filter((k) => /^\d+$/.test(k)).length;
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    out[i] = obj[i];
  }
  return out;
}

// Emit a single (already-complete) assistant reply as the canonical 5-chunk
// stream `processStream` consumes. Used by the `{ chat }` adapter, where
// `useChat`'s `sendMessage`/`regenerate` resolve only after streaming finishes.
function emitWholeReplyStream(
  replyText: string,
  replyId: string,
): ReadableStream<ChatMessageChunk> {
  const partId = `${replyId}-text`;

  return new ReadableStream<ChatMessageChunk>({
    start(controller) {
      controller.enqueue({ type: 'start', messageId: replyId });
      controller.enqueue({ type: 'text-start', id: partId });
      controller.enqueue({ type: 'text-delta', id: partId, delta: replyText });
      controller.enqueue({ type: 'text-end', id: partId });
      controller.enqueue({ type: 'finish', messageId: replyId, finishReason: 'stop' });
      controller.close();
    },
  });
}

function getTrailingAssistantText(
  message: AiSdkChatInstance['messages'][number] | undefined,
): string {
  if (message == null) {
    return '';
  }
  return message.parts.map((part) => (part.type === 'text' ? (part.text ?? '') : '')).join('');
}

function createChatBasedAdapter(chat: AiSdkChatInstance): ChatAdapter {
  const adapter: ChatAdapter = {
    async sendMessage(input: ChatSendMessageInput) {
      const userText = getMessageText(input.message);
      const files = input.attachments?.map((attachment) => attachment.file);
      const lengthBefore = chat.messages.length;

      const onAbort = () => chat.stop();
      input.signal.addEventListener('abort', onAbort, { once: true });

      try {
        await chat.sendMessage({
          text: userText,
          ...(files && files.length > 0 ? { files } : {}),
        });
      } finally {
        input.signal.removeEventListener('abort', onAbort);
      }

      const last = chat.messages[chat.messages.length - 1];
      const isNewAssistantReply =
        last != null && last.role === 'assistant' && chat.messages.length > lengthBefore;
      const replyText = isNewAssistantReply ? getTrailingAssistantText(last) : '';
      const replyId = isNewAssistantReply ? last.id : `reply-${input.message.id}`;

      return emitWholeReplyStream(replyText, replyId);
    },
  };

  // Only expose `regenerate` when the underlying chat instance supports it, so
  // the runtime's capability check (`adapter.regenerate`) stays accurate and
  // falls back to a re-send otherwise.
  if (typeof chat.regenerate === 'function') {
    adapter.regenerate = async (input: ChatRegenerateInput) => {
      const onAbort = () => chat.stop();
      input.signal.addEventListener('abort', onAbort, { once: true });

      try {
        await chat.regenerate!({ messageId: input.messageId });
      } finally {
        input.signal.removeEventListener('abort', onAbort);
      }

      // AI SDK regeneration replaces the message in place, so the "new reply"
      // length heuristic from `sendMessage` does not apply — read the trailing
      // assistant message unconditionally.
      const last = chat.messages[chat.messages.length - 1];
      const replyText = getTrailingAssistantText(last);
      const replyId =
        last != null && last.role === 'assistant' ? last.id : `reply-${input.messageId}`;

      return emitWholeReplyStream(replyText, replyId);
    };
  }

  return adapter;
}

/**
 * Adapter that bridges Vercel's `ai` SDK UI Message Stream into MUI X Chat.
 *
 * Two integration shapes:
 *
 * - `{ stream }`: hand us a `ReadableStream` produced by
 *   `streamText(...).toUIMessageStream()` or `(await fetch(...)).body`.
 *   Token-by-token streaming, AI SDK `error` chunks become `ChatStreamError`.
 * - `{ chat }`: hand us a `useChat()` return value. We drive sends through
 *   `chat.sendMessage`; the reply arrives whole once streaming completes.
 *
 * No runtime dependency on the `ai` package — the chunk type and chat shape
 * are mirrored structurally so callers retain full type info when `ai` is
 * installed and still type-check cleanly when it isn't.
 */
export function createAiSdkAdapter(options: CreateAiSdkAdapterOptions): ChatAdapter {
  if ('chat' in options && options.chat) {
    return createChatBasedAdapter(options.chat);
  }

  const streamFn = (options as CreateAiSdkAdapterStreamOptions).stream;

  // Counter lives at adapter scope so each response gets a *unique* synthetic
  // message id. Backends that omit `messageId` on their `start`/`finish` chunks
  // (e.g. the AI SDK's bare `{ type: 'start' }`) rely on the adapter to supply
  // one. If the counter were scoped per `convertToChatStream` call it would
  // reset to the same first id on every send, so processStream would key every
  // reply to the same assistant message and append them into a single bubble.
  let syntheticIdCounter = 0;
  const nextSyntheticMessageId = () => {
    syntheticIdCounter += 1;
    return `ai-sdk-msg-${syntheticIdCounter.toString(36)}`;
  };

  return {
    async sendMessage(input: ChatSendMessageInput) {
      const upstream = await streamFn({
        message: input.message,
        messages: input.messages,
        attachments: input.attachments,
        metadata: input.metadata,
        trigger: 'submit-message',
        signal: input.signal,
      });

      return convertToChatStream(upstream, input.signal, nextSyntheticMessageId);
    },
    async regenerate(input: ChatRegenerateInput) {
      const upstream = await streamFn({
        // The anchor user message that prompted the reply being regenerated.
        message: input.message,
        messages: input.messages,
        trigger: 'regenerate-message',
        regenerateMessageId: input.messageId,
        signal: input.signal,
      });

      return convertToChatStream(upstream, input.signal, nextSyntheticMessageId);
    },
  };
}
