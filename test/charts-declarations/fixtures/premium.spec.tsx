import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';
import { CandlestickChart } from '@mui/x-charts-premium/CandlestickChart';
import { useItemHighlightStateGetter } from '@mui/x-charts/hooks';
import type { ComposableCartesianChartSeriesType } from '@mui/x-charts/internals';
import type { ChartsActivationEvent, ChartsAxisData } from '@mui/x-charts/models';
import type { Equal, Expect } from './assertions.js';

export const rangeChart = <BarChartPremium series={[{ type: 'rangeBar', data: [[1, 4]] }]} />;
export const candleChart = <CandlestickChart series={[{ data: [[2, 4, 1, 3]] }]} />;
export function useRadialHighlight() {
  const getHighlightState = useItemHighlightStateGetter();
  return getHighlightState({ type: 'radialLine', seriesId: 'radial' });
}
export type PremiumTypes = [
  Expect<
    Equal<ComposableCartesianChartSeriesType, 'bar' | 'line' | 'scatter' | 'rangeBar' | 'ohlc'>
  >,
  Expect<Equal<ChartsActivationEvent, MouseEvent>>,
  // Importing Premium alone must not opt into the range-bar callback override.
  Expect<Equal<ChartsAxisData['seriesValues'][string], number | null | undefined>>,
];
