import * as React from 'react';
import { useTransition } from '@react-spring/web';
import type { AnimationData, CompletedBarData } from '../types';
import { BarLabelItem, BarLabelItemProps } from './BarLabelItem';

const leaveStyle = ({ layout, yOrigin, x, width, y, xOrigin, height }: AnimationData) => ({
  ...(layout === 'vertical'
    ? {
        y: yOrigin,
        x: x + width / 2,
        height: 0,
        width,
      }
    : {
        y: y + height / 2,
        x: xOrigin,
        height,
        width: 0,
      }),
});

const enterStyle = ({ x, width, y, height }: AnimationData) => ({
  x: x + width / 2,
  y: y + height / 2,
  height,
  width,
});

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
