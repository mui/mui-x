import * as React from 'react';
import { AnimationData } from '../types';
import { BarLabelItem, BarLabelItemProps } from './BarLabelItem';
import { useUtilityClasses } from '../barClasses';
import type { SeriesId } from '../../models/seriesType/common';
import { BarSeriesType, BarValueType } from '../../models/seriesType/bar';
import { RangeBarValueType } from '../../models/seriesType/rangeBar';
import { BarLabelFunction } from './BarLabel.types';

interface BarLabelPlotProps<
  V extends BarValueType | RangeBarValueType | null = BarValueType | null,
> {
  processedSeries: ProcessedBarLabelSeriesData<V>;
  skipAnimation?: boolean;
  barLabel?: BarLabelItemProps<V | null>['barLabel'];
}

export interface ProcessedBarLabelSeriesData<V extends BarValueType | RangeBarValueType | null> {
  seriesId: SeriesId;
  data: ProcessedBarLabelData<V>[];
  barLabel?: 'value' | BarLabelFunction<V>;
  barLabelPlacement?: BarSeriesType['barLabelPlacement'];
}

export interface ProcessedBarLabelData<V extends BarValueType | RangeBarValueType | null>
  extends AnimationData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: V;
}

/**
 * @ignore - internal component.
 */
function BarLabelPlot<V extends BarValueType | RangeBarValueType | null = BarValueType | null>(
  props: BarLabelPlotProps<V>,
) {
  const { processedSeries, skipAnimation, ...other } = props;
  const { seriesId, data } = processedSeries;
  const classes = useUtilityClasses();

  const barLabel = processedSeries.barLabel ?? props.barLabel;

  if (!barLabel) {
    return null;
  }

  return (
    <g key={seriesId} className={classes.seriesLabels} data-series={seriesId}>
      {data.map(({ xOrigin, yOrigin, x, y, dataIndex, color, value, width, height, layout }) => (
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
