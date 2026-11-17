import { BarChart } from '@mui/x-charts/BarChart';
import { useItemHighlightStateGetter } from '@mui/x-charts/hooks';
import type { useRadiusAxes, useRotationAxes } from '@mui/x-charts/hooks';
import type { ChartsActivationEvent, ChartsAxisData } from '@mui/x-charts/models';
import type { ComposableCartesianChartSeriesType } from '@mui/x-charts/internals';
import FlatQueue from '@mui/x-charts-vendor/flatqueue';
import type { Equal, Expect } from '../../utils/typeUtils.js';

export const chart = (
  <BarChart height={300} xAxis={[{ data: ['A', 'B', 'C'] }]} series={[{ data: [4, 2, 5] }]} />
);

export function useBarHighlight() {
  const getHighlightState = useItemHighlightStateGetter<'bar'>();
  // The series type argument must not narrow the items the callback accepts.
  return getHighlightState({ type: 'pie', seriesId: 'pie' });
}

export type CommunityTypes = [
  Expect<Equal<ComposableCartesianChartSeriesType, 'bar' | 'line' | 'scatter'>>,
  Expect<Equal<ChartsActivationEvent, MouseEvent>>,
  Expect<Equal<ChartsAxisData['seriesValues'][string], number | null | undefined>>,
  Expect<
    Equal<
      ReturnType<typeof useRotationAxes>['rotationAxis'][string]['axis'],
      'rotation' | undefined
    >
  >,
  Expect<
    Equal<ReturnType<typeof useRadiusAxes>['radiusAxis'][string]['axis'], 'radius' | undefined>
  >,
];

const queue = new FlatQueue<number>();
queue.push(1, 0);
// @ts-expect-error The vendor default export must retain its item type.
queue.push('invalid', 0);
