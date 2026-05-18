import type { ChatAdapter } from '@mui/x-chat-headless';
import type { GridCopilotEnvelope, GridCopilotExecutionResult } from './executor';

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
  };
}
