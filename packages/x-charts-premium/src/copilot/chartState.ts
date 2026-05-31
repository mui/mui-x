import type { TransformSpec } from './transform';
import type { AnnotationSpec, OverlaySpec } from './annotations/types';

export type ChartCopilotChartType = 'column' | 'bar' | 'line' | 'area' | 'pie';

export interface ChartItem {
  field: string;
  label?: string;
  hidden?: boolean;
}

export interface ChartCopilotState {
  type: ChartCopilotChartType;
  dimensions: ChartItem[];
  values: ChartItem[];
  configuration: Record<string, any>;
  label?: string;
  /**
   * Declarative data operations (group-by aggregation, topN, filter,
   * dateWindow, transpose) applied to the dataset rows before they are resolved
   * into series. See `transform/`.
   */
  transform?: TransformSpec;
  /** Reference lines / bands / markers / callouts drawn over the chart. */
  annotations?: Record<string, AnnotationSpec>;
  /** Computed overlay series definitions (SMA/EMA/forecast/trend/cumulative). */
  overlays?: Record<string, OverlaySpec>;
}

export interface RenderedItem {
  id: string;
  label: string;
  data: (string | number | Date | null)[];
}

export const EMPTY_CHART_COPILOT_STATE: ChartCopilotState = {
  type: 'bar',
  dimensions: [],
  values: [],
  configuration: {},
};

const snapshotItem = (item: ChartItem): ChartItem => {
  const copy: ChartItem = { field: item.field };
  if (item.label !== undefined) {
    copy.label = item.label;
  }
  if (item.hidden !== undefined) {
    copy.hidden = item.hidden;
  }
  return copy;
};

/**
 * Returns a plain serializable copy of the state in field-ref form (no resolved data).
 */
export function snapshotState(state: ChartCopilotState): ChartCopilotState {
  const snapshot: ChartCopilotState = {
    type: state.type,
    dimensions: state.dimensions.map(snapshotItem),
    values: state.values.map(snapshotItem),
    configuration: { ...state.configuration },
  };
  if (state.label !== undefined) {
    snapshot.label = state.label;
  }
  if (state.transform !== undefined) {
    // Plain JSON data — a structured clone keeps the snapshot independent.
    snapshot.transform = JSON.parse(JSON.stringify(state.transform));
  }
  if (state.annotations !== undefined) {
    snapshot.annotations = JSON.parse(JSON.stringify(state.annotations));
  }
  if (state.overlays !== undefined) {
    snapshot.overlays = JSON.parse(JSON.stringify(state.overlays));
  }
  return snapshot;
}
