import { DefaultizedProps, MakeRequired } from '@mui/x-internals/types';
import { AxisId, ZoomOptions } from '@mui/x-charts/internals';
import * as React from 'react';
import { ChartBaseIconProps } from '@mui/x-charts/models';
import {
  HeatmapItemIdentifier,
  HeatmapSeriesType,
  DefaultizedHeatmapSeriesType,
  HeatmapValueType,
} from '../models/seriesType/heatmap';
import {
  DefaultizedFunnelSeriesType,
  FunnelItemIdentifier,
  FunnelSeriesType,
  FunnelValueType,
} from '../FunnelChart/funnel.types';

declare module '@mui/x-charts/internals' {
  interface ChartsSeriesConfig {
    heatmap: {
      seriesInput: DefaultizedProps<HeatmapSeriesType, 'id'>;
      series: DefaultizedHeatmapSeriesType;
      seriesProp: HeatmapSeriesType;
      itemIdentifier: HeatmapItemIdentifier;
      valueType: HeatmapValueType;
      axisType: 'cartesian';
    };
    funnel: {
      seriesInput: Omit<DefaultizedProps<FunnelSeriesType, 'id'>, 'data'> & {
        data: MakeRequired<FunnelValueType, 'color'>[];
      };
      series: DefaultizedFunnelSeriesType;
      seriesProp: FunnelSeriesType;
      itemIdentifier: FunnelItemIdentifier;
      valueType: MakeRequired<FunnelValueType, 'id' | 'color'>;
      axisType: 'cartesian';
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

declare module '@mui/x-charts/models/slots' {
  interface ChartsIconSlotsExtension {
    /**
     * Icon displayed on the toolbar's zoom in button.
     * @default ChartsZoomInIcon
     */
    zoomInIcon: React.ComponentType<ChartBaseIconProps>;
    /**
     * Icon displayed on the toolbar's zoom out button.
     * @default ChartsZoomOutIcon
     */
    zoomOutIcon: React.ComponentType<ChartBaseIconProps>;
  }
}
