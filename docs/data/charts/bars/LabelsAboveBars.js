import * as React from 'react';
import { animated, to } from '@react-spring/web';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { styled } from '@mui/material/styles';

export default function LabelsAboveBars() {
  return (
    <ChartContainer
      xAxis={[{ scaleType: 'band', data: ['A', 'B', 'C'] }]}
      series={[
        {
          type: 'bar',
          id: 'base',
          data: [5, 17, 11],
        },
      ]}
      width={300}
      height={400}
    >
      <BarPlot barLabel="value" slots={{ barLabel: BarLabel }} />
      <ChartsXAxis />
      <ChartsYAxis />
    </ChartContainer>
  );
}

const Text = styled(animated('text'))(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
}));

function BarLabel({ className, style, children }) {
  const translateY = -8;
  const pathY = to(
    [style.y, style.height],
    (y, height) => y - height / 2 + translateY,
  );

  return (
    <Text className={className} style={{ x: style?.x, y: pathY }}>
      {children}
    </Text>
  );
}
