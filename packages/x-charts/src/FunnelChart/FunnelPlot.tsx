import * as React from 'react';

import { FunnelItemIdentifier } from './funnel.types';
import { useFunnelSeries } from '../hooks/useSeries';
import { SeriesFormatterResult } from '../context/PluginProvider';
import { useCartesianContext } from '../context/CartesianProvider';
import { getValueToPositionMapper } from '../hooks';
import { AxisId } from '../models/axis';
import { DEFAULT_X_AXIS_KEY } from '../constants';
import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import getCurveFactory from '../internals/getCurve';

export interface FunnelPlotSlots {}

export interface FunnelPlotSlotProps {}

export interface FunnelPlotProps {
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
  /**
   * Callback fired when a funnel item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    funnelItemIdentifier: FunnelItemIdentifier,
  ) => void;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: FunnelPlotSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: FunnelPlotSlots;
}

const useAggregatedData = () => {
  const seriesData =
    useFunnelSeries() ??
    ({ series: {}, stackingGroups: [], seriesOrder: [] } as SeriesFormatterResult<'funnel'>);
  const axisData = useCartesianContext();

  // This memo prevents odd line chart behavior when hydrating.
  const allData = React.useMemo(() => {
    if (seriesData === undefined) {
      return [];
    }

    const { series, stackingGroups } = seriesData;
    const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
    const defaultXAxisId = xAxisIds[0];
    const defaultYAxisId = yAxisIds[0];

    return stackingGroups.flatMap(({ ids: groupIds }) => {
      return groupIds.flatMap((seriesId) => {
        const {
          xAxisId: xAxisIdProp,
          yAxisId: yAxisIdProp,
          xAxisKey = defaultXAxisId,
          yAxisKey = defaultYAxisId,
          stackedDataMain,
          stackedDataOther,
        } = series[seriesId];

        const xAxisId = xAxisIdProp ?? xAxisKey;
        const yAxisId = yAxisIdProp ?? yAxisKey;

        const xScale = xAxis[xAxisId].scale;
        const yScale = yAxis[yAxisId].scale;

        const gradientUsed: [AxisId, 'x' | 'y'] | undefined =
          (yAxis[yAxisId].colorScale && [yAxisId, 'y']) ||
          (xAxis[xAxisId].colorScale && [xAxisId, 'x']) ||
          undefined;

        const curve = getCurveFactory(series[seriesId].curve);

        return {
          ...series[seriesId],
          gradientUsed,
          points: [
            `${xScale(stackedDataMain[0].v0)!},${yScale(stackedDataOther[0].v0)}`,
            `${xScale(stackedDataMain[0].v1)!},${yScale(stackedDataOther[0].v1)}`,
            `${xScale(stackedDataMain[0].v2)!},${yScale(stackedDataOther[0].v2)}`,
            `${xScale(stackedDataMain[0].v3)!},${yScale(stackedDataOther[0].v3)}`,
          ].join(' '),
          seriesId,
        };
      });
    });
  }, [seriesData, axisData]);

  return allData;
};

function FunnelPlot(props: FunnelPlotProps) {
  const data = useAggregatedData();

  console.table(
    data.map(({ stackedDataMain, stackedDataOther }) => ({
      m0: Object.values(stackedDataMain[0]).join(','),
      o1: Object.values(stackedDataOther[0]).join(','),
    })),
  );

  return (
    <React.Fragment>
      {data.map((v) => {
        return (
          <polygon strokeWidth={10} points={v.points} stroke={'blue'} fill={v.color} key={v.id} />
        );
      })}
    </React.Fragment>
  );
}

export { FunnelPlot };
