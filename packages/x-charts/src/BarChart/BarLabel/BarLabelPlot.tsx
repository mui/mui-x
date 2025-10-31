import * as React from 'react';
import { AnimationData } from '../types';
import { BarLabelItem, BarLabelItemProps } from './BarLabelItem';
import { useUtilityClasses } from '../barClasses';
import type { SeriesId } from '../../models/seriesType/common';
import { BarValueType } from '../../models/seriesType/bar';
import { BarRangeValueType } from '../../models/seriesType/barRange';

interface BarLabelPlotProps<
  V extends BarValueType | BarRangeValueType | null = BarValueType | null,
> {
  bars: ProcessedBarLabelSeriesData<V>[];
  skipAnimation?: boolean;
  barLabel?: BarLabelItemProps<V | null>['barLabel'];
}

export interface ProcessedBarLabelSeriesData<V> {
  seriesId: SeriesId;
  data: ProcessedBarLabelData<V>[];
}

export interface ProcessedBarLabelData<V> extends AnimationData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: V;
}

/**
 * @ignore - internal component.
 */
function BarLabelPlot<V extends BarValueType | BarRangeValueType | null>(
  props: BarLabelPlotProps<V | null>,
) {
  const { bars, skipAnimation, ...other } = props;
  const classes = useUtilityClasses();

  return (
    <React.Fragment>
      {bars.flatMap(({ seriesId, data }) => (
        <g key={seriesId} className={classes.seriesLabels} data-series={seriesId}>
          {data.map(
            ({ xOrigin, yOrigin, x, y, dataIndex, color, value, width, height, layout }) => (
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
              />
            ),
          )}
        </g>
      ))}
    </React.Fragment>
  );
}

export { BarLabelPlot };
