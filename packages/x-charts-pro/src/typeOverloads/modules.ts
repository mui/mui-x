import type { DefaultizedProps, MakeRequired } from '@mui/x-internals/types';
import type { AxisId, CommonHighlightScope, ZoomOptions } from '@mui/x-charts/internals';
import type {
  DefaultizedFunnelSeriesType,
  FunnelItemIdentifier,
  FunnelSeriesType,
  FunnelValueType,
} from '../FunnelChart/funnel.types';
import type {
  HeatmapItemIdentifier,
  HeatmapSeriesType,
  DefaultizedHeatmapSeriesType,
  HeatmapValueType,
} from '../models/seriesType/heatmap';
import type {
  SankeyLayout,
  SankeySeriesType,
  DefaultizedSankeySeriesType,
  SankeyItemIdentifier,
  SankeyItemIdentifierWithData,
} from '../SankeyChart/sankey.types';
import type { SankeyHighlightScope } from '../SankeyChart/sankey.highlight.types';

declare module '@mui/x-charts/internals' {
  interface ChartsSeriesConfig {
    heatmap: {
      seriesInput: DefaultizedProps<HeatmapSeriesType, 'id'>;
      series: DefaultizedHeatmapSeriesType;
      seriesLayout: {};
      seriesProp: HeatmapSeriesType;
      itemIdentifier: HeatmapItemIdentifier;
      itemIdentifierWithData: HeatmapItemIdentifier;
      valueType: HeatmapValueType;
      axisType: 'cartesian';
      highlightScope: CommonHighlightScope;
    };
    funnel: {
      seriesInput: Omit<DefaultizedProps<FunnelSeriesType, 'id'>, 'data'> & {
        data: MakeRequired<FunnelValueType, 'color'>[];
      };
      series: DefaultizedFunnelSeriesType;
      seriesLayout: {};
      seriesProp: FunnelSeriesType;
      itemIdentifier: FunnelItemIdentifier;
      itemIdentifierWithData: FunnelItemIdentifier;
      valueType: MakeRequired<FunnelValueType, 'id' | 'color'>;
      axisType: 'cartesian';
      highlightScope: CommonHighlightScope;
    };
    sankey: {
      seriesInput: DefaultizedSankeySeriesType;
      series: DefaultizedSankeySeriesType;
      seriesLayout: {
        sankeyLayout: SankeyLayout<true>;
      };
      seriesProp: SankeySeriesType;
      itemIdentifier: SankeyItemIdentifier;
      itemIdentifierWithData: SankeyItemIdentifierWithData<true>;
      valueType: number;
      highlightScope: SankeyHighlightScope;
    };
  }

  interface DefaultizedZoomOptions extends Required<ZoomOptions> {
    axisId: AxisId;
    axisDirection: 'x' | 'y';
  }

  interface AxisConfigExtension {
    zoom?: boolean | ZoomOptions;
  }
}
