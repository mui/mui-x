import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import type { ComposableCartesianChartSeriesType } from '@mui/x-charts/internals';
import { selectorChartsHighlightState } from '@mui/x-charts/internals';
import type { ChartsActivationEvent, ChartsAxisData } from '@mui/x-charts/models';
import type { Equal, Expect } from './assertions.js';

export const chart = <BarChartPro series={[{ data: [1, 2] }]} />;
declare const state: Parameters<typeof selectorChartsHighlightState>[0];
selectorChartsHighlightState(state, {
  type: 'sankey',
  subType: 'node',
  seriesId: 's',
  nodeId: 'n',
});
export type ProTypes = [
  Expect<Equal<ComposableCartesianChartSeriesType, 'bar' | 'line' | 'scatter'>>,
  Expect<Equal<ChartsActivationEvent, MouseEvent>>,
  Expect<Equal<ChartsAxisData['seriesValues'][string], number | null | undefined>>,
];
