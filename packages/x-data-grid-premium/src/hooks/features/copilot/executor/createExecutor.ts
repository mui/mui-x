import type { RefObject } from '@mui/x-internals/types';
import { makeExecutor as makeXCopilotExecutor , buildCommandRegistry, buildPatchRegistry } from '@mui/x-copilot';
import type { GridPrivateApiPremium } from '../../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../../models/dataGridPremiumProps';
import type { GridCopilotEnvelope, GridCopilotExecutionResult } from './types';
import { buildGuards } from './guards';
import { createGridHostAdapter } from '../gridHostAdapter';
import { gridCommandPack, gridReconcilerPack } from '../gridPacks';

export type ToolName = 'setGridState' | 'runCommands';

export interface ExecutorOptions {
  apiRef: RefObject<GridPrivateApiPremium>;
  props: DataGridPremiumProcessedProps;
  /**
   * Optional progress callback invoked after every dispatched line.
   * @param result
   */
  onProgress?: (result: GridCopilotExecutionResult) => void;
  /**
   * Optional shared map for tracking the original column index of fields
   * displaced into the aggregation slot. Pass a stable instance across
   * executor lifetimes (e.g. from a parent hook) so restore-on-unaggregate
   * works across turns; defaults to a fresh map if omitted.
   */
  displacedAggregationOrigins?: Map<string, number>;
}

export interface Executor {
  readonly results: GridCopilotExecutionResult;
  pushChunk(toolIndex: number, toolName: ToolName, chunk: string): void;
  onToolStop(toolIndex: number, toolName: ToolName): void;
  onAllToolsStop(): void;
  /** Synchronous entry point for the legacy adapter and tests. */
  applyEnvelope(envelope: GridCopilotEnvelope): GridCopilotExecutionResult;
  /** Reset all per-batch state. */
  reset(): void;
}

/**
 * Grid Copilot executor. Thin wrapper that delegates to the generic
 * `@mui/x-copilot` executor with the Grid's host adapter and packs.
 *
 * - Auto-pivot activation / pinned-column reorder / aggregation displacement
 *   live in `gridHostAdapter`'s `onPatchToolStop` and `onAllToolsStop` hooks.
 * - The 9 command files and 18 reconciler files in `executor/{commands,reconcilers}/`
 *   are unchanged. They're aggregated into packs by `gridPacks.ts` which adapts
 *   their context shape to x-copilot's at the bridge.
 */
export function makeExecutor(options: ExecutorOptions): Executor {
  const { apiRef, props, onProgress, displacedAggregationOrigins } = options;

  const guards = buildGuards(props);
  const host = createGridHostAdapter({
    apiRef,
    props,
    guards,
    displacedAggregationOrigins,
  });
  const commandRegistry = buildCommandRegistry(guards, [gridCommandPack]);
  const patchRegistry = buildPatchRegistry(guards, [gridReconcilerPack]);

  const inner = makeXCopilotExecutor({
    adapter: host,
    guards,
    commandRegistry,
    patchRegistry,
    onProgress: onProgress as ((result: any) => void) | undefined,
  });

  // x-copilot's CopilotExecutionResult is structurally identical to
  // GridCopilotExecutionResult (`{applied, skipped}`). We expose the same
  // reference so existing callers don't need to switch types.
  return inner as unknown as Executor;
}
