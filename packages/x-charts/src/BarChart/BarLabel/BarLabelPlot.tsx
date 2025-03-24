import * as React from 'react';
import type { CompletedBarData } from '../types';
import { BarLabelItem, BarLabelItemProps } from './BarLabelItem';

type BarLabelPlotProps = {
  bars: CompletedBarData[];
  skipAnimation?: boolean;
  barLabel?: BarLabelItemProps['barLabel'];
};

/**
 * @ignore - internal component.
 */
function BarLabelPlot(props: BarLabelPlotProps) {
  const { bars, skipAnimation, ...other } = props;

  return (
    <React.Fragment>
      {bars.map(({ x, y, seriesId, dataIndex, color, value, width, height, layout }) => (
        <BarLabelItem
          key={`${seriesId}-${dataIndex}`}
          seriesId={seriesId}
          dataIndex={dataIndex}
          value={value}
          color={color}
          x={x}
          y={y}
          width={width}
          height={height}
          skipAnimation={skipAnimation ?? false}
          layout={layout ?? 'vertical'}
          {...other}
        />
      ))}
    </React.Fragment>
  );
}

export { BarLabelPlot };
