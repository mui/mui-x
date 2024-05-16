import * as React from 'react';

import { to, useTransition } from '@react-spring/web';
import type { CompletedBarData } from './BarPlot';
import { BarElementLabel } from './BarElementLabel';

const getOutStyle = ({ layout, yOrigin, x, width, y, xOrigin, height }: CompletedBarData) => ({
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

const getInStyle = ({ x, width, y, height }: CompletedBarData) => ({
  y,
  x,
  height,
  width,
});

type BarElementLabelPlotProps = {
  bars: CompletedBarData[];
  skipAnimation?: boolean;
};

/**
 * @ignore - internal component.
 */
function BarElementLabelPlot(props: BarElementLabelPlotProps) {
  const { bars, skipAnimation, ...other } = props;

  const barLabelTransition = useTransition(bars, {
    keys: (bar) => `${bar.seriesId}-${bar.dataIndex}`,
    from: getOutStyle,
    leave: null,
    enter: getInStyle,
    update: getInStyle,
    immediate: skipAnimation,
  });

  return (
    <React.Fragment>
      {barLabelTransition((style, { seriesId, dataIndex, color, value, width, height }) => (
        <BarElementLabel
          seriesId={seriesId}
          dataIndex={dataIndex}
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
          labelText={value ? value.toString() : null}
        />
      ))}
    </React.Fragment>
  );
}

export { BarElementLabelPlot };
