import * as React from 'react';

import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { FunnelItemIdentifier } from './funnel.types';
import { useFunnelSeries } from '../hooks/useSeries';
import { useCartesianContext } from '../context/CartesianProvider';
import { AxisId } from '../models/axis';
import getCurveFactory from '../internals/getCurve';
import { FunnelElement } from './FunnelElement';
import { FunnelLabel } from './FunnelLabel';

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
  const seriesData = useFunnelSeries();
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

    const isHorizontal = Object.values(series).some((s) => s.layout === 'horizontal');

    const result = stackingGroups.map(({ ids: groupIds }) => {
      return groupIds.map((seriesId) => {
        const xAxisId = series[seriesId].xAxisId ?? series[seriesId].xAxisKey ?? defaultXAxisId;
        const yAxisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey ?? defaultYAxisId;

        const xScale = xAxis[xAxisId].scale;
        const yScale = yAxis[yAxisId].scale;

        const gradientUsed: [AxisId, 'x' | 'y'] | undefined =
          (yAxis[yAxisId].colorScale && [yAxisId, 'y']) ||
          (xAxis[xAxisId].colorScale && [xAxisId, 'x']) ||
          undefined;

        const { stackedData } = series[seriesId];

        const curve = getCurveFactory(series[seriesId].curve ?? 'linear');

        const line = d3Line<{ x: number; y: number }>()
          .x((d) => xScale(d.x)!)
          .y((d) => yScale(d.y)!)
          .curve(curve);

        return stackedData.map((values, dataIndex) => {
          const color = series[seriesId].color ?? 'black';
          const id = `${seriesId}-${dataIndex}`;

          return {
            d: line(values)!,
            color,
            id,
            seriesId,
            dataIndex,
            gradientUsed,
            label: {
              x: isHorizontal ? xScale(values[0].x - (values[0].x - values[1].x) / 2) : xScale(0),
              y: isHorizontal ? yScale(0) : yScale(values[0].y - (values[0].y - values[1].y) / 2),
              value: series[seriesId].data[dataIndex]?.toString(),
            },
          };
        });
      });
    });

    return result.flatMap((v) => v.toReversed().flat());
  }, [seriesData, axisData]);

  return allData;
};

function FunnelPlot(props: FunnelPlotProps) {
  const { skipAnimation, onItemClick, ...other } = props;

  const data = useAggregatedData();

  return (
    <React.Fragment>
      {data.map(({ d, color, id, seriesId, dataIndex }) => (
        <FunnelElement
          {...other}
          d={d}
          color={color}
          key={id}
          dataIndex={dataIndex}
          seriesId={seriesId}
          onClick={
            onItemClick &&
            ((event) => {
              onItemClick(event, { type: 'funnel', seriesId, dataIndex });
            })
          }
        />
      ))}
      {data.map(({ id, label }) => (
        <FunnelLabel key={id} x={label.x} y={label.y}>
          {label.value}
        </FunnelLabel>
      ))}
    </React.Fragment>
  );
}

export { FunnelPlot };
