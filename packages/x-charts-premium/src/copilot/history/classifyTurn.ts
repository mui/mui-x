import type { ChartCopilotState, ChartItem } from '../chartState';
import type { ChartCopilotFeature } from './types';

const eq = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

const visibleFields = (items: ChartItem[] | undefined): string[] =>
  (items ?? []).filter((item) => !item.hidden).map((item) => item.field);

const groupByOf = (state: ChartCopilotState): string[] =>
  state.transform?.aggregation?.groupBy ?? [];

/**
 * Classifies a copilot turn into the PRD feature it belongs to, from the
 * before/after spec diff. Deterministic and LLM-free.
 *
 * Precedence (most specific first):
 *  1. annotations/overlays touched → `annotate`
 *  2. spec went from "no series" to "has series" → `ask` (a creation turn)
 *  3. chart type changed, or the grouping/dimension structure changed → `reshape`
 *  4. any other spec change (config, topN, filter, window, label) → `refine`
 *  5. no spec change but the assistant replied → `explain`
 *
 * @param before The spec before the turn.
 * @param after The spec after the turn.
 * @param hadPatches Whether the turn applied at least one accepted patch.
 * @param _messageText The assistant's reply text, if any (reserved for future
 *   narrative-vs-action disambiguation).
 */
export function classifyTurn(
  before: ChartCopilotState,
  after: ChartCopilotState,
  hadPatches: boolean,
  _messageText?: string,
): ChartCopilotFeature {
  const specChanged = !eq(before, after);

  if (!specChanged || !hadPatches) {
    // A narrative-only turn (no accepted patch) is an explanation.
    return 'explain';
  }

  if (
    !eq(before.annotations, after.annotations) ||
    !eq(before.overlays, after.overlays)
  ) {
    return 'annotate';
  }

  const beforeHadSeries = visibleFields(before.values).length > 0;
  const afterHasSeries = visibleFields(after.values).length > 0;
  if (!beforeHadSeries && afterHasSeries) {
    return 'ask';
  }

  const typeChanged = before.type !== after.type;
  const transposeToggled = Boolean(before.transform?.transpose) !== Boolean(after.transform?.transpose);
  const structureChanged =
    !eq(visibleFields(before.dimensions), visibleFields(after.dimensions)) ||
    !eq(groupByOf(before), groupByOf(after));
  if (typeChanged || transposeToggled || structureChanged) {
    return 'reshape';
  }

  return 'refine';
}
