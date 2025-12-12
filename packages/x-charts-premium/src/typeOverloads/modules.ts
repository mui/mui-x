import type { BarSeries } from '../BarChart';
import type { RangeBarSeriesType } from '../models';

declare module '@mui/x-charts/internals' {
  interface UseBarChartPropsExtensions {
    series: ReadonlyArray<BarSeries | RangeBarSeriesType>;
  }
}
