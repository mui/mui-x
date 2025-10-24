import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { motion } from 'motion/react';

const singleSeriesData = [2400, 1398, -9800, 3908, 4800, -3800, 4300];

const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

const series = [{ data: singleSeriesData, label: 'pv', id: 'pvId' }];

function AnimatedBar({ x, y, height, width, color, dataIndex, ...other }) {
  if (dataIndex === undefined) {
    return (
      <rect x={x} y={y} height={height} width={width} fill={color} {...other} />
    );
  }

  const isNegative = series[0].data[dataIndex] < 0;
  const barHeight = height ?? 0;
  const barY = y ?? 0;

  return (
    <motion.rect
      {...other}
      x={x}
      width={width}
      fill={color}
      initial={{
        height: 0,
        y: isNegative ? barY : barY + barHeight,
      }}
      animate={{
        height: barHeight,
        y: barY,
      }}
      transition={{
        duration: 0.8,
        ease: 'easeInOut',
        delay: dataIndex * 0.25,
      }}
    />
  );
}

export default function MotionAnimationBarChart() {
  const [key, animate] = React.useReducer((v) => v + 1, 0);

  return (
    <Stack sx={{ width: '100%', height: '100%' }} alignItems="center" spacing={2}>
      <Box sx={{ width: '100%', height: 400 }}>
        <BarChart
          key={key}
          series={series}
          xAxis={[{ data: xLabels, scaleType: 'band' }]}
          yAxis={[{ width: 60 }]}
          slots={{
            bar: AnimatedBar,
          }}
        />
      </Box>
      <Button onClick={animate}>Run Animation</Button>
    </Stack>
  );
}
