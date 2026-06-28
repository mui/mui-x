import type {
  ChatAdapter,
  ChatMessageChunk,
  ChatSendMessageInput,
  ChatStreamEnvelope,
} from '@mui/x-chat-headless';
import type { HostAdapter } from '../executor/hostAdapter';
import type { CommandPack, PatchPack } from '../executor/handlers';
import type { CopilotExecutionResult, Guards } from '../executor/types';
import { buildCommandRegistry } from '../executor/commandRegistry';
import { buildPatchRegistry } from '../executor/patchRegistry';
import { makeExecutor, type Executor } from '../executor/createExecutor';
import type { CopilotPlugin } from '../plugins/core';
import { consumeForExecutor } from '../streams/consumeForExecutor';
import type { ToolName } from '../streams/types';
import { teeStream } from '../streams/teeStream';
import type { CopilotAdapter } from './types';

export interface CreateCopilotAdapterOptions<
  TAdapter extends HostAdapter,
  TState = unknown,
  TQueryResult = unknown,
> {
  /** The underlying chat adapter (a chat-headless ChatAdapter, AI-SDK adapter, etc.). */
  inner: ChatAdapter;

  /** The host adapter satisfying x-copilot's HostAdapter contract. */
  host: TAdapter;

  /** Active guards map. */
  guards: Guards;

  /** Command packs to register with the executor. */
  commandPacks: ReadonlyArray<CommandPack<TAdapter, TState>>;

  /** Patch packs to register with the executor. */
  patchPacks: ReadonlyArray<PatchPack<TAdapter, TState>>;

  /** Plugins registered by the host. */
  plugins?: ReadonlyArray<CopilotPlugin<unknown, TQueryResult>>;

  /** Optional input enricher (e.g. add column context to metadata). */
  enrichInput?(input: ChatSendMessageInput): ChatSendMessageInput;

  /** Optional sink for executor results — host caches via this. */
  onExecutionResult?(messageId: string, result: CopilotExecutionResult): void;

  /**
   * Typed, externally-injected cache for results of auto-executed data-query
   * tool calls. The host owns the cache so plugin render context can read
   * from the same Map and so it survives across executor instances.
   */
  dataQueryResultsCache?: Map<string, TQueryResult>;

  /** Configurable stream knobs. */
  streamOptions?: {
    executionResultMetadataKey?: string;
    stateBindingTemplate?: (toolCallId: string) => string;
    followUpCap?: number;
    followUpToolNames?: readonly string[];
  };

  /**
   * Initial carry state. Passed back into adapter hooks; persists across
   * executor instances.
   */
  initialCarryState?: unknown;

  /**
   * Maps host LLM-facing tool names to the canonical executor wire names
   * (`setGridState` / `runCommands`). Forwarded to `consumeForExecutor` so a host
   * can rename its tools (e.g. charts' `updateChart`) without changing the shared
   * executor. Unmapped names pass through, so Grid / Studio are unaffected.
   */
  toolNameAliases?: Readonly<Record<string, ToolName>>;
}

/**
 * Wrap an inner `ChatAdapter` into one that drives a generic copilot
 * executor + plugins. Returns a `ChatAdapter`-shaped object the chat UI
 * can consume without knowing about the executor.
 *
 * Today's behavior: tee the response stream and consume one branch with the
 * executor. The chat branch passes through unchanged (host can layer
 * approval-aware orchestration / plugin dispatch on top with separate helpers
 * once those are extracted).
 */
export function createCopilotAdapter<
  TAdapter extends HostAdapter,
  TState = unknown,
  TQueryResult = unknown,
>(options: CreateCopilotAdapterOptions<TAdapter, TState, TQueryResult>): CopilotAdapter {
  const {
    inner,
    host,
    guards,
    commandPacks,
    patchPacks,
    enrichInput,
    onExecutionResult,
    initialCarryState,
    toolNameAliases,
  } = options;

  if (initialCarryState !== undefined && host.setCarryState) {
    host.setCarryState(initialCarryState);
  }

  const commandRegistry = buildCommandRegistry<TAdapter, TState>(guards, commandPacks);
  const patchRegistry = buildPatchRegistry<TAdapter, TState>(guards, patchPacks);

  // Build a fresh executor per turn so streamed state doesn't leak across
  // sendMessage calls. Carry state persists across instances via the adapter.
  function makeTurnExecutor(): Executor {
    return makeExecutor<TAdapter, TState>({
      adapter: host,
      guards,
      commandRegistry,
      patchRegistry,
    });
  }

  return {
    ...inner,
    async sendMessage(
      rawInput: ChatSendMessageInput,
    ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope>> {
      const input = enrichInput ? enrichInput(rawInput) : rawInput;
      const responseStream = await inner.sendMessage(input);

      const [forChat, forExecutor] = teeStream<ChatMessageChunk | ChatStreamEnvelope>(
        responseStream,
      );

      const executor = makeTurnExecutor();

      // Fire-and-forget: consume the executor branch while the chat layer
      // reads the other branch. Errors in the executor branch are swallowed
      // — they shouldn't affect the chat UI.
      consumeForExecutor(forExecutor, {
        executor,
        onResults: onExecutionResult,
        toolNameAliases,
      }).catch(() => {
        // ignore
      });

      return forChat;
    },
  };
}
