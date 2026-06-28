import type { ChartCopilotState } from '../chartState';

/** Which PRD feature a copilot turn maps to (inferred from its diff). */
export type ChartCopilotFeature =
  | 'ask'
  | 'refine'
  | 'annotate'
  | 'explain'
  | 'reshape';

/** A single human-readable clause of what one turn did. */
export interface ReceiptClause {
  /** Stable id within the step (the changed path/key it describes). */
  id: string;
  kind:
    | 'type'
    | 'series'
    | 'dimension'
    | 'aggregation'
    | 'topN'
    | 'filter'
    | 'window'
    | 'config'
    | 'annotation'
    | 'overlay'
    | 'label';
  /** Display text, e.g. "Bar", "summed by region", "Top 10", "SMA 7 of revenue". */
  label: string;
}

/**
 * One undoable unit: the before/after spec around an assistant turn plus the
 * receipt clauses describing the change. Append-only — editing a past clause
 * creates a *new* step rather than rewriting this one.
 */
export interface HistoryStep {
  id: string;
  /** The assistant message that produced this step (for the receipt slot). */
  messageId?: string;
  feature: ChartCopilotFeature;
  clauses: ReceiptClause[];
  before: ChartCopilotState;
  after: ChartCopilotState;
  /** The user prompt that triggered the turn, when known. */
  prompt?: string;
  /** Monotonic sequence number (the controller stamps it; avoids Date.now). */
  seq: number;
}
