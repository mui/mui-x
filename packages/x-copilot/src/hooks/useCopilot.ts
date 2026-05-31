'use client';
import * as React from 'react';
import type { ChatAdapter, ChatMessage, ChatSendMessageInput } from '@mui/x-chat-headless';
import type { HostAdapter } from '../executor/hostAdapter';
import type { CommandPack, PatchPack } from '../executor/handlers';
import type { CopilotEnvelope, CopilotExecutionResult, Guards } from '../executor/types';
import { buildCommandRegistry } from '../executor/commandRegistry';
import { buildPatchRegistry } from '../executor/patchRegistry';
import { makeExecutor } from '../executor/createExecutor';
import { createCopilotAdapter } from '../adapter/createCopilotAdapter';
import type { ToolName } from '../streams/types';
import type { CopilotAdapter } from '../adapter/types';
import type { CopilotPlugin } from '../plugins/core';

export interface UseCopilotOptions<
  TAdapter extends HostAdapter,
  TState = unknown,
  TQueryResult = unknown,
> {
  /** Underlying chat adapter (e.g. localStorage, AI SDK, in-memory). */
  inner: ChatAdapter;

  /** Host adapter implementing the HostAdapter contract. */
  host: TAdapter;

  /** Guard flags. */
  guards: Guards;

  /** Command packs. */
  commandPacks: ReadonlyArray<CommandPack<TAdapter, TState>>;

  /** Patch packs. */
  patchPacks: ReadonlyArray<PatchPack<TAdapter, TState>>;

  /** Optional plugins (their toolNames are matched on the chat branch). */
  plugins?: ReadonlyArray<CopilotPlugin<unknown, TQueryResult>>;

  /** Optional metadata enrichment. */
  enrichInput?(input: ChatSendMessageInput): ChatSendMessageInput;

  /** Optional initial carry state. */
  initialCarryState?: unknown;

  /**
   * Maps host LLM-facing tool names to the canonical executor wire names
   * (`setGridState` / `runCommands`). Lets a host expose a domain-specific tool
   * name to the model + chat UI (e.g. charts' `updateChart`) while the executor
   * dispatches it through the shared path. Unmapped names pass through.
   */
  toolNameAliases?: Readonly<Record<string, ToolName>>;
}

export interface UseCopilotReturn<TQueryResult = unknown> {
  adapter: CopilotAdapter;
  /** Synchronous — apply an envelope outside the streaming path. */
  applyEnvelope(envelope: CopilotEnvelope): CopilotExecutionResult;
  /** Latest result for a given assistant message. */
  getResultsForMessage(messageId: string): CopilotExecutionResult | undefined;
  /** Subscribe to result updates for any message. Returns unsubscribe. */
  subscribeResults(listener: (messageId: string) => void): () => void;
  /** Query-result cache (typically populated by approval-aware stream). */
  getQueryResults(): ReadonlyMap<string, TQueryResult>;
  /** Replay results from persisted messages on conversation reload. */
  hydrateQueryResultsFromMessages(messages: ReadonlyArray<ChatMessage>): void;
  /** Re-apply a sibling A/B variant for a given message. Returns null if no variants. */
  switchToVariant(messageId: string): CopilotExecutionResult | null;
}

/**
 * Generic copilot hook. Wraps an inner ChatAdapter so that:
 *   - executor mutations land on the host via the registries + lifecycle hooks
 *   - applyEnvelope is exposed as a sync entry point
 *   - per-message results are cached and subscribable
 *
 * Plugin dispatch and approval-aware stream are NOT yet wired into the
 * generic adapter — hosts that need them currently provide their own wrappers
 * around `inner` before passing it in. (See follow-up streams work.)
 */
export function useCopilot<TAdapter extends HostAdapter, TState = unknown, TQueryResult = unknown>(
  options: UseCopilotOptions<TAdapter, TState, TQueryResult>,
): UseCopilotReturn<TQueryResult> {
  const {
    inner,
    host,
    guards,
    commandPacks,
    patchPacks,
    enrichInput,
    initialCarryState,
    toolNameAliases,
  } = options;

  // Per-message results cache + listeners.
  const resultsByMessageId = React.useRef(new Map<string, CopilotExecutionResult>());
  const listenersRef = React.useRef(new Set<(messageId: string) => void>());
  const queryResultsRef = React.useRef(new Map<string, TQueryResult>());
  // Envelope cache so switchToVariant can replay raw bodies later.
  const envelopesByMessageId = React.useRef(
    new Map<string, { setGridState?: string; runCommands?: string }>(),
  );

  // Stable registries — rebuild only when guards / packs identity changes.
  const commandRegistry = React.useMemo(
    () => buildCommandRegistry<TAdapter, TState>(guards, commandPacks),
    [guards, commandPacks],
  );
  const patchRegistry = React.useMemo(
    () => buildPatchRegistry<TAdapter, TState>(guards, patchPacks),
    [guards, patchPacks],
  );

  const adapter = React.useMemo<CopilotAdapter>(() => {
    return createCopilotAdapter<TAdapter, TState, TQueryResult>({
      inner,
      host,
      guards,
      commandPacks,
      patchPacks,
      enrichInput,
      onExecutionResult: (messageId, result) => {
        resultsByMessageId.current.set(messageId, result);
        listenersRef.current.forEach((listener) => listener(messageId));
      },
      dataQueryResultsCache: queryResultsRef.current,
      initialCarryState,
      toolNameAliases,
    });
  }, [
    inner,
    host,
    guards,
    commandPacks,
    patchPacks,
    enrichInput,
    initialCarryState,
    toolNameAliases,
  ]);

  const applyEnvelope = React.useCallback(
    (envelope: CopilotEnvelope): CopilotExecutionResult => {
      const executor = makeExecutor<TAdapter, TState>({
        adapter: host,
        guards,
        commandRegistry,
        patchRegistry,
      });
      const result = executor.applyEnvelope(envelope);
      return result;
    },
    [host, guards, commandRegistry, patchRegistry],
  );

  const getResultsForMessage = React.useCallback(
    (messageId: string) => resultsByMessageId.current.get(messageId),
    [],
  );

  const subscribeResults = React.useCallback((listener: (messageId: string) => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const getQueryResults = React.useCallback(
    () => queryResultsRef.current as ReadonlyMap<string, TQueryResult>,
    [],
  );

  const hydrateQueryResultsFromMessages = React.useCallback(
    (_messages: ReadonlyArray<ChatMessage>) => {
      // Default no-op; hosts that supply a data-query provider wire their
      // own hydrateFromMessage here. Kept on the public surface so
      // call sites are stable when this gets fleshed out.
    },
    [],
  );

  const switchToVariant = React.useCallback(
    (messageId: string): CopilotExecutionResult | null => {
      const envelope = envelopesByMessageId.current.get(messageId);
      if (!envelope) {
        return null;
      }
      return applyEnvelope(envelope);
    },
    [applyEnvelope],
  );

  return {
    adapter,
    applyEnvelope,
    getResultsForMessage,
    subscribeResults,
    getQueryResults,
    hydrateQueryResultsFromMessages,
    switchToVariant,
  };
}
