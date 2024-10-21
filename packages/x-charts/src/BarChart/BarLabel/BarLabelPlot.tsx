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

  const barLabelTransition = useTransition(bars, {
    keys: (bar) => `${bar.seriesId}-${bar.dataIndex}`,
    from: leaveStyle,
    leave: null,
    enter: enterStyle,
    update: enterStyle,
    immediate: skipAnimation,
  });

  return (
    <React.Fragment>
      {barLabelTransition((style, { seriesId, dataIndex, color, value, width, height }) => (
        <BarLabelItem
          seriesId={seriesId}
          dataIndex={dataIndex}
          value={value}
          color={color}
          width={width}
          height={height}
          {...other}
          style={style}
        />
      ))}
    </React.Fragment>
  );
}

export { BarLabelPlot };
