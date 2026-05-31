'use client';
import * as React from 'react';
import type { ChartCopilotState } from '../chartState';
import type { ChartCopilotDatasetColumn } from '../resolveForRenderer';
import {
  buildStep,
  isRecordable,
  resetSteps,
  undoSteps,
  type BuildStepInput,
} from './historyCore';
import type { HistoryStep } from './types';

export interface RecordTurnInput
  extends Omit<BuildStepInput, 'seq'> {}

export interface ChartCopilotHistory {
  /** Recorded steps in chronological order. */
  steps: HistoryStep[];
  /** Records a turn; returns the new step, or `null` when nothing changed. */
  record(input: RecordTurnInput): HistoryStep | null;
  /** Undoes to a step (default: latest), restoring its `before` spec. */
  undo(stepId?: string): void;
  /** Resets the chart to the original pre-history spec. */
  reset(): void;
  /** Looks up the step produced by a given assistant message. */
  getStepByMessageId(messageId: string): HistoryStep | undefined;
  /** Whether there is anything to undo/reset. */
  canUndo: boolean;
}

/**
 * Owns the undoable step history for the Charts Copilot. Each recorded turn is
 * one step (the before/after spec + receipt clauses); `undo`/`reset` restore a
 * prior spec via `applyState`. The pure logic lives in `historyCore`.
 *
 * @param applyState Commits a restored spec back to the controller (used by
 *   undo/reset).
 * @param columns Dataset columns, used to label fields in receipt clauses.
 */
export function useChartCopilotHistory(
  applyState: (state: ChartCopilotState) => void,
  columns?: Pick<ChartCopilotDatasetColumn, 'field' | 'headerName'>[],
): ChartCopilotHistory {
  const [steps, setSteps] = React.useState<HistoryStep[]>([]);
  const stepsRef = React.useRef(steps);
  stepsRef.current = steps;
  const seqRef = React.useRef(0);

  const applyRef = React.useRef(applyState);
  applyRef.current = applyState;
  const columnsRef = React.useRef(columns);
  columnsRef.current = columns;

  const record = React.useCallback((input: RecordTurnInput): HistoryStep | null => {
    if (!isRecordable(input.before, input.after, input.hadPatches)) {
      return null;
    }
    seqRef.current += 1;
    const step = buildStep({ ...input, columns: input.columns ?? columnsRef.current, seq: seqRef.current });
    setSteps((prev) => [...prev, step]);
    return step;
  }, []);

  const undo = React.useCallback((stepId?: string) => {
    const result = undoSteps(stepsRef.current, stepId);
    if (!result) {
      return;
    }
    applyRef.current(result.restore);
    setSteps(result.steps);
  }, []);

  const reset = React.useCallback(() => {
    const result = resetSteps(stepsRef.current);
    if (!result) {
      return;
    }
    applyRef.current(result.restore);
    setSteps(result.steps);
  }, []);

  const getStepByMessageId = React.useCallback(
    (messageId: string) => stepsRef.current.find((step) => step.messageId === messageId),
    [],
  );

  return React.useMemo<ChartCopilotHistory>(
    () => ({ steps, record, undo, reset, getStepByMessageId, canUndo: steps.length > 0 }),
    [steps, record, undo, reset, getStepByMessageId],
  );
}
