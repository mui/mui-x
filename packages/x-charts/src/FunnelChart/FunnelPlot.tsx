import * as React from 'react';

import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { FunnelItemIdentifier } from './funnel.types';
import { useFunnelSeries } from '../hooks/useSeries';
import { SeriesFormatterResult } from '../context/PluginProvider';
import { useCartesianContext } from '../context/CartesianProvider';
import { getValueToPositionMapper } from '../hooks';
import { AxisId } from '../models/axis';
import { DEFAULT_X_AXIS_KEY } from '../constants';
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
          stackedData,
        } = series[seriesId];

        const xAxisId = xAxisIdProp ?? xAxisKey;
        const yAxisId = yAxisIdProp ?? yAxisKey;

        const xScale = xAxis[xAxisId].scale;
        const yScale = yAxis[yAxisId].scale;

        const gradientUsed: [AxisId, 'x' | 'y'] | undefined =
          (yAxis[yAxisId].colorScale && [yAxisId, 'y']) ||
          (xAxis[xAxisId].colorScale && [xAxisId, 'x']) ||
          undefined;

        const curve = getCurveFactory(series[seriesId].curve ?? 'linear');
        console.log(stackedData);

        const line = d3Line<{ x: number; y: number }>()
          .x((d) => xScale(d.x)!)
          .y((d) => yScale(d.y)!)
          .curve(curve);

        return {
          ...series[seriesId],
          gradientUsed,
          d: line(stackedData[0]),
          usable: stackedData.map((d) => d.map((v) => ({ x: xScale(v.x)!, y: yScale(v.y)! }))),
          seriesId,
        };
      });
    });
  }, [seriesData, axisData]);

  return allData;
};

function FunnelPlot(props: FunnelPlotProps) {
  const data = useAggregatedData();
  const [hidden, setHidden] = React.useState(true);

  return (
    <React.Fragment>
      {data.map((v) => {
        return (
          <React.Fragment>
            <text x={100} y={50} onClick={() => setHidden(!hidden)}>
              change
            </text>
            <path d={v.d} stroke={'none'} fill={v.color} key={v.id} />
            {v.usable[0].map((d, i) => {
              return (
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={10}
                  fill={['red', 'pink', 'green', 'blue', 'orange', 'black'][i]}
                  stroke={'white'}
                  strokeWidth={2}
                  key={i}
                  visibility={hidden ? 'hidden' : 'visible'}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}

export { FunnelPlot };
