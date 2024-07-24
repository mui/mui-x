import * as React from 'react';
import PropTypes from 'prop-types';
import { useXScale, useYScale, useZColorScale } from '@mui/x-charts/hooks';
import { useHeatmapSeries } from '../hooks/useSeries';
import { HeatmapItem, HeatmapItemProps } from './HeatmapItem';

export interface HeatmapPlotProps extends Pick<HeatmapItemProps, 'slots' | 'slotProps'> {}

function HeatmapPlot(props: HeatmapPlotProps) {
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'band'>();
  const colorScale = useZColorScale()!;
  const series = useHeatmapSeries();

  const xDomain = xScale.domain();
  const yDomain = yScale.domain();

  if (!series || series.seriesOrder.length === 0) {
    return null;
  }
  const seriesToDisplay = series.series[series.seriesOrder[0]];

  return (
    <g>
      {seriesToDisplay.data.map(([xIndex, yIndex, value], dataIndex) => {
        const x = xScale(xDomain[xIndex]);
        const y = yScale(yDomain[yIndex]);
        const color = colorScale?.(value);
        if (x === undefined || y === undefined || !color) {
          return null;
        }
        return (
          <HeatmapItem
            key={`${xIndex}_${yIndex}`}
            width={xScale.bandwidth()}
            height={yScale.bandwidth()}
            x={x}
            y={y}
            color={color}
            dataIndex={dataIndex}
            seriesId={series.seriesOrder[0]}
            value={value}
            slots={props.slots}
            slotProps={props.slotProps}
          />
        );
      })}
    </g>
  );
}

HeatmapPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
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

export { HeatmapPlot };
