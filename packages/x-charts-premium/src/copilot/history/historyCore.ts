import type { ChartCopilotState } from '../chartState';
import type { ChartCopilotDatasetColumn } from '../resolveForRenderer';
import { classifyTurn } from './classifyTurn';
import { describeSpecDiff } from './describeSpecDiff';
import type { HistoryStep } from './types';

const eq = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

export interface BuildStepInput {
  before: ChartCopilotState;
  after: ChartCopilotState;
  hadPatches: boolean;
  seq: number;
  messageId?: string;
  prompt?: string;
  messageText?: string;
  columns?: Pick<ChartCopilotDatasetColumn, 'field' | 'headerName'>[];
}

/** Whether a turn produced an undoable spec change worth recording. */
export function isRecordable(
  before: ChartCopilotState,
  after: ChartCopilotState,
  hadPatches: boolean,
): boolean {
  return hadPatches && !eq(before, after);
}

/** Builds a {@link HistoryStep} for a turn (classify + describe). */
export function buildStep(input: BuildStepInput): HistoryStep {
  const { before, after, hadPatches, seq, messageId, prompt, messageText, columns } = input;
  return {
    id: `step-${seq}`,
    seq,
    messageId,
    prompt,
    feature: classifyTurn(before, after, hadPatches, messageText),
    clauses: describeSpecDiff(before, after, columns),
    before,
    after,
  };
}

/**
 * Computes the result of undoing to a step (default: the latest). Linear
 * history — the target step and everything after it are dropped, and the
 * spec is restored to that step's `before`.
 *
 * @returns The next steps + the spec to restore, or `null` when there is
 *   nothing to undo.
 */
export function undoSteps(
  steps: HistoryStep[],
  stepId?: string,
): { steps: HistoryStep[]; restore: ChartCopilotState } | null {
  if (steps.length === 0) {
    return null;
  }
  const index = stepId ? steps.findIndex((step) => step.id === stepId) : steps.length - 1;
  if (index < 0) {
    return null;
  }
  return { steps: steps.slice(0, index), restore: steps[index].before };
}

/** Computes the result of resetting to the original (pre-history) spec. */
export function resetSteps(
  steps: HistoryStep[],
): { steps: HistoryStep[]; restore: ChartCopilotState } | null {
  if (steps.length === 0) {
    return null;
  }
  return { steps: [], restore: steps[0].before };
}
