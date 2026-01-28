import * as React from 'react';
import PropTypes from 'prop-types';

import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { cartesianSeriesTypes, useStore } from '@mui/x-charts/internals';
import { type FunnelItemIdentifier } from './funnel.types';
import { FunnelSection } from './FunnelSection';
import { alignLabel, positionLabel } from './labelUtils';
import { type FunnelPlotSlotExtension } from './funnelPlotSlots.types';
import { useFunnelSeriesContext } from '../hooks/useFunnelSeries';
import { getFunnelCurve, type Point } from './curves';
import { FunnelSectionLabel } from './FunnelSectionLabel';
import {
  selectorChartXAxis,
  selectorChartYAxis,
  selectorFunnelGap,
} from './funnelAxisPlugin/useChartFunnelAxisRendering.selectors';
import { createPositionGetter } from './coordinateMapper';
import { get2DExtrema } from './get2DExtrema';

cartesianSeriesTypes.addType('funnel');

export interface FunnelPlotProps extends FunnelPlotSlotExtension {
  /**
   * Callback fired when a funnel item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    funnelItemIdentifier: FunnelItemIdentifier,
  ) => void;
}

const useAggregatedData = () => {
  const seriesData = useFunnelSeriesContext();
  const store = useStore();
  const { axis: xAxis, axisIds: xAxisIds } = store.use(selectorChartXAxis);
  const { axis: yAxis, axisIds: yAxisIds } = store.use(selectorChartYAxis);
  const gap = store.use(selectorFunnelGap);

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

      const xScale = xAxis[xAxisId].scale;
      const yScale = yAxis[yAxisId].scale;

      const xPosition = createPositionGetter(xScale, isHorizontal, gap, baseScaleConfig.data);
      const yPosition = createPositionGetter(yScale, !isHorizontal, gap, baseScaleConfig.data);

      const [minPoint, maxPoint] = get2DExtrema(currentSeries.dataPoints, xPosition, yPosition);

      return currentSeries.dataPoints.flatMap((values, dataIndex) => {
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

        const isIncreasing = currentSeries.funnelDirection === 'increasing';

        const curve = getFunnelCurve(currentSeries.curve, {
          isHorizontal,
          gap,
          position: dataIndex,
          sections: currentSeries.dataPoints.length,
          borderRadius: currentSeries.borderRadius,
          isIncreasing,
          min: minPoint,
          max: maxPoint,
        });
        const bandPoints = curve({} as any).processPoints(
          values.map((v) => ({
            x: xPosition(v.x, dataIndex, v.stackOffset, v.useBandWidth),
            y: yPosition(v.y, dataIndex, v.stackOffset, v.useBandWidth),
          })),
        );

        const line = d3Line<Point>()
          .x((v) => v.x)
          .y((v) => v.y)
          .curve(curve);

        return {
          d: line(bandPoints)!,
          color,
          id,
          seriesId,
          dataIndex,
          variant: currentSeries.variant,
          label: sectionLabel !== false && {
            ...positionLabel({
              ...sectionLabel,
              isHorizontal,
              values: bandPoints,
            }),
            ...alignLabel(sectionLabel ?? {}),
            value: valueFormatter
              ? valueFormatter(currentSeries.data[dataIndex], { dataIndex })
              : currentSeries.data[dataIndex].value?.toLocaleString(),
          },
        };
      });
    });

    return result;
  }, [seriesData, xAxis, xAxisIds, yAxis, yAxisIds, gap]);

  return allData;
};

function FunnelPlot(props: FunnelPlotProps) {
  const { onItemClick, ...other } = props;

  const data = useAggregatedData();

  return (
    <React.Fragment>
      {data.map((series) => {
        if (series.length === 0) {
          return null;
        }

        return (
          <g data-series={series[0].seriesId} key={series[0].seriesId}>
            {series.map(({ d, color, id, seriesId, dataIndex, variant }) => (
              <FunnelSection
                {...other}
                d={d}
                color={color}
                key={id}
                dataIndex={dataIndex}
                seriesId={seriesId}
                variant={variant}
                onClick={
                  onItemClick &&
                  ((event) => {
                    onItemClick(event, { type: 'funnel', seriesId, dataIndex });
                  })
                }
              />
            ))}
          </g>
        );
      })}
      {data.map((series) => {
        if (series.length === 0) {
          return null;
        }

        return (
          <g data-series={series[0].seriesId} key={series[0].seriesId}>
            {series.map(({ id, label, seriesId, dataIndex }) => {
              if (!label || !label.value) {
                return null;
              }

              return (
                <FunnelSectionLabel
                  key={id}
                  label={label}
                  dataIndex={dataIndex}
                  seriesId={seriesId}
                  {...other}
                />
              );
            })}
          </g>
        );
      })}
    </React.Fragment>
  );
}

FunnelPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a funnel item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { FunnelPlot };
