import * as React from 'react';
import { to, useTransition } from '@react-spring/web';
import type { AnimationData, CompletedBarData } from '../types';
import { BarLabel } from './BarLabel';
import { BarLabelFunction } from './types';

const leaveStyle = ({ layout, yOrigin, x, width, y, xOrigin, height }: AnimationData) => ({
  ...(layout === 'vertical'
    ? {
        y: yOrigin,
        x,
        height: 0,
        width,
      }
    : {
        y,
        x: xOrigin,
        height,
        width: 0,
      }),
});

const enterStyle = ({ x, width, y, height }: AnimationData) => ({
  y,
  x,
  height,
  width,
});

type BarLabelPlotProps = {
  bars: CompletedBarData[];
  skipAnimation?: boolean;
  barLabel?: 'value' | BarLabelFunction;
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
        <BarLabel
          seriesId={seriesId}
          dataIndex={dataIndex}
          value={value}
          color={color}
          width={width}
          height={height}
          {...other}
          style={
            {
              ...style,
              x: to([(style as any).x, (style as any).width], (x, w) => (x ?? 0) + w / 2),
              y: to([(style as any).y, (style as any).height], (y, w) => (y ?? 0) + w / 2),
            } as any
          }
        />
      ))}
    </React.Fragment>
  );
}

export { BarLabelPlot };
