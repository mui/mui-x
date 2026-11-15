'use client';
import * as React from 'react';
import { BarLabelItem } from '@mui/x-charts/internals';
import type { BarLabelSlotProps, BarLabelSlots } from '@mui/x-charts/BarChart';
import type { ProcessedRangeBarSeriesData } from './types';
import { getRangeBarLabel } from './getRangeBarLabel';

interface RangeBarLabelPlotProps {
  processedSeries: ProcessedRangeBarSeriesData;
  className: string;
  /**
   * If `true`, animations are skipped.
   */
  skipAnimation: boolean;
  slots?: BarLabelSlots;
  slotProps?: BarLabelSlotProps;
}

/**
 * @ignore - internal component.
 */
export function RangeBarLabelPlot(props: RangeBarLabelPlotProps) {
  const { processedSeries, className, skipAnimation, slots, slotProps } = props;
  const { seriesId, data, barLabel } = processedSeries;
  const layout = processedSeries.layout ?? 'vertical';
  const barLabelPlacement = processedSeries.barLabelPlacement ?? 'center';

  if (!barLabel) {
    return null;
  }

  return (
    <g className={className} data-series={seriesId}>
      {data.map(({ dataIndex, color, value, x, y, width, height, hidden, startCoordinate }) => {
        // Range bars grow from their center, so it is the label origin.
        // `outside` labels get the half of the bar that contains the end of the range, to follow its edge.
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        let labelX = x;
        let labelY = y;
        let labelWidth = width;
        let labelHeight = height;

        if (barLabelPlacement === 'outside') {
          if (layout === 'vertical') {
            labelY = startCoordinate <= centerY ? centerY : y;
            labelHeight = height / 2;
          } else {
            labelX = startCoordinate <= centerX ? centerX : x;
            labelWidth = width / 2;
          }
        }

        return (
          <BarLabelItem
            key={dataIndex}
            seriesId={seriesId}
            seriesType="rangeBar"
            dataIndex={dataIndex}
            color={color}
            xOrigin={centerX}
            yOrigin={centerY}
            x={labelX}
            y={labelY}
            width={labelWidth}
            height={labelHeight}
            skipAnimation={skipAnimation}
            layout={layout}
            hidden={hidden}
            slots={slots}
            slotProps={slotProps}
            // `barLabel` gets the size of the whole bar, even when the slot only gets half of it.
            label={getRangeBarLabel({ barLabel, value, dataIndex, seriesId, height, width })}
            barLabelPlacement={barLabelPlacement}
          />
        );
      })}
    </g>
  );
}
