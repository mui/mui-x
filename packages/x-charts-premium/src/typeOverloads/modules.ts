import type { DefaultizedProps, MakeRequired } from '@mui/x-internals/types';
import type { CommonHighlightScope, SeriesColor, SeriesId } from '@mui/x-charts/internals';
import type { RangeBarValueType, RangeBarSeriesType } from '../models';
import type {
  DefaultizedRangeBarSeriesType,
  RangeBarItemIdentifier,
} from '../models/seriesType/rangeBar';
import type { BarSeries } from '../BarChart';

declare module '@mui/x-charts/internals' {
  interface UseBarChartPropsExtensions {
    series: ReadonlyArray<BarSeries | RangeBarSeriesType>;
  }

  interface ChartsSeriesConfig {
    rangeBar: {
      seriesInput: DefaultizedProps<RangeBarSeriesType, 'id'> &
        MakeRequired<SeriesColor<RangeBarValueType | null>, 'color'>;
      series: DefaultizedRangeBarSeriesType;
      seriesLayout: {};
      seriesProp: RangeBarSeriesType;
      itemIdentifier: RangeBarItemIdentifier;
      itemIdentifierWithData: RangeBarItemIdentifier;
      valueType: RangeBarValueType | null;
      axisType: 'cartesian';
      highlightScope: CommonHighlightScope;
      highlightIdentifier: {
        type: 'rangeBar';
        seriesId: SeriesId;
        dataIndex?: number;
      };
    };
  }
}
