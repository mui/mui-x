'use client';
import * as React from 'react';
import type { UseChartsCopilotReturn } from '../useChartsCopilot';
import type { ChartCopilotHistory } from '../history';

export interface ChartsCopilotControls {
  /** Whether the Copilot panel is currently open. */
  open: boolean;
  /** Opens or closes the Copilot panel. */
  setOpen(open: boolean): void;
  /** Whether the Copilot integration is mounted and usable. */
  available: boolean;
  /** The `useChartsCopilot` return value, or `null` when unavailable. */
  copilot: UseChartsCopilotReturn | null;
  /** The undoable step history (receipts + undo/reset), or `null` when unavailable. */
  history: ChartCopilotHistory | null;
}

const DEFAULT: ChartsCopilotControls = {
  open: false,
  setOpen: () => {},
  available: false,
  copilot: null,
  history: null,
};

const ChartsCopilotContext = React.createContext<ChartsCopilotControls>(DEFAULT);

export interface ChartsCopilotProviderProps {
  open: boolean;
  setOpen(open: boolean): void;
  available: boolean;
  copilot?: UseChartsCopilotReturn | null;
  history?: ChartCopilotHistory | null;
  children: React.ReactNode;
}

/**
 * Provides the Copilot open/close controls, the `useChartsCopilot` return value,
 * and the undoable step history to descendants (the panel, the toolbar trigger,
 * the receipt card, and the step-history panel).
 */
export function ChartsCopilotProvider(props: ChartsCopilotProviderProps) {
  const { open, setOpen, available, copilot = null, history = null, children } = props;
  const value = React.useMemo<ChartsCopilotControls>(
    () => ({ open, setOpen, available, copilot, history }),
    [open, setOpen, available, copilot, history],
  );
  return <ChartsCopilotContext.Provider value={value}>{children}</ChartsCopilotContext.Provider>;
}

/** Reads the Charts Copilot controls from context. */
export function useChartsCopilotControls(): ChartsCopilotControls {
  return React.useContext(ChartsCopilotContext);
}
