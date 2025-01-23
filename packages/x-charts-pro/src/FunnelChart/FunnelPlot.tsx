import * as React from 'react';

import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { getCurveFactory, AxisDefaultized, cartesianSeriesTypes } from '@mui/x-charts/internals';
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { FunnelItemIdentifier, FunnelDataPoints } from './funnel.types';
import { FunnelElement } from './FunnelElement';
import { FunnelLabel } from './FunnelLabel';
import { useFunnelSeries } from '../hooks/useSeries';
import { alignLabel, positionLabel } from './labelUtils';

cartesianSeriesTypes.addType('funnel');

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
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  const allData = React.useMemo(() => {
    if (seriesData === undefined) {
      return [];
    }

    const { series, seriesOrder } = seriesData;
    const defaultXAxisId = xAxisIds[0];
    const defaultYAxisId = yAxisIds[0];

    const isHorizontal = Object.values(series).some((s) => s.layout === 'horizontal');

    const result = seriesOrder.map((seriesId) => {
      const currentSeries = series[seriesId];
      const xAxisId = currentSeries.xAxisId ?? defaultXAxisId;
      const yAxisId = currentSeries.yAxisId ?? defaultYAxisId;

      const valueFormatter = currentSeries.valueFormatter;

      const baseScaleConfig = isHorizontal ? xAxis[xAxisId] : yAxis[yAxisId];

      const isXAxisBand = xAxis[xAxisId].scaleType === 'band';
      const isYAxisBand = yAxis[yAxisId].scaleType === 'band';

      const bandWidth =
        ((isXAxisBand || isYAxisBand) &&
          (baseScaleConfig as AxisDefaultized<'band'>).scale?.bandwidth()) ||
        0;

      const xScale = xAxis[xAxisId].scale;
      const yScale = yAxis[yAxisId].scale;

      const curve = getCurveFactory(currentSeries.curve ?? 'linear');

      const xPosition = (v: number, bandIndex: number, stackOffset?: number, useBand?: boolean) => {
        if (isXAxisBand) {
          const value = xScale(bandIndex);
          return useBand ? value! + bandWidth : value!;
        }
        return xScale(isHorizontal ? v + (stackOffset || 0) : v)!;
      };

      const yPosition = (v: number, bandIndex: number, stackOffset?: number, useBand?: boolean) => {
        if (isYAxisBand) {
          const value = yScale(bandIndex);
          return useBand ? value! + bandWidth : value!;
        }
        return yScale(isHorizontal ? v : v + (stackOffset || 0))!;
      };

      return currentSeries.dataPoints.map((values, dataIndex) => {
        const color = currentSeries.data[dataIndex].color!;
        const id = `${seriesId}-${dataIndex}`;
        const sectionLabel =
          typeof currentSeries.sectionLabel === 'function'
            ? currentSeries.sectionLabel({
                dataIndex,
                seriesId,
                value: currentSeries.data[dataIndex].value,
              })
            : currentSeries.sectionLabel;

        const line = d3Line<FunnelDataPoints>()
          .x((d) =>
            xPosition(d.x, baseScaleConfig.data?.[dataIndex], d.stackOffset, d.useBandWidth),
          )
          .y((d) =>
            yPosition(d.y, baseScaleConfig.data?.[dataIndex], d.stackOffset, d.useBandWidth),
          )
          .curve(curve);

        return {
          d: line(values)!,
          color,
          id,
          seriesId,
          dataIndex,
          label: sectionLabel !== false && {
            ...positionLabel({
              ...sectionLabel,
              xPosition,
              yPosition,
              isHorizontal,
              values,
              dataIndex,
              baseScaleData: baseScaleConfig.data ?? [],
            }),
            ...alignLabel(sectionLabel ?? {}),
            value: valueFormatter
              ? valueFormatter(currentSeries.data[dataIndex], { dataIndex })
              : currentSeries.data[dataIndex].value?.toLocaleString(),
          },
        };
      });
    });

    return result.flatMap((v) => v.toReversed().flat());
  }, [seriesData, xAxis, xAxisIds, yAxis, yAxisIds]);

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
      {data.map(({ id, label }) => {
        if (!label) {
          return null;
        }

        return (
          <FunnelLabel
            key={id}
            x={label.x}
            y={label.y}
            sx={{
              textAnchor: label.textAnchor,
              dominantBaseline: label.dominantBaseline,
            }}
          >
            {label.value}
          </FunnelLabel>
        );
      })}
    </React.Fragment>
  );
}

export { FunnelPlot };
