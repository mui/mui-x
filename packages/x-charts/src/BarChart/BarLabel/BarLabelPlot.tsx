import * as React from 'react';
import { type AnimationData } from '../types';
import { BarLabelItem, type BarLabelItemProps } from './BarLabelItem';
import type { SeriesId } from '../../models/seriesType/common';
import { type BarSeriesType, type BarValueType } from '../../models/seriesType/bar';
import { type BarLabelFunction } from './BarLabel.types';

interface BarLabelPlotProps {
  processedSeries: ProcessedBarLabelSeriesData;
  className: string;
  skipAnimation?: boolean;
  barLabel?: BarLabelItemProps<BarValueType | null>['barLabel'];
}

export interface ProcessedBarLabelSeriesData {
  seriesId: SeriesId;
  data: ProcessedBarLabelData[];
  barLabel?: 'value' | BarLabelFunction;
  barLabelPlacement?: BarSeriesType['barLabelPlacement'];
  layout?: 'vertical' | 'horizontal';
  xOrigin: number;
  yOrigin: number;
}

export interface ProcessedBarLabelData extends AnimationData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: BarValueType | null;
  hidden: boolean;
}

/**
 * @ignore - internal component.
 */
function BarLabelPlot(props: BarLabelPlotProps) {
  const { processedSeries, className, skipAnimation, ...other } = props;
  const { seriesId, data, layout, xOrigin, yOrigin } = processedSeries;

  const barLabel = processedSeries.barLabel ?? props.barLabel;

  if (!barLabel) {
    return null;
  }

  return (
    <g key={seriesId} className={className} data-series={seriesId}>
      {data.map(({ x, y, dataIndex, color, value, width, height, hidden }) => (
        <BarLabelItem
          key={dataIndex}
          seriesId={seriesId}
          dataIndex={dataIndex}
          value={value}
          color={color}
          xOrigin={xOrigin}
          yOrigin={yOrigin}
          x={x}
          y={y}
          width={width}
          height={height}
          skipAnimation={skipAnimation ?? false}
          layout={layout ?? 'vertical'}
          hidden={hidden}
          {...other}
          barLabel={barLabel}
          barLabelPlacement={processedSeries.barLabelPlacement || 'center'}
        />
      ))}
    </g>
  );
}

export { BarLabelPlot };
