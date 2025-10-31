import * as React from 'react';
import { AnimationData } from '../types';
import { BarLabelItem, BarLabelItemProps } from './BarLabelItem';
import { useUtilityClasses } from '../barClasses';
import type { SeriesId } from '../../models/seriesType/common';
import { BarValueType } from '../../models/seriesType/bar';
import { BarRangeValueType } from '../../models/seriesType/barRange';

interface BarLabelPlotProps<V> {
  bars: ProcessedBarSeriesData<V>[];
  skipAnimation?: boolean;
  barLabel?: BarLabelItemProps<V>['barLabel'];
}

export interface ProcessedBarSeriesData<V> {
  seriesId: SeriesId;
  data: ProcessedBarData<V>[];
}

export interface ProcessedBarData<V> extends AnimationData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: V;
  maskId: string;
}

/**
 * @ignore - internal component.
 */
function BarLabelPlot<V extends BarValueType | BarRangeValueType>(props: BarLabelPlotProps<V>) {
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
