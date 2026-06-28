import { type CommandHandler, type ExecutorContext, invalid, ok } from '@mui/x-copilot';
import type { ChartsHostAdapter } from '../chartsHostAdapter';
import type { ChartCopilotState } from '../chartState';

type Handler<P> = CommandHandler<ChartsHostAdapter, ChartCopilotState, P>;
type Ctx = ExecutorContext<ChartsHostAdapter, ChartCopilotState>;

interface ZoomParams {
  from: string | number;
  to: string | number;
}

interface HighlightParams {
  /** The value field to emphasize. `series` (array) is also accepted. */
  seriesId?: string;
  series?: string | string[];
}

const valueFields = (ctx: Ctx): string[] =>
  ctx.adapter.api.getChartState().values.map((item) => item.field);

function highlightTarget(params: HighlightParams): string | undefined {
  if (typeof params?.seriesId === 'string') {
    return params.seriesId;
  }
  if (Array.isArray(params?.series)) {
    return params.series[0];
  }
  if (typeof params?.series === 'string') {
    return params.series;
  }
  return undefined;
}

/** `focus.zoom` — set the zoom window to a category range. */
export const focusZoom: Handler<ZoomParams> = {
  type: 'focus.zoom',
  namespace: 'view',
  tier: 2,
  plan: 'premium',
  guard: 'focus',
  phase: 'view',
  validate: (params) => {
    if (!params || params.from === undefined || params.to === undefined) {
      return invalid('focus.zoom requires { from, to }');
    }
    return ok();
  },
  run: ({ from, to }, ctx) => {
    ctx.adapter.api.setFocus({ ...ctx.adapter.api.getFocus(), zoom: { from, to } });
  },
};

/** `focus.highlight` — emphasize one series and fade the rest. */
export const focusHighlight: Handler<HighlightParams> = {
  type: 'focus.highlight',
  namespace: 'view',
  tier: 2,
  plan: 'premium',
  guard: 'focus',
  phase: 'view',
  validate: (params, ctx) => {
    const target = highlightTarget(params);
    if (!target) {
      return invalid('focus.highlight requires { seriesId }');
    }
    if (!valueFields(ctx).includes(target)) {
      return invalid(`focus.highlight: '${target}' is not a value series in the chart`);
    }
    return ok();
  },
  run: (params, ctx) => {
    const seriesId = highlightTarget(params)!;
    ctx.adapter.api.setFocus({ ...ctx.adapter.api.getFocus(), highlight: { seriesId } });
  },
};

/** `focus.reset` — clear the zoom window and highlight. */
export const focusReset: Handler<Record<string, never>> = {
  type: 'focus.reset',
  namespace: 'view',
  tier: 1,
  plan: 'premium',
  guard: 'focus',
  phase: 'view',
  run: (_params, ctx) => {
    ctx.adapter.api.setFocus({});
  },
};

export const chartFocusCommands: Array<CommandHandler<ChartsHostAdapter, ChartCopilotState>> = [
  focusZoom,
  focusHighlight,
  focusReset,
];
