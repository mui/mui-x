import * as React from 'react';
import { AnimationData } from '../types';
import { BarLabelItem, BarLabelItemProps } from './BarLabelItem';
import type { SeriesId } from '../../models/seriesType/common';
import { BarSeriesType, BarValueType } from '../../models/seriesType/bar';
import { BarLabelFunction } from './BarLabel.types';

interface BarLabelPlotProps<V extends BarValueType | null = BarValueType | null> {
  processedSeries: ProcessedBarLabelSeriesData<V>;
  className: string;
  skipAnimation?: boolean;
  barLabel?: BarLabelItemProps<V | null>['barLabel'];
}

export interface ProcessedBarLabelSeriesData<V extends BarValueType | null> {
  seriesId: SeriesId;
  data: ProcessedBarLabelData<V>[];
  barLabel?: 'value' | BarLabelFunction<V>;
  barLabelPlacement?: BarSeriesType['barLabelPlacement'];
  layout?: 'vertical' | 'horizontal';
  xOrigin: number;
  yOrigin: number;
}

export interface ProcessedBarLabelData<V extends BarValueType | null> extends AnimationData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: V;
}

/**
 * @ignore - internal component.
 */
function BarLabelPlot<V extends BarValueType | null = BarValueType | null>(
  props: BarLabelPlotProps<V>,
) {
  const { processedSeries, className, skipAnimation, ...other } = props;
  const { seriesId, data, layout, xOrigin, yOrigin } = processedSeries;

  const barLabel = processedSeries.barLabel ?? props.barLabel;

  if (!barLabel) {
    return null;
  }

  return (
    <g key={seriesId} className={className} data-series={seriesId}>
      {data.map(({ x, y, dataIndex, color, value, width, height }) => (
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
          {...other}
          barLabel={barLabel}
          barLabelPlacement={processedSeries.barLabelPlacement || 'center'}
        />
      ))}
    </g>
  );
}

export { BarLabelPlot };
