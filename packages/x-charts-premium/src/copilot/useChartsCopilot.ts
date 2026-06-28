'use client';
import * as React from 'react';
import type { ChatAdapter } from '@mui/x-chat-headless';
import type { Guards } from '@mui/x-copilot';
import { useCopilot, type UseCopilotReturn } from '@mui/x-copilot/hooks';
import type { ChartCopilotState } from './chartState';
import type { ChartFocusState } from './chartFocusState';
import type { ChartCopilotDataset } from './resolveForRenderer';
import { buildChartGuards, type DEFAULT_CHART_GUARDS } from './guards';
import { createChartsHostAdapter, type ChartsHostAdapter } from './chartsHostAdapter';
import { chartsCommandPack, chartsReconcilerPack } from './chartsPacks';

// Charts presents its patch tool to the model + chat UI as `updateChart` (so
// "grid" never appears in the chart context); the executor still dispatches it
// through the shared `setGridState` wire name.
const CHARTS_TOOL_NAME_ALIASES = { updateChart: 'setGridState' } as const;

export interface UseChartsCopilotOptions {
  /** Underlying chat adapter wrapping a backend chat adapter (AI SDK, custom, etc.). */
  inner: ChatAdapter;
  /** Live accessor for the current chart state document. */
  getChartState(): ChartCopilotState;
  /** Commit a new chart state document. */
  setChartState(state: ChartCopilotState): void;
  /** Live accessor for the dataset the chart resolves against. */
  getDataset(): ChartCopilotDataset;
  /** Live accessor for the ephemeral Focus view state. */
  getFocus(): ChartFocusState;
  /** Commit a new Focus view state. */
  setFocus(focus: ChartFocusState): void;
  /** Optional override for the default guards. */
  features?: Partial<Record<keyof typeof DEFAULT_CHART_GUARDS, boolean>>;
}

export interface UseChartsCopilotReturn extends UseCopilotReturn {
  /** The constructed Charts host adapter — useful for diagnostics. */
  host: ChartsHostAdapter;
}

/**
 * Thin Charts-flavored wrapper around `useCopilot`. Builds the Charts host
 * adapter and command/patch packs, then forwards everything into the generic
 * hook. Patch-only for v1 — no plugins, approval, or multi-step follow-up.
 */
export function useChartsCopilot(options: UseChartsCopilotOptions): UseChartsCopilotReturn {
  const { inner, getChartState, setChartState, getDataset, getFocus, setFocus, features } = options;

  const guards = React.useMemo<Guards>(() => buildChartGuards(features), [features]);

  // Capture the getters/setter via refs so the host adapter identity stays
  // stable across renders. The adapter reads .current via the getter functions
  // every time a handler runs or a snapshot is taken.
  const getChartStateRef = React.useRef(getChartState);
  getChartStateRef.current = getChartState;
  const setChartStateRef = React.useRef(setChartState);
  setChartStateRef.current = setChartState;
  const getDatasetRef = React.useRef(getDataset);
  getDatasetRef.current = getDataset;
  const getFocusRef = React.useRef(getFocus);
  getFocusRef.current = getFocus;
  const setFocusRef = React.useRef(setFocus);
  setFocusRef.current = setFocus;

  const host = React.useMemo<ChartsHostAdapter>(
    () =>
      createChartsHostAdapter({
        getState: () => getChartStateRef.current(),
        setState: (next) => setChartStateRef.current(next),
        getDataset: () => getDatasetRef.current(),
        getFocus: () => getFocusRef.current(),
        setFocus: (next) => setFocusRef.current(next),
      }),
    [],
  );

  const commandPacks = React.useMemo(() => [chartsCommandPack], []);
  const patchPacks = React.useMemo(() => [chartsReconcilerPack], []);

  const result = useCopilot<ChartsHostAdapter, ChartCopilotState>({
    inner,
    host,
    guards,
    commandPacks,
    patchPacks,
    // The charts copilot exposes its patch tool to the model + chat UI as
    // `updateChart` (so "grid" never appears in the chart context); it dispatches
    // through the shared `setGridState` executor path.
    toolNameAliases: CHARTS_TOOL_NAME_ALIASES,
  });

  return { ...result, host };
}
