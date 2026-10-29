import * as React from 'react';
import type { AnimationData } from '../types';
import { BarLabelItem } from './BarLabelItem';
import type { SeriesId } from '../../models/seriesType/common';
import type { BarSeriesType, BarValueType } from '../../models/seriesType/bar';
import type { BarLabelFunction } from './BarLabel.types';

interface BarLabelPlotProps {
  processedSeries: ProcessedBarLabelSeriesData;
  className: string;
  /**
   * If `true`, animations are skipped.
   */
  skipAnimation?: boolean;
}

export interface ProcessedBarLabelSeriesData {
  /**
   * The id of the series the element belongs to.
   */
  seriesId: SeriesId;
  data: ProcessedBarLabelData[];
  barLabel?: 'value' | BarLabelFunction;
  barLabelPlacement?: BarSeriesType['barLabelPlacement'];
  /**
   * The orientation of the bar.
   */
  layout?: 'vertical' | 'horizontal';
  xOrigin: number;
  yOrigin: number;
}

export interface ProcessedBarLabelData extends AnimationData {
  /**
   * The id of the series the element belongs to.
   */
  seriesId: SeriesId;
  /**
   * The index of the data point in the series.
   */
  dataIndex: number;
  /**
   * The color of the element.
   */
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

  if (!processedSeries.barLabel) {
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
          barLabel={processedSeries.barLabel}
          barLabelPlacement={processedSeries.barLabelPlacement || 'center'}
        />
      ))}
    </g>
  );
}

export { BarLabelPlot };
