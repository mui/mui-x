import type { CommandHandler, CommandPack, PatchPack } from '@mui/x-copilot';
import { ALL_CHART_PATCH_HANDLERS } from './reconcilers';
import { chartFocusCommands } from './commands/focus';
import type { ChartsHostAdapter } from './chartsHostAdapter';
import type { ChartCopilotState } from './chartState';

/**
 * Charts Copilot command handlers. The `focus.*` commands drive the ephemeral
 * Focus view state (zoom + highlight) — see `commands/focus.ts`.
 */
export const ALL_CHART_COMMAND_HANDLERS: ReadonlyArray<
  CommandHandler<ChartsHostAdapter, ChartCopilotState>
> = [...chartFocusCommands];

/**
 * The Charts Copilot reconciler pack. Aggregates every `PatchHandler` in
 * `reconcilers/*.ts`.
 */
export const chartsReconcilerPack: PatchPack<ChartsHostAdapter, ChartCopilotState> = {
  id: 'charts-premium',
  handlers: ALL_CHART_PATCH_HANDLERS,
};

/**
 * The Charts Copilot command pack. Commands are deferred to M3/M4, so this
 * pack currently has no handlers.
 */
export const chartsCommandPack: CommandPack<ChartsHostAdapter, ChartCopilotState> = {
  id: 'charts-premium',
  handlers: ALL_CHART_COMMAND_HANDLERS,
};
