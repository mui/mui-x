import * as React from 'react';
import type { ProcessedBarSeriesData } from '../types';
import { BarLabelItem, BarLabelItemProps } from './BarLabelItem';
import { useUtilityClasses } from '../barClasses';

type BarLabelPlotProps = {
  bars: ProcessedBarSeriesData[];
  skipAnimation?: boolean;
  barLabel?: BarLabelItemProps['barLabel'];
};

/**
 * @ignore - internal component.
 */
function BarLabelPlot(props: BarLabelPlotProps) {
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
