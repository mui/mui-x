import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import type { GridCopilotEnvelope, GridCopilotExecutionResult } from './executor';
import type { GridDataQueryResult } from './executor/queryGridData';

/**
 * Adapter (a.k.a. "model") used by the Copilot side panel.
 *
 * Extends the `@mui/x-chat-headless` `ChatAdapter` so a single object can supply
 * conversations (`listConversations`), messages (`listMessages`, `sendMessage`),
 * history pagination (`loadMore`), and any future grid-aware behaviour.
 */
export interface GridCopilotAdapter extends ChatAdapter {}

/**
 * The Copilot API exposed on `apiRef.current`.
 */
export interface GridCopilotApi {
  copilot: {
    /**
     * Opens the Copilot side panel.
     */
    open: () => void;
    /**
     * Closes the Copilot side panel (if it's the one currently shown).
     */
    close: () => void;
    /**
     * Returns the adapter the Copilot panel should hand to `<ChatBox>`. When a
     * `copilotAdapter` is configured, this is a wrapper that tees the response
     * stream so tool-call events apply to the grid via the executor.
     * @returns {GridCopilotAdapter | undefined} The wrapped adapter, or `undefined` when none is configured.
     */
    getAdapter: () => GridCopilotAdapter | undefined;
    /**
     * Apply a `setGridState` + `runCommands` JSONL envelope synchronously.
     * Useful for programmatic application (legacy adapter, tests, replay).
     * @param {GridCopilotEnvelope} envelope The JSONL envelope to apply.
     * @returns {GridCopilotExecutionResult} Per-line applied + skipped report.
     */
    applyEnvelope: (envelope: GridCopilotEnvelope) => GridCopilotExecutionResult;
    /**
     * Swap the grid preview to the picked A/B-variant message. Reverts
     * the currently-applied sibling via `history.undo` and replays the
     * target's cached envelope (captured during the original stream).
     * No-op when the target is already applied or has no cached envelope
     * (e.g. a single-response message). Returns the executor result for
     * the replayed envelope, or `null` if nothing was applied.
     * @param {string} targetMessageId The message id to switch to.
     * @returns {GridCopilotExecutionResult | null} The replayed executor results.
     */
    switchToVariant: (targetMessageId: string) => GridCopilotExecutionResult | null;
    /**
     * Look up the cached executor results for a chat message id, populated by the
     * stream consumer when an assistant message finishes.
     * @param {string} messageId The chat message id.
     * @returns {GridCopilotExecutionResult | undefined} The cached results, or `undefined` if unknown.
     */
    getResultsForMessage: (messageId: string) => GridCopilotExecutionResult | undefined;
    /**
     * Subscribe to result-cache updates. The listener is invoked after every
     * stream finish.
     * @param {() => void} listener The change listener.
     * @returns {() => void} An unsubscribe function.
     */
    subscribeResults: (listener: () => void) => () => void;
    /**
     * Live (cross-turn) map of approved `queryGridData` results, keyed by the
     * original tool-call id. Plugin renderers read this to resolve `$state`
     * references at render-time.
     * @returns {ReadonlyMap<string, GridDataQueryResult>} The query result cache.
     */
    getQueryResults: () => ReadonlyMap<string, GridDataQueryResult>;
    /**
     * Re-execute any `queryGridData` tool calls found in the persisted message
     * list against the live grid and repopulate the in-memory `queryResults`
     * cache. Used after a localStorage reload so PDF/Regenerate keeps working
     * — the spec lives in `message.parts` but the cached VALUES are not
     * persisted, so on hydration we replay the inputs to rebuild them.
     *
     * Idempotent: skips tool calls whose result is already in the cache.
     * Best-effort: per-call failures are swallowed (the live grid may have
     * changed since the snapshot, in which case Regenerate's "render against
     * current state" semantics still apply).
     * @param messages
     */
    hydrateQueryResultsFromMessages: (messages: readonly ChatMessage[]) => void;
  };
}
