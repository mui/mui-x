import type {} from '@mui/x-charts-premium/moduleAugmentation/rangeBarOnClick';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';
import type { ChartsAxisData } from '@mui/x-charts/models';
import type { RangeBarValueType } from '@mui/x-charts-premium/models';
import type { Equal, Expect } from './assertions.js';

export const chart = <BarChartPremium series={[{ type: 'rangeBar', data: [[1, 4]] }]} />;

export type RangeBarAxisValues = Expect<
  Equal<ChartsAxisData['seriesValues'][string], RangeBarValueType | number | null | undefined>
>;
