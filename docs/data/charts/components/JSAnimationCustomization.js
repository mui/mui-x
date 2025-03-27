import { BarChart } from '@mui/x-charts/BarChart';
import * as React from 'react';
import { useAnimateBarLabel } from '@mui/x-charts/hooks';

export default function JSAnimationCustomization() {
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

  const animatedProps = useAnimateBarLabel({
    xOrigin,
    x,
    yOrigin,
    y,
    width,
    height: -8,
    layout,
    skipAnimation,
  });

  return (
    <text {...otherProps} fill={color} textAnchor="middle" {...animatedProps} />
  );
}
