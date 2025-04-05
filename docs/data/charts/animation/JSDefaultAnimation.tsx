import { BarChart, BarLabelProps } from '@mui/x-charts/BarChart';
import * as React from 'react';
import { useAnimateBarLabel } from '@mui/x-charts/hooks';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export default function JSDefaultAnimation() {
  const [key, animate] = React.useReducer((v) => v + 1, 0);

  return (
    <Stack>
      <BarChart
        key={key}
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
      <Button onClick={() => animate()}>Run Animation</Button>
    </Stack>
  );
}

const Text = styled('text')(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
}));

function AnimatedBarLabel(props: BarLabelProps) {
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
    height,
    layout,
    skipAnimation,
  });

  return (
    <Text
      {...otherProps}
      textAnchor="middle"
      dominantBaseline="central"
      {...animatedProps}
    />
  );
}
