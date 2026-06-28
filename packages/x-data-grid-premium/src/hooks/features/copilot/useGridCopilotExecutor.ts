'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type {
  ChatAdapter,
  ChatAddToolApproveResponseInput,
  ChatMessage,
  ChatMessageChunk,
  ChatStreamEnvelope,
} from '@mui/x-chat-headless';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridCopilotAdapter } from './gridCopilotInterfaces';
import type { CopilotPlugin } from './plugins';
import {
  makeExecutor,
  type Executor,
  type GridCopilotEnvelope,
  type GridCopilotExecutionResult,
  type ToolName,
} from './executor';
import {
  executeGridDataQuery,
  type GridDataQueryInput,
  type GridDataQueryResult,
} from './executor/queryGridData';

const SUPPORTED_TOOL_NAMES = new Set<ToolName>(['setGridState', 'runCommands']);
const QUERY_TOOL_NAME = 'queryGridData';

// Ship only the SHAPE of a queryGridData result + a JSON-Pointer the model
// uses for `$state` references; the actual values stay on the client.
function buildToolResultPayloadForBackend(
  toolCallId: string,
  result: GridDataQueryResult,
): { meta: GridDataQueryResult['meta']; stateBinding: string } {
  return { meta: result.meta, stateBinding: `/queries/${toolCallId}` };
}

interface ToolStreamState {
  toolName: ToolName;
  toolIndex: number;
  buffer: string;
  dispatched: boolean;
}

interface QueryToolStreamState {
  toolCallId: string;
  buffer: string;
}

// Hard cap on how many `composePdfReport` ↔ `queryGridData` follow-up
// round-trips one user turn can spawn before we bail with an error. Keeps
// the loop bounded if the model gets stuck re-querying instead of emitting
// a final answer.
const MAX_FOLLOW_UP_DEPTH = 5;

// If no chunk arrives within this window we assume the stream is hung
// (backend crash, network drop, runaway model) and surface an error to
// the user instead of leaving a forever-pulsing card. Tuned generously to
// avoid false positives on long reasoning chains.
const STREAM_STALL_TIMEOUT_MS = 90_000;

/**
 * `reader.read()` raced against a stall timeout. Returns `'timeout'` if no
 * chunk has arrived within `timeoutMs`; the caller is expected to abort
 * the underlying stream and surface an error.
 */
async function readWithStallTimeout<T>(
  reader: ReadableStreamDefaultReader<T>,
  timeoutMs: number,
): Promise<ReadableStreamReadResult<T> | 'timeout'> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<'timeout'>((resolve) => {
    timer = setTimeout(() => resolve('timeout'), timeoutMs);
  });
  try {
    return await Promise.race([reader.read(), timeout]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

async function emitStallError(
  writer: WritableStreamDefaultWriter<ChatMessageChunk | ChatStreamEnvelope>,
): Promise<void> {
  const id = 'stream-stall';
  try {
    await writer.write({ type: 'text-start', id } as unknown as ChatMessageChunk);
    await writer.write({
      type: 'text-delta',
      id,
      delta: `Copilot stopped responding after ${Math.round(STREAM_STALL_TIMEOUT_MS / 1000)}s. Start a new conversation to try again.`,
    } as unknown as ChatMessageChunk);
    await writer.write({ type: 'text-end', id } as unknown as ChatMessageChunk);
    await writer.write({
      type: 'finish',
      messageId: '',
      finishReason: 'error',
    } as unknown as ChatMessageChunk);
  } catch {
    // writer already closed
  }
}

// Shared state across all `queryGridData` calls auto-executed on a single
// `sendMessage` chain. Multiple results on the same writer coordinate
// through this so a single follow-up backend call carries every result.
interface ApprovalBatchState {
  writer: WritableStreamDefaultWriter<ChatMessageChunk | ChatStreamEnvelope>;
  // Trailing `finish` chunk from the most recent backend stream, deferred
  // until every queryGridData on the same turn has been auto-executed.
  // Emitted when no follow-up is launched.
  bufferedFinish: { value: ChatMessageChunk | ChatStreamEnvelope | undefined };
  // Results accumulated for the NEXT follow-up backend call. Cleared as
  // soon as `maybeFinalizeBatch` consumes them so a follow-up that itself
  // emits more queryGridData tracks only the NEW results.
  approvedResults: Array<{ toolCallId: string; toolName: string; output: GridDataQueryResult }>;
  // Snapshot of the conversation messages at the moment the first stream
  // started — passed verbatim to the follow-up `sendMessage` call.
  messagesAtCall: ChatMessage[];
  conversationId: string | undefined;
  // Count of follow-up backend calls already fired for this user turn.
  // Bumped inside `maybeFinalizeBatch`; bailed at MAX_FOLLOW_UP_DEPTH.
  followUpDepth: { value: number };
  // Plugin ids reported to the backend in `metadata.copilotPlugins` so the
  // backend can conditionally expose matching server-side tools to the model.
  copilotPlugins: readonly string[];
  // Plugin handlers keyed by toolName. Used by both the initial-stream pump
  // and the follow-up pump in `maybeFinalizeBatch` so plugin-claimed tool
  // calls (e.g. composePdfReport) are dispatched no matter which turn they
  // arrive on.
  pluginByToolName: ReadonlyMap<string, CopilotPlugin>;
  apiRef: RefObject<GridPrivateApiPremium>;
  queryResultsRef: { current: Map<string, GridDataQueryResult> };
}

async function writeChunkSafe(
  writer: WritableStreamDefaultWriter<ChatMessageChunk | ChatStreamEnvelope>,
  chunk: ChatMessageChunk | ChatStreamEnvelope,
): Promise<void> {
  try {
    await writer.write(chunk);
  } catch {
    // writer closed — nothing to do
  }
}

type ToolInputAvailableChunk = ChatMessageChunk & {
  type: 'tool-input-available';
  toolCallId: string;
  toolName: string;
  input: unknown;
};

/**
 * Run a `queryGridData` tool call against the live grid and emit
 * `tool-output-available` (or `tool-output-error`) on the same writer the
 * chat hook is reading from. Push the result onto `batch.approvedResults`
 * so the next `maybeFinalizeBatch` carries it to the backend as
 * `metadata.toolResults`.
 *
 * `value` is the original chunk (envelope or chunk) — forwarded verbatim
 * before the output so the chat hook sees `tool-input-available` →
 * `tool-output-available` in order.
 *
 * `parsedInput` is the already-parsed `GridDataQueryInput`, or `undefined`
 * if the caller couldn't recover it (we surface a clear error to the model
 * in that case instead of swallowing it).
 */
async function autoExecuteQueryGridData(
  value: ChatMessageChunk | ChatStreamEnvelope,
  toolCallId: string,
  parsedInput: GridDataQueryInput | undefined,
  batch: ApprovalBatchState,
): Promise<void> {
  await writeChunkSafe(batch.writer, value);

  if (!parsedInput || typeof parsedInput !== 'object' || typeof parsedInput.mode !== 'string') {
    await writeChunkSafe(batch.writer, {
      type: 'tool-output-error',
      toolCallId,
      errorText: 'queryGridData input missing required `mode` field.',
    } as ChatMessageChunk);
    return;
  }

  // Reject `mode:"aggregate"` calls that forgot to supply `aggregations` —
  // executing them would return an empty `aggregations: []` result, the
  // model would notice the gap, and we'd spend an extra turn re-querying.
  // Surfacing the error on the SAME turn lets the model correct without
  // burning a round-trip.
  if (
    parsedInput.mode === 'aggregate' &&
    (!parsedInput.aggregations || parsedInput.aggregations.length === 0)
  ) {
    await writeChunkSafe(batch.writer, {
      type: 'tool-output-error',
      toolCallId,
      errorText:
        'queryGridData with mode:"aggregate" requires at least one entry in `aggregations` (e.g. `[{"field":"salary","fn":"sum"}]`). Retry on the same turn with the aggregations specified.',
    } as ChatMessageChunk);
    return;
  }

  try {
    const result = executeGridDataQuery(parsedInput, batch.apiRef);
    batch.approvedResults.push({
      toolCallId,
      toolName: QUERY_TOOL_NAME,
      output: result,
    });
    batch.queryResultsRef.current.set(toolCallId, result);
    await writeChunkSafe(batch.writer, {
      type: 'tool-output-available',
      toolCallId,
      output: result,
    } as ChatMessageChunk);
  } catch (err) {
    await writeChunkSafe(batch.writer, {
      type: 'tool-output-error',
      toolCallId,
      errorText: (err as Error)?.message ?? String(err),
    } as ChatMessageChunk);
  }
}

// Shared by both stream pumps so tool calls are handled the same way
// regardless of which turn the model emits them on. Order: core (`queryGridData`)
// → plugin handlers → unknown (forwarded verbatim).
async function forwardChunkWithPluginDispatch(
  value: ChatMessageChunk | ChatStreamEnvelope,
  chunk: ChatMessageChunk,
  batch: ApprovalBatchState,
): Promise<void> {
  if (chunk.type === 'tool-input-available') {
    const input = chunk as ToolInputAvailableChunk;
    if (input.toolName === QUERY_TOOL_NAME) {
      await autoExecuteQueryGridData(
        value,
        input.toolCallId,
        input.input as GridDataQueryInput | undefined,
        batch,
      );
      return;
    }
    const plugin = batch.pluginByToolName.get(input.toolName);
    if (plugin) {
      await writeChunkSafe(batch.writer, value);
      try {
        await plugin.handleToolCall({
          toolCallId: input.toolCallId,
          toolName: input.toolName,
          input: input.input,
          queryResults: batch.queryResultsRef.current,
          apiRef: batch.apiRef,
          conversationId: batch.conversationId,
          emitResult: (output) =>
            writeChunkSafe(batch.writer, {
              type: 'tool-output-available',
              toolCallId: input.toolCallId,
              output,
            } as ChatMessageChunk),
          emitError: (errorText) =>
            writeChunkSafe(batch.writer, {
              type: 'tool-output-error',
              toolCallId: input.toolCallId,
              errorText,
            } as ChatMessageChunk),
        });
      } catch (err) {
        const errorText = (err as Error)?.message ?? String(err);
        await writeChunkSafe(batch.writer, {
          type: 'tool-output-error',
          toolCallId: input.toolCallId,
          errorText,
        } as ChatMessageChunk);
      }
      return;
    }
  }
  await writeChunkSafe(batch.writer, value);
}

function safeParseWrapper(text: string): Record<string, unknown> | undefined {
  if (!text) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : undefined;
  } catch {
    return undefined;
  }
}

function safeParseQueryInput(text: string): GridDataQueryInput | undefined {
  if (!text) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && typeof (parsed as any).mode === 'string') {
      return parsed as GridDataQueryInput;
    }
  } catch {
    // fall through
  }
  return undefined;
}

function dispatchAssembled(
  state: ToolStreamState,
  input: Record<string, unknown> | undefined,
  executor: Executor,
  options: { apply: boolean; onBody?: (toolName: ToolName, body: string) => void } = {
    apply: true,
  },
): void {
  if (state.dispatched) {
    return;
  }
  state.dispatched = true;
  const field = state.toolName === 'setGridState' ? 'patches' : 'commands';
  const body = typeof input?.[field] === 'string' ? (input[field] as string) : '';
  if (!body) {
    return;
  }
  // Always record the body so an A/B switch can replay the envelope later,
  // even when we suppressed the dispatch (variant B's patches are buffered
  // but not applied to the grid until the user picks).
  options.onBody?.(state.toolName, body);
  if (options.apply) {
    executor.pushChunk(state.toolIndex, state.toolName, body);
  }
}

interface ConsumeOptions {
  executor: Executor;
  onResults?: (messageId: string, results: GridCopilotExecutionResult) => void;
  /**
   * Per-call hook fired the moment a `setGridState` / `runCommands` tool
   * call completes. Receives the *raw* JSONL body so the consumer can
   * accumulate it into a per-messageId envelope cache that survives the
   * stream and is replayable later via `applyEnvelope` (used by
   * `switchToVariant` for the A/B preview/switch flow).
   * @param messageId
   * @param toolName
   * @param body
   */
  onAssembledBody?: (messageId: string, toolName: ToolName, body: string) => void;
  /**
   * Decides whether a freshly-assembled tool body should be applied to the
   * grid. The implementation reads per-messageId metadata (`abVariant`)
   * sniffed from `message-metadata` chunks on the same stream. Returning
   * `false` keeps the body buffered (via `onAssembledBody`) without
   * touching the grid — that's how variant B's patches stay dormant until
   * the user picks them.
   *
   * Defaults to apply-everything (existing single-stream behaviour).
   * @param messageId
   */
  shouldApply?: (messageId: string | undefined) => boolean;
  /**
   * Surfaces `message-metadata` chunks (the A/B preamble and any later
   * frames). The executor hook uses this to populate its per-messageId
   * variant map so `shouldApply` can decide whether to dispatch.
   * @param messageId
   * @param metadata
   * @param metadata.abVariant
   * @param metadata.abPairId
   */
  onMessageMetadata?: (
    messageId: string,
    metadata: { abVariant?: 'A' | 'B'; abPairId?: string },
  ) => void;
}

// Consume the executor branch of a teed adapter response stream. Routes
// `tool-input-*` events for `setGridState` / `runCommands` into the executor.
// `queryGridData` is the chat branch's responsibility (see
// `createApprovalAwareStream`) — we just skip it here. Plugin-claimed tools
// (e.g. `answerWithFormula`, `composePdfReport`) are also chat-branch only.
async function consumeForExecutor(
  stream: ReadableStream<ChatMessageChunk | ChatStreamEnvelope>,
  options: ConsumeOptions,
): Promise<void> {
  const { executor, onResults, onAssembledBody, shouldApply } = options;
  const reader = stream.getReader();
  const toolsById = new Map<string, ToolStreamState>();
  let nextToolIndex = 0;
  let currentMessageId: string | undefined;
  const reportedMessageIds = new Set<string>();

  const dispatchOptionsFor = (messageId: string | undefined) => ({
    apply: shouldApply ? shouldApply(messageId) : true,
    onBody:
      onAssembledBody && messageId
        ? (toolName: ToolName, body: string) => onAssembledBody(messageId, toolName, body)
        : undefined,
  });

  // Per-messageId result snapshots. With A/B mode a single executor handles
  // chunks from both siblings, so we report when each `finish` chunk lands
  // (capturing the executor state at that point) rather than waiting for the
  // single final terminal chunk.
  const reportResults = () => {
    if (!currentMessageId || !onResults) {
      return;
    }
    if (reportedMessageIds.has(currentMessageId)) {
      return;
    }
    reportedMessageIds.add(currentMessageId);
    onResults(currentMessageId, {
      applied: [...executor.results.applied],
      skipped: [...executor.results.skipped],
    });
  };

  try {
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const chunk: ChatMessageChunk = isEnvelope(value) ? value.chunk : value;
      switch (chunk.type) {
        case 'start': {
          const id = (chunk as { messageId?: string }).messageId;
          if (typeof id === 'string' && id.length > 0) {
            currentMessageId = id;
          }
          break;
        }
        case 'tool-input-start': {
          const toolName = chunk.toolName as string;
          if (SUPPORTED_TOOL_NAMES.has(toolName as ToolName)) {
            toolsById.set(chunk.toolCallId, {
              toolName: toolName as ToolName,
              toolIndex: nextToolIndex,
              buffer: '',
              dispatched: false,
            });
            nextToolIndex += 1;
          }
          break;
        }
        case 'tool-input-delta': {
          const state = toolsById.get(chunk.toolCallId);
          if (state) {
            const delta = (chunk as { inputTextDelta?: string }).inputTextDelta;
            if (typeof delta === 'string') {
              state.buffer += delta;
            }
          }
          break;
        }
        case 'tool-input-available': {
          const state = toolsById.get(chunk.toolCallId);
          if (state) {
            const fromChunk = chunk.input as Record<string, unknown> | undefined;
            const input = fromChunk ?? safeParseWrapper(state.buffer);
            dispatchAssembled(state, input, executor, dispatchOptionsFor(currentMessageId));
            executor.onToolStop(state.toolIndex, state.toolName);
            toolsById.delete(chunk.toolCallId);
          }
          break;
        }
        case 'tool-input-error': {
          const state = toolsById.get(chunk.toolCallId);
          if (state) {
            executor.onToolStop(state.toolIndex, state.toolName);
            toolsById.delete(chunk.toolCallId);
          }
          break;
        }
        case 'finish': {
          const id = (chunk as { messageId?: string }).messageId;
          if (typeof id === 'string' && id.length > 0) {
            currentMessageId = id;
          }
          for (const state of toolsById.values()) {
            if (!state.dispatched) {
              dispatchAssembled(
                state,
                safeParseWrapper(state.buffer),
                executor,
                dispatchOptionsFor(currentMessageId),
              );
            }
            executor.onToolStop(state.toolIndex, state.toolName);
          }
          toolsById.clear();
          executor.onAllToolsStop();
          reportResults();
          break;
        }
        case 'message-metadata': {
          // The backend rides the AB pair / variant / responseId on a
          // leading `message-metadata` chunk so the adapter can detect AB
          // mode early. Surface it to the consumer (the executor hook
          // populates its per-messageId variant map and uses that to
          // decide whether the next tool call should hit the grid or just
          // buffer for later replay).
          const meta = (chunk as { messageMetadata?: Record<string, unknown> }).messageMetadata;
          if (
            meta &&
            currentMessageId &&
            options.onMessageMetadata &&
            (typeof meta.abVariant === 'string' || typeof meta.abPairId === 'string')
          ) {
            options.onMessageMetadata(currentMessageId, {
              abVariant:
                meta.abVariant === 'A' || meta.abVariant === 'B' ? meta.abVariant : undefined,
              abPairId: typeof meta.abPairId === 'string' ? meta.abPairId : undefined,
            });
          }
          break;
        }
        default:
          // Other chunks (text, reasoning, etc.) are ignored on the executor branch.
          break;
      }
    }
  } finally {
    reader.releaseLock();
    if (toolsById.size > 0) {
      for (const state of toolsById.values()) {
        if (!state.dispatched) {
          dispatchAssembled(
            state,
            safeParseWrapper(state.buffer),
            executor,
            dispatchOptionsFor(currentMessageId),
          );
        }
        executor.onToolStop(state.toolIndex, state.toolName);
      }
      executor.onAllToolsStop();
    }
    reportResults();
  }
}

function isEnvelope(
  value: ChatMessageChunk | ChatStreamEnvelope | undefined,
): value is ChatStreamEnvelope {
  return (
    !!value &&
    typeof (value as ChatStreamEnvelope).chunk === 'object' &&
    (value as ChatStreamEnvelope).chunk !== null
  );
}

interface ApprovalAwareStreamArgs {
  conversationId: string | undefined;
  messagesAtCall: ChatMessage[];
  plugins: readonly CopilotPlugin[];
  apiRef: RefObject<GridPrivateApiPremium>;
  inner: ChatAdapter;
  /** Live (cross-turn) query-result store. The pump reads it when dispatching
   *  plugin tool calls so plugins can resolve `$state` references at write-time. */
  queryResultsRef: { current: Map<string, GridDataQueryResult> };
}

/**
 * Drive zero or more follow-up backend calls until the model stops emitting
 * new `queryGridData` and finishes the turn. Re-entrant: each call snapshots
 * `batch.approvedResults`, sends the snapshot in `metadata.toolResults`,
 * pumps the follow-up stream (which may itself push new results onto
 * `batch.approvedResults` via `autoExecuteQueryGridData`), and recurses
 * when fresh results are waiting. The trailing `finish` of the LAST
 * follow-up stream closes the writer.
 *
 * Bounded by `MAX_FOLLOW_UP_DEPTH` so a model stuck re-querying can't
 * loop forever.
 */
async function maybeFinalizeBatch(inner: ChatAdapter, batch: ApprovalBatchState): Promise<void> {
  // Snapshot the pending results and clear so any NEW results that arrive
  // during this turn's follow-up stream are tracked separately and trigger
  // a fresh recursion.
  const pending = batch.approvedResults.splice(0);

  if (pending.length === 0) {
    // Nothing to send — replay the buffered finish and close. This is the
    // path taken when a turn had no queryGridData at all (e.g. plain text).
    const buffered = batch.bufferedFinish.value;
    batch.bufferedFinish.value = undefined;
    if (buffered !== undefined) {
      try {
        await batch.writer.write(buffered);
      } catch {
        // writer already closed
      }
    }
    try {
      await batch.writer.close();
    } catch {
      // already closed
    }
    return;
  }

  // Discard the previous turn's buffered `finish` — this follow-up will
  // emit its own `finish`, which is what closes the assistant message in
  // the chat store.
  batch.bufferedFinish.value = undefined;

  batch.followUpDepth.value += 1;
  if (batch.followUpDepth.value > MAX_FOLLOW_UP_DEPTH) {
    const errorId = `follow-up-depth-cap`;
    try {
      await batch.writer.write({
        type: 'text-start',
        id: errorId,
      } as unknown as ChatMessageChunk);
      await batch.writer.write({
        type: 'text-delta',
        id: errorId,
        delta: `Copilot kept requesting data without finishing the turn. Stopping after ${MAX_FOLLOW_UP_DEPTH} rounds — start a new conversation to try again.`,
      } as unknown as ChatMessageChunk);
      await batch.writer.write({
        type: 'text-end',
        id: errorId,
      } as unknown as ChatMessageChunk);
      await batch.writer.write({
        type: 'finish',
        messageId: '',
        finishReason: 'error',
      } as unknown as ChatMessageChunk);
    } catch {
      // writer already closed
    }
    try {
      await batch.writer.close();
    } catch {
      // already closed
    }
    return;
  }

  const lastUserMessage =
    [...batch.messagesAtCall].reverse().find((m) => m.role === 'user') ?? batch.messagesAtCall[0];

  // Strip raw rows/aggregations from the outgoing payload — the model only
  // sees the SHAPE of the data, not the values. Values stay on the client
  // and are resolved against the live grid at PDF render-time.
  const strippedResults = pending.map((entry) => ({
    toolCallId: entry.toolCallId,
    toolName: entry.toolName,
    output: buildToolResultPayloadForBackend(entry.toolCallId, entry.output),
  }));

  const controller = new AbortController();
  let followUpStream: ReadableStream<ChatMessageChunk | ChatStreamEnvelope>;
  try {
    followUpStream = await inner.sendMessage({
      conversationId: batch.conversationId,
      message: lastUserMessage,
      messages: batch.messagesAtCall,
      signal: controller.signal,
      metadata: {
        toolResults: strippedResults,
        copilotPlugins: batch.copilotPlugins,
      },
    });
  } catch (err) {
    const errorText = (err as Error)?.message ?? String(err);
    const errorId = `follow-up-error`;
    try {
      await batch.writer.write({
        type: 'text-start',
        id: errorId,
      } as unknown as ChatMessageChunk);
      await batch.writer.write({
        type: 'text-delta',
        id: errorId,
        delta: `Failed to continue after approval: ${errorText}`,
      } as unknown as ChatMessageChunk);
      await batch.writer.write({
        type: 'text-end',
        id: errorId,
      } as unknown as ChatMessageChunk);
      await batch.writer.write({
        type: 'finish',
        messageId: '',
        finishReason: 'error',
      } as unknown as ChatMessageChunk);
    } catch {
      // writer already closed
    }
    try {
      await batch.writer.close();
    } catch {
      // already closed
    }
    return;
  }

  // Pipe the follow-up backend stream's chunks into the same writer.
  // Skip its own `start` chunk so we stay on a single logical assistant
  // message — `processStream` exits its read loop on the first `finish`,
  // so a fresh `start` would either be ignored after a finish or (if
  // forwarded earlier) reassign `targetMessageId` mid-message.
  //
  // If the model emits MORE `queryGridData` calls inside this follow-up
  // stream, `forwardChunkWithPluginDispatch` auto-executes them and pushes
  // results onto `batch.approvedResults`. We defer this stream's `finish`
  // so the next recursion's `sendMessage` can carry the freshly-collected
  // results without the chat-hook closing the message in between.
  const followReader = followUpStream.getReader();
  let stalled = false;
  try {
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const result = await readWithStallTimeout(followReader, STREAM_STALL_TIMEOUT_MS);
      if (result === 'timeout') {
        stalled = true;
        try {
          controller.abort();
        } catch {
          // already aborted
        }
        // eslint-disable-next-line no-await-in-loop
        await emitStallError(batch.writer);
        break;
      }
      const { value, done } = result;
      if (done) {
        break;
      }
      const chunk = isEnvelope(value) ? value.chunk : value;
      if (chunk.type === 'start') {
        continue;
      }
      if (chunk.type === 'finish') {
        // Buffer until we know whether we'll recurse — if there are more
        // results to ship, we drop this finish; otherwise we replay it on
        // the no-pending recursion.
        batch.bufferedFinish.value = value;
        continue;
      }
      // eslint-disable-next-line no-await-in-loop
      await forwardChunkWithPluginDispatch(value, chunk, batch);
    }
  } catch (err) {
    try {
      batch.writer.abort(err);
    } catch {
      // already closed
    }
    return;
  } finally {
    followReader.releaseLock();
  }

  if (stalled) {
    try {
      await batch.writer.close();
    } catch {
      // already closed
    }
    return;
  }

  // Recurse: if the follow-up stream emitted new queryGridData results,
  // ship them on another turn. Otherwise this call will fall through the
  // `pending.length === 0` branch and replay the buffered `finish` +
  // close the writer.
  await maybeFinalizeBatch(inner, batch);
}

/**
 * Wraps a backend response stream and handles client-side tool execution:
 *
 *  1. Pass every chunk through to the chat hook untouched, EXCEPT for
 *     `tool-input-available` chunks targeting `queryGridData` — those are
 *     **auto-executed against the live grid**. The result is written back
 *     as `tool-output-available` on the same stream, and the raw values
 *     are cached in `queryResultsRef` so plugin renderers (PDF, formula)
 *     can resolve `$state` references at render time. Only `meta + state
 *     binding` is forwarded to the backend on the follow-up turn — the
 *     values never leave the browser, which is why we don't need a
 *     user-approval gate.
 *  2. While any auto-executed `queryGridData` is pending (or a non-auto
 *     plugin still needs approval), buffer the trailing `finish` chunk.
 *     When the first stream drains and we have accumulated tool results,
 *     fire ONE follow-up backend call carrying every output via
 *     `metadata.toolResults`. The follow-up stream is piped into the same
 *     writer so the chat hook sees a single continuous assistant message.
 *
 * The returned readable is what the chat hook reads from. The writer side
 * stays open until either (a) no follow-up was needed and the first
 * pump finishes (closed right away); or (b) `maybeFinalizeBatch` closes
 * it after the follow-up stream drains.
 */
function createApprovalAwareStream(
  upstream: ReadableStream<ChatMessageChunk | ChatStreamEnvelope>,
  args: ApprovalAwareStreamArgs,
): ReadableStream<ChatMessageChunk | ChatStreamEnvelope> {
  const transform = new TransformStream<
    ChatMessageChunk | ChatStreamEnvelope,
    ChatMessageChunk | ChatStreamEnvelope
  >();
  const writer = transform.writable.getWriter();

  // Lookup table for plugin tool dispatch. The first plugin claiming a given
  // toolName wins.
  const pluginByToolName = new Map<string, CopilotPlugin>();
  for (const plugin of args.plugins) {
    for (const toolName of plugin.toolNames) {
      if (!pluginByToolName.has(toolName)) {
        pluginByToolName.set(toolName, plugin);
      }
    }
  }

  const batch: ApprovalBatchState = {
    writer,
    bufferedFinish: { value: undefined },
    approvedResults: [],
    messagesAtCall: args.messagesAtCall,
    conversationId: args.conversationId,
    followUpDepth: { value: 0 },
    copilotPlugins: args.plugins.map((plugin) => plugin.id),
    pluginByToolName,
    apiRef: args.apiRef,
    queryResultsRef: args.queryResultsRef,
  };

  // Track partial inputs for `queryGridData` so we can fall back to parsing
  // the accumulated delta buffer if a backend ever omits a `tool-input-available`.
  const queryToolsById = new Map<string, QueryToolStreamState>();

  void (async () => {
    const reader = upstream.getReader();
    let stalled = false;
    try {
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const result = await readWithStallTimeout(reader, STREAM_STALL_TIMEOUT_MS);
        if (result === 'timeout') {
          stalled = true;
          try {
            (reader as unknown as { cancel?: (reason?: unknown) => Promise<void> }).cancel?.(
              new Error('stream-stall'),
            );
          } catch {
            // already closed
          }
          // eslint-disable-next-line no-await-in-loop
          await emitStallError(writer);
          break;
        }
        const { value, done } = result;
        if (done) {
          break;
        }
        const chunk: ChatMessageChunk = isEnvelope(value) ? value.chunk : value;

        const chunkToolName = (chunk as { toolName?: string }).toolName;
        if (chunk.type === 'tool-input-start' && chunkToolName === QUERY_TOOL_NAME) {
          queryToolsById.set(chunk.toolCallId, { toolCallId: chunk.toolCallId, buffer: '' });
          // Skip forwarding queryGridData's input-start — the chat hook would
          // briefly enter `input-streaming` state and we replace it with
          // `approval-requested` immediately.
          continue;
        }

        if (chunk.type === 'tool-input-delta') {
          const queryState = queryToolsById.get(chunk.toolCallId);
          if (queryState) {
            const delta = (chunk as { inputTextDelta?: string }).inputTextDelta;
            if (typeof delta === 'string') {
              queryState.buffer += delta;
            }
            continue;
          }
        }

        if (chunk.type === 'tool-input-available' && chunkToolName === QUERY_TOOL_NAME) {
          const queryState = queryToolsById.get(chunk.toolCallId);
          const inputChunk = chunk as ToolInputAvailableChunk;
          const fromChunk = inputChunk.input as GridDataQueryInput | undefined;
          // Fall back to the buffered delta string when `input` is missing
          // from the chunk (some backends only stream the input incrementally).
          const input =
            fromChunk ?? (queryState ? safeParseQueryInput(queryState.buffer) : undefined);
          queryToolsById.delete(chunk.toolCallId);

          // eslint-disable-next-line no-await-in-loop
          await autoExecuteQueryGridData(value, chunk.toolCallId, input, batch);
          continue;
        }

        if (chunk.type === 'finish' && batch.approvedResults.length > 0) {
          // Defer: maybeFinalizeBatch will ship the buffered results on the
          // next backend turn.
          batch.bufferedFinish.value = value;
          continue;
        }

        // eslint-disable-next-line no-await-in-loop
        await forwardChunkWithPluginDispatch(value, chunk, batch);
      }
    } catch (err) {
      try {
        writer.abort(err);
      } catch {
        // already closed
      }
    } finally {
      reader.releaseLock();
      if (stalled) {
        // Stall already wrote an error chunk + error finish; just close.
        try {
          await writer.close();
        } catch {
          // already closed
        }
      } else if (batch.approvedResults.length > 0) {
        // We auto-executed queryGridData(s) — fire the follow-up backend
        // call so the model can emit `composePdfReport` (or similar) with
        // the now-available stateBindings. `maybeFinalizeBatch` recurses
        // if the follow-up turn itself emits more queryGridData.
        await maybeFinalizeBatch(args.inner, batch);
      } else {
        // Plain turn (no tool results to ship). Replay any deferred finish
        // and close the writer.
        const buffered = batch.bufferedFinish.value;
        batch.bufferedFinish.value = undefined;
        if (buffered !== undefined) {
          try {
            await writer.write(buffered);
          } catch {
            // already closed
          }
        }
        try {
          await writer.close();
        } catch {
          // already closed
        }
      }
    }
  })();

  return transform.readable;
}

/**
 * Wraps the chat-bound stream so that the executor's `GridCopilotExecutionResult`
 * — the locally-computed `applied` / `skipped` entries that drive the formula
 * answer and applied-changes cards — is published to `message.metadata.gridCopilotExecutionResult`
 * via a synthetic `message-metadata` chunk emitted before the closing `finish`.
 *
 * Why: tool parts (`composePdfReport`, `queryGridData`, etc.) survive a
 * localStorage reload because they live in `message.parts`, which the chat
 * persistence layer serializes verbatim. But formula answers and
 * applied-changes entries are computed *here* in the executor and would
 * otherwise live only in a volatile in-memory `Map` — so on reload the cards
 * would mount (their tool part is in `parts`) but have no data to render.
 *
 * By pushing the same `GridCopilotExecutionResult` into `message.metadata`,
 * the live-render fallback path in `CopilotFormulaAnswer.getPersistedAnswers`
 * and `CopilotAppliedChanges.getPersistedExecutionResult` produces an identical
 * UI before and after reload.
 *
 * Convention for any future custom Copilot UI: data that's part of the
 * streamed transcript (tool inputs/outputs, data parts) belongs in
 * `message.parts` and is persisted automatically. Data computed locally by
 * the executor — and needed by a UI on reload — should be emitted into
 * `message.metadata` via a `message-metadata` chunk so the persistence
 * round-trip stays render-identical.
 */
function injectExecutorResultsMetadata(
  source: ReadableStream<ChatMessageChunk | ChatStreamEnvelope>,
  resultsPromise: Promise<GridCopilotExecutionResult | undefined>,
): ReadableStream<ChatMessageChunk | ChatStreamEnvelope> {
  // Bound the wait so a stuck executor never blocks the assistant message
  // from closing. Both branches of `stream.tee()` advance lock-step, so in
  // practice the promise resolves the same microtask the `finish` chunk
  // arrives on the chat side.
  const RESULTS_AWAIT_TIMEOUT_MS = 1000;

  return new ReadableStream<ChatMessageChunk | ChatStreamEnvelope>({
    async start(controller) {
      const reader = source.getReader();
      // Slip the executor-results frame in BEFORE the very first `finish`
      // chunk so it rides on the variant that the executor actually
      // applied to the grid (variant A in A/B mode, the sole response in
      // single mode). Subsequent `finish` chunks (variant B in A/B mode)
      // pass through verbatim — they carry their own `messageMetadata`
      // (modelId/costUsd/elapsedTime) that has to reach `processStream`'s
      // `case 'finish'` to land on the matching message.
      let firstFinishHandled = false;
      try {
        while (true) {
          // eslint-disable-next-line no-await-in-loop
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const chunk = isEnvelope(value) ? value.chunk : value;
          if (chunk.type === 'finish' && !firstFinishHandled) {
            firstFinishHandled = true;
            // Resolve the executor's result for this turn (or time out so
            // a hung executor doesn't block the message from closing).
            // Branches of the teed stream advance lock-step, so by the
            // time we read the chat-branch `finish` the executor branch
            // has already fired `onResults` and resolved the promise.
            // eslint-disable-next-line no-await-in-loop
            const result = await Promise.race([
              resultsPromise,
              new Promise<undefined>((resolve) => {
                setTimeout(() => resolve(undefined), RESULTS_AWAIT_TIMEOUT_MS);
              }),
            ]).catch(() => undefined);

            if (result && (result.applied.length > 0 || result.skipped.length > 0)) {
              const metadataChunk: ChatMessageChunk = {
                type: 'message-metadata',
                metadata: {
                  gridCopilotExecutionResult: result,
                },
              } as unknown as ChatMessageChunk;
              controller.enqueue(metadataChunk);
            }
            controller.enqueue(value);
            continue;
          }
          controller.enqueue(value);
        }
      } catch (err) {
        controller.error(err);
        return;
      } finally {
        reader.releaseLock();
      }

      controller.close();
    },
  });
}

export interface GridCopilotExecutorHandle {
  // The wrapped adapter that should be handed to `<ChatBox>` when present.
  wrappedAdapter: GridCopilotAdapter | undefined;
  // Apply a synchronous envelope (legacy adapter / programmatic / tests).
  applyEnvelope: (envelope: GridCopilotEnvelope) => GridCopilotExecutionResult;
  /**
   * Switch the grid preview to the picked A/B-variant message. When the
   * Copilot panel emits an `ab-pick`, the footer calls this to roll back
   * the previously-applied sibling (via `history.undo`) and replay the
   * picked variant's cached envelope. No-op when the target is already
   * applied or has no cached envelope (e.g. legacy single-response).
   * @param targetMessageId
   */
  switchToVariant: (targetMessageId: string) => GridCopilotExecutionResult | null;
  // The current executor instance — useful for inspection in tests.
  executor: () => Executor;
  // Look up cached executor results for a chat message id (set by the stream consumer).
  getResultsForMessage: (messageId: string) => GridCopilotExecutionResult | undefined;
  // Subscribe to result-cache updates; returns an unsubscribe function.
  subscribeResults: (listener: () => void) => () => void;
  // Live cache of approved `queryGridData` results, keyed by tool-call id.
  // Plugins read from this to resolve `$state` references at render-time.
  queryResults: ReadonlyMap<string, GridDataQueryResult>;
  // Re-execute `queryGridData` tool calls from persisted messages to repopulate
  // the result cache after a localStorage reload. Idempotent; safe to call
  // every time the messages array changes.
  hydrateQueryResultsFromMessages: (messages: readonly ChatMessage[]) => void;
  // Registered plugins for this Copilot instance (in registration order).
  plugins: readonly CopilotPlugin[];
}

const RESULTS_CACHE_CAP = 50;

/**
 * Wraps `props.copilotAdapter` so responses are teed: the chat-bound branch
 * goes through `createApprovalAwareStream` (which auto-executes
 * `queryGridData` tool calls locally, caches the result for plugin
 * renderers, and buffers the trailing `finish` until a single follow-up
 * backend call carries every output back via `metadata.toolResults`); the
 * executor branch routes `setGridState` / `runCommands` tool calls into
 * the grid via `makeExecutor`.
 *
 * `queryGridData` results never leave the browser — only the SHAPE
 * (`meta` + `stateBinding` JSON-pointer) is forwarded to the backend.
 * The full result stays in `queryResultsRef` so plugins (e.g.
 * `composePdfReport`) can resolve `$state` references against the live
 * data at render time.
 *
 * A fresh executor instance is created per `sendMessage` call so per-batch
 * state (buffers, applied slices, deferred commands, dedup `seen` set)
 * resets cleanly between turns.
 */
export function useGridCopilotExecutor(
  apiRef: RefObject<GridPrivateApiPremium>,
  props: DataGridPremiumProcessedProps,
): GridCopilotExecutorHandle {
  const executorRef = React.useRef<Executor | null>(null);
  const resultsByMessageId = React.useRef<Map<string, GridCopilotExecutionResult>>(new Map());
  const subscribers = React.useRef<Set<() => void>>(new Set());
  // Per-message envelope cache for the A/B preview/switch flow. The
  // streaming consumer (`consumeForExecutor`) appends every `setGridState`
  // and `runCommands` body that lands during the turn — variant A's bodies
  // get applied to the grid AND buffered; variant B's bodies are buffered
  // ONLY (the dispatch policy below suppresses them). `switchToVariant`
  // replays a buffered envelope after running `history.undo` to roll back
  // whichever variant is currently applied.
  const envelopesByMessageId = React.useRef<Map<string, GridCopilotEnvelope>>(new Map());
  // Per-message variant snapshot, populated when an AB preamble lands. We
  // key the suppression decision off this map; messages without an entry
  // (single-stream responses) always apply normally.
  const variantByMessageId = React.useRef<Map<string, 'A' | 'B'>>(new Map());
  // Tracks which AB pair's variant is currently applied to the grid. After
  // a user picks B, we revert the previously-applied messageId and apply
  // B's envelope; future picks toggle between siblings via the same path.
  const appliedMessageIdByPair = React.useRef<Map<string, string>>(new Map());
  const messagePairByMessageId = React.useRef<Map<string, string>>(new Map());
  // Shared across every executor instance so the auto-reorder logic can
  // restore a previously-aggregated column to its original index even when a
  // new executor was created for the turn that removes the aggregation.
  const displacedAggregationOrigins = React.useRef<Map<string, number>>(new Map());
  // Approved `queryGridData` results survive across turns within a conversation
  // so plugin handlers (e.g. PDF report renderers) can resolve `$state`
  // references the model emits in a later turn.
  const queryResultsRef = React.useRef<Map<string, GridDataQueryResult>>(new Map());
  const plugins = React.useMemo<readonly CopilotPlugin[]>(
    () => props.copilotPlugins ?? [],
    [props.copilotPlugins],
  );

  const onResults = React.useCallback((messageId: string, results: GridCopilotExecutionResult) => {
    const map = resultsByMessageId.current;
    map.set(messageId, results);
    while (map.size > RESULTS_CACHE_CAP) {
      const firstKey = map.keys().next().value;
      if (firstKey === undefined) {
        break;
      }
      map.delete(firstKey);
    }
    subscribers.current.forEach((listener) => {
      try {
        listener();
      } catch {
        // Swallow listener errors; one bad subscriber shouldn't stop notification.
      }
    });
  }, []);

  const getResultsForMessage = React.useCallback(
    (messageId: string) => resultsByMessageId.current.get(messageId),
    [],
  );

  const subscribeResults = React.useCallback((listener: () => void) => {
    subscribers.current.add(listener);
    return () => {
      subscribers.current.delete(listener);
    };
  }, []);

  const getExecutor = React.useCallback((): Executor => {
    if (!executorRef.current) {
      executorRef.current = makeExecutor({
        apiRef,
        props,
        displacedAggregationOrigins: displacedAggregationOrigins.current,
      });
    }
    return executorRef.current;
  }, [apiRef, props]);

  // Replay `queryGridData` inputs from persisted messages so PDF / formula
  // cards on a re-hydrated conversation can still resolve `$state` paths.
  // Idempotent — skips entries already in `queryResultsRef`. Per-call
  // failures are swallowed (the live grid may have diverged from the
  // snapshot; Regenerate's "render against current state" semantics still
  // apply).
  const hydrateQueryResultsFromMessages = React.useCallback(
    (messages: readonly ChatMessage[]) => {
      for (const message of messages) {
        const parts = (message as unknown as { parts?: unknown }).parts;
        if (!Array.isArray(parts)) {
          continue;
        }
        for (const part of parts) {
          const p = part as { type?: string; toolInvocation?: unknown };
          if (p.type !== 'tool') {
            continue;
          }
          const invocation = p.toolInvocation as
            | { toolName?: string; state?: string; toolCallId?: string; input?: unknown }
            | undefined;
          if (
            !invocation ||
            invocation.toolName !== QUERY_TOOL_NAME ||
            invocation.state !== 'output-available' ||
            typeof invocation.toolCallId !== 'string'
          ) {
            continue;
          }
          if (queryResultsRef.current.has(invocation.toolCallId)) {
            continue;
          }
          const input = invocation.input as GridDataQueryInput | undefined;
          if (!input || typeof input !== 'object' || typeof input.mode !== 'string') {
            continue;
          }
          try {
            const result = executeGridDataQuery(input, apiRef);
            queryResultsRef.current.set(invocation.toolCallId, result);
          } catch {
            // Grid may have changed since the snapshot; skip.
          }
        }
      }
    },
    [apiRef],
  );

  const wrappedAdapter = React.useMemo<GridCopilotAdapter | undefined>(() => {
    if (!props.copilot || !props.copilotAdapter) {
      return undefined;
    }
    const inner: ChatAdapter = props.copilotAdapter;

    return {
      ...inner,
      sendMessage: async (input) => {
        // Annotate every outgoing turn with the registered plugin ids so the
        // backend can conditionally expose matching server-side tools.
        const pluginIds = plugins.map((plugin) => plugin.id);
        const enrichedInput =
          pluginIds.length > 0
            ? {
                ...input,
                metadata: { ...(input.metadata ?? {}), copilotPlugins: pluginIds },
              }
            : input;
        const stream = await inner.sendMessage(enrichedInput);
        const [forChatBox, forExecutor] = stream.tee();
        const executor = makeExecutor({
          apiRef,
          props,
          displacedAggregationOrigins: displacedAggregationOrigins.current,
        });
        executorRef.current = executor;

        // Unblocks `injectExecutorResultsMetadata` so the persisted message
        // carries the executor's locally-computed entries.
        let resolveResults: (result: GridCopilotExecutionResult | undefined) => void = () => {};
        const resultsPromise = new Promise<GridCopilotExecutionResult | undefined>((resolve) => {
          resolveResults = resolve;
        });

        // Fire-and-forget. Errors land in the executor's `skipped[]`.
        void consumeForExecutor(forExecutor, {
          executor,
          onResults: (messageId, result) => {
            onResults(messageId, result);
            resolveResults(result);
          },
          // A/B-preview suppression: buffer every body keyed by messageId
          // so a later `switchToVariant` can re-apply it cleanly. Variant
          // B's bodies skip dispatch (preview shows variant A); single-
          // stream messages have no variant entry → apply normally.
          onAssembledBody: (messageId, toolName, body) => {
            const field = toolName === 'setGridState' ? 'setGridState' : 'runCommands';
            const existing = envelopesByMessageId.current.get(messageId) ?? {};
            const accumulated = existing[field] ?? '';
            // The body is already a JSONL block (possibly multi-line);
            // join successive tool calls with a newline so they replay as
            // one envelope.
            const next = accumulated ? `${accumulated}\n${body}` : body;
            envelopesByMessageId.current.set(messageId, {
              ...existing,
              [field]: next,
            } satisfies GridCopilotEnvelope);
          },
          shouldApply: (messageId) => {
            if (!messageId) {
              return true;
            }
            const variant = variantByMessageId.current.get(messageId);
            // Apply by default; suppress only when we know this message is
            // the un-previewed sibling (variant B in an AB pair).
            if (variant !== 'B') {
              if (variant === 'A') {
                const pairId = messagePairByMessageId.current.get(messageId);
                if (pairId) {
                  appliedMessageIdByPair.current.set(pairId, messageId);
                }
              }
              return true;
            }
            return false;
          },
          onMessageMetadata: (messageId, meta) => {
            if (meta.abVariant) {
              variantByMessageId.current.set(messageId, meta.abVariant);
            }
            if (meta.abPairId) {
              messagePairByMessageId.current.set(messageId, meta.abPairId);
            }
          },
        }).finally(() => resolveResults(undefined));

        const approvalAware = createApprovalAwareStream(forChatBox, {
          conversationId: input.conversationId,
          messagesAtCall: input.messages,
          plugins,
          apiRef,
          inner,
          queryResultsRef,
        });
        return injectExecutorResultsMetadata(approvalAware, resultsPromise);
      },
      // Delegate to inner for forward compatibility (chat-headless tool
      // approvals from non-queryGridData sources). queryGridData itself is
      // auto-executed inside `createApprovalAwareStream`, so we never see
      // its approval responses here.
      addToolApprovalResponse: async (
        approvalInput: ChatAddToolApproveResponseInput,
      ): Promise<void> => {
        if (typeof inner.addToolApprovalResponse === 'function') {
          await inner.addToolApprovalResponse(approvalInput);
        }
      },
    };
  }, [apiRef, props, onResults, plugins]);

  const applyEnvelope = React.useCallback(
    (envelope: GridCopilotEnvelope): GridCopilotExecutionResult => {
      // Fresh executor per envelope.
      const executor = makeExecutor({
        apiRef,
        props,
        displacedAggregationOrigins: displacedAggregationOrigins.current,
      });
      executorRef.current = executor;
      return executor.applyEnvelope(envelope);
    },
    [apiRef, props],
  );

  // Swap which sibling of an A/B pair is applied to the grid. The flow:
  //   1. If a different message in the same pair is currently applied,
  //      run `history.undo` to revert its slice.
  //   2. Apply the target message's cached envelope (built during the
  //      original stream by the `onAssembledBody` hook above).
  //   3. Record the new applied messageId on the pair.
  // No-op when called on a message we already preview (the previewed
  // variant is variant A by default) or on a message without an envelope.
  const switchToVariant = React.useCallback(
    (targetMessageId: string): GridCopilotExecutionResult | null => {
      const pairId = messagePairByMessageId.current.get(targetMessageId);
      const currentApplied = pairId ? appliedMessageIdByPair.current.get(pairId) : undefined;
      if (currentApplied === targetMessageId) {
        return null;
      }
      const envelope = envelopesByMessageId.current.get(targetMessageId);
      if (!envelope) {
        return null;
      }

      // Step 1 — revert the currently-applied variant's slice.
      if (currentApplied) {
        const undoExecutor = makeExecutor({
          apiRef,
          props,
          displacedAggregationOrigins: displacedAggregationOrigins.current,
        });
        executorRef.current = undoExecutor;
        undoExecutor.applyEnvelope({
          runCommands: `${JSON.stringify({ type: 'history.undo' })}\n`,
        });
      }

      // Step 2 — apply the picked variant's buffered envelope.
      const applyExecutor = makeExecutor({
        apiRef,
        props,
        displacedAggregationOrigins: displacedAggregationOrigins.current,
      });
      executorRef.current = applyExecutor;
      const result = applyExecutor.applyEnvelope(envelope);

      if (pairId) {
        appliedMessageIdByPair.current.set(pairId, targetMessageId);
      }
      // Update the result cache + notify subscribers so chips / metadata
      // panels reflect the new applied slice.
      onResults(targetMessageId, result);
      return result;
    },
    [apiRef, props, onResults],
  );

  return {
    wrappedAdapter,
    applyEnvelope,
    switchToVariant,
    executor: getExecutor,
    getResultsForMessage,
    subscribeResults,
    queryResults: queryResultsRef.current,
    hydrateQueryResultsFromMessages,
    plugins,
  };
}
