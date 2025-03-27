import { BarChart } from '@mui/x-charts/BarChart';
import * as React from 'react';
import { animated, useSpring } from '@react-spring/web';

export default function ReactSpringAnimationCustomization() {
  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: ['A', 'B', 'C'] }]}
      series={[
        {
          type: 'bar',
          data: [5, 17, 11],
        },
        {
          type: 'bar',
          data: [0, 12, 15],
        },
        {
          type: 'bar',
          data: [1, 3, 9],
        },
      ]}
      width={300}
      height={400}
      barLabel="value"
      slots={{ barLabel: AnimatedBarLabel }}
    />
  );
}

function AnimatedBarLabel(props) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  const style = useSpring({
    from: { y: yOrigin },
    to: { y: y - 4 },
    config: { tension: 100, friction: 10 },
  });

  return (
    <animated.text
      {...otherProps}
      // @ts-ignore
      fill={color}
      x={xOrigin + x + width / 2}
      width={width}
      height={height}
      style={style}
      textAnchor="middle"
    />
  );
}
