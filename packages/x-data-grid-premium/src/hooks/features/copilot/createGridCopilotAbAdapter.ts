/**
 * A/B-test adapter wrapper for the Grid Copilot.
 *
 * When the backend rolls a request into A/B-test mode it streams variant A
 * on the open response and embeds a twin URL in an early `message-metadata`
 * chunk. The adapter wrapper:
 *
 *  1. Forwards the inner stream chunks unchanged to the consumer.
 *  2. Sniffs each chunk for the `abTwinUrl` marker. As soon as it lands —
 *     usually within the first 1–2 chunks — fires a parallel
 *     `inner.sendMessage(input)` call, tagging the input's `metadata.abTwin`
 *     so the user-supplied `stream` callback (in `createAiSdkAdapter`) can
 *     route the second fetch to the twin URL instead of the primary
 *     endpoint.
 *  3. After the primary stream's terminal chunk (`finish` / `abort`),
 *     pipes the twin stream's chunks onto the same output. Each variant
 *     carries its own `messageId` on its `start` / `finish` chunks, so the
 *     headless `processStream` (with `allowMultipleMessages: true`,
 *     auto-set via `adapter.allowMultipleMessages`) lands both as sibling
 *     assistant messages.
 *
 * The wrapper is **opt-in transparent**: if the backend doesn't emit an
 * `abTwinUrl`, no twin fetch happens and the user sees the single-stream
 * UX exactly as before this wrapper existed.
 *
 * Design notes (and what this wrapper deliberately does NOT do):
 *
 *  - It does NOT interleave variant A's and B's text deltas. True
 *    delta-level parallelism would need `processStream` to track multiple
 *    in-flight message ids simultaneously; today it follows the most
 *    recent `start` chunk. Sequential streaming (A then B) keeps the
 *    headless contract small. Twin fetch is kicked off in parallel anyway,
 *    so by the time A finishes B's first bytes are usually already
 *    buffered.
 *  - It does NOT validate the `abTwinUrl`. The URL is trusted because it
 *    came from the same authenticated stream. The user-supplied `stream`
 *    callback should still resolve it against the original origin (the
 *    backend hands out a relative path).
 *  - It does NOT short-circuit when the user is no longer interested in
 *    variant B (e.g. picked A while B was streaming). That's a UI concern
 *    handled by `useGridCopilotExecutor`'s `switchToVariant` action.
 */
import type {
  ChatAdapter,
  ChatMessageChunk,
  ChatSendMessageInput,
  ChatStreamEnvelope,
} from '@mui/x-chat-headless';
import type { GridCopilotAdapter } from './gridCopilotInterfaces';

/**
 * Shape the inner adapter receives via `input.metadata.abTwin` when this
 * wrapper is firing the twin fetch. The user's `stream` callback in
 * `createAiSdkAdapter` should check this and, if present, fetch the
 * resolved `twinUrl` instead of the primary `/api/v1/datagrid/copilot`.
 */
export interface AbTwinMetadata {
  pairId: string;
  variant: 'B';
  twinUrl: string;
}

export type CopilotAdapterMessageMetadata = {
  abPairId?: string;
  abVariant?: 'A' | 'B';
  abTwinUrl?: string;
};

type ChatMessageChunkAny = ChatMessageChunk | ChatStreamEnvelope;

function isAbTestPreamble(value: ChatMessageChunkAny): CopilotAdapterMessageMetadata | null {
  // Envelope chunks wrap the actual chunk under `chunk`; unwrap before
  // peeking. Other paths use `value` directly.
  const chunk = 'chunk' in value ? value.chunk : (value as ChatMessageChunk);
  if (chunk?.type !== 'message-metadata') {
    return null;
  }
  const meta = (chunk as { messageMetadata?: CopilotAdapterMessageMetadata })
    .messageMetadata;
  if (!meta || typeof meta.abTwinUrl !== 'string') {
    return null;
  }
  return meta;
}

export interface CreateGridCopilotAbAdapterOptions {
  /**
   * Optional URL resolver. The backend emits relative twin URLs
   * (`/api/v1/datagrid/copilot?pairId=…&variant=B`). The user-supplied
   * `stream` callback in the inner adapter is the one that actually
   * performs the fetch and so must resolve the URL against the
   * appropriate origin. This option exists only to override the
   * relative-passthrough default if the consumer wants to rewrite the
   * URL before it reaches the inner stream callback (e.g. point the
   * twin at a debug proxy).
   * @param twinUrl
   */
  resolveTwinUrl?: (twinUrl: string) => string;
}

/**
 * Wraps a Grid Copilot adapter (typically the result of
 * `createAiSdkAdapter`) to enable A/B-test handling. The wrapper sets
 * `allowMultipleMessages: true` so the headless engine's `processStream`
 * allows the merged output to land two sibling messages per turn.
 */
export function createGridCopilotAbAdapter(
  inner: GridCopilotAdapter,
  options: CreateGridCopilotAbAdapterOptions = {},
): GridCopilotAdapter {
  const { resolveTwinUrl = (url) => url } = options;

  return {
    ...inner,
    // The runtime threads this flag into `processStream`; without it the
    // read loop would `break` on variant A's `finish` and we'd never see
    // variant B's `start`.
    allowMultipleMessages: true,
    sendMessage: async (input: ChatSendMessageInput) => {
      const primaryStream = await inner.sendMessage(input);

      // `twinPromise` becomes non-null the moment the primary stream emits
      // the ab-test preamble. We don't `await` it here so the twin fetch
      // races against the rest of the primary stream — by the time the
      // primary `finish` arrives, the twin's first bytes are usually
      // buffered and the subsequent pipe is near-instant.
      let twinPromise: Promise<ReadableStream<ChatMessageChunkAny>> | null = null;

      const combined = new ReadableStream<ChatMessageChunkAny>({
        async start(controller) {
          const primaryReader = primaryStream.getReader();
          try {
            while (true) {
              // eslint-disable-next-line no-await-in-loop
              const { done, value } = await primaryReader.read();
              if (done) {
                break;
              }
              controller.enqueue(value);

              if (!twinPromise) {
                const preamble = isAbTestPreamble(value);
                if (preamble?.abTwinUrl) {
                  const twinUrl = resolveTwinUrl(preamble.abTwinUrl);
                  const abTwin: AbTwinMetadata = {
                    pairId: preamble.abPairId ?? '',
                    variant: 'B',
                    twinUrl,
                  };
                  // Fire-and-store. We deliberately don't `await` so the
                  // twin fetch parallelises with the rest of A's stream.
                  twinPromise = inner.sendMessage({
                    ...input,
                    metadata: {
                      ...(input.metadata ?? {}),
                      abTwin,
                    },
                  });
                  // Swallow the un-awaited rejection so an immediate
                  // twin-fetch failure doesn't bubble up as an unhandled
                  // promise rejection while we're still pumping primary
                  // chunks. The error will surface again when we await
                  // `twinPromise` below.
                  twinPromise.catch(() => {});
                }
              }
            }
          } finally {
            primaryReader.releaseLock();
          }

          // Primary stream closed — pipe twin (if any) on top of the same
          // output. The twin's `start` chunk carries its own messageId,
          // which `processStream`'s multi-message handler treats as a new
          // sibling assistant message.
          if (twinPromise) {
            let twinStream: ReadableStream<ChatMessageChunkAny>;
            try {
              twinStream = await twinPromise;
            } catch (err) {
              // If the twin fetch failed entirely, surface a synthetic
              // text part so the user sees *something* in the AB slot
              // rather than a permanently-empty card. The primary
              // response is unaffected.
              const message = err instanceof Error ? err.message : String(err);
              const fallbackId = `ab-twin-error-${Date.now()}`;
              controller.enqueue({ type: 'start', messageId: fallbackId } as ChatMessageChunk);
              controller.enqueue({
                type: 'text-start',
                id: `${fallbackId}-text`,
              } as ChatMessageChunk);
              controller.enqueue({
                type: 'text-delta',
                id: `${fallbackId}-text`,
                delta: `Twin variant failed to load: ${message}`,
              } as ChatMessageChunk);
              controller.enqueue({
                type: 'text-end',
                id: `${fallbackId}-text`,
              } as ChatMessageChunk);
              controller.enqueue({
                type: 'finish',
                messageId: fallbackId,
                finishReason: 'error',
              } as ChatMessageChunk);
              controller.close();
              return;
            }

            const twinReader = twinStream.getReader();
            try {
              while (true) {
                // eslint-disable-next-line no-await-in-loop
                const { done, value } = await twinReader.read();
                if (done) {
                  break;
                }
                controller.enqueue(value);
              }
            } finally {
              twinReader.releaseLock();
            }
          }

          controller.close();
        },

        async cancel(reason) {
          // Forward cancellation to both upstream streams so an aborted
          // user request doesn't leak two outstanding fetches.
          try {
            await primaryStream.cancel(reason);
          } catch {
            // ignore
          }
          if (twinPromise) {
            try {
              const twinStream = await twinPromise;
              await twinStream.cancel(reason);
            } catch {
              // ignore
            }
          }
        },
      });

      return combined;
    },

    stop() {
      inner.stop?.();
    },
  } satisfies ChatAdapter;
}
