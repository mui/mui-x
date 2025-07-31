import {
  LineChart,
  type AnimatedLineProps,
  type MarkElementProps,
} from '@mui/x-charts/LineChart';
import * as React from 'react';
import { motion } from 'motion/react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function MotionAnimationCustomization() {
  const [key, animate] = React.useReducer((v) => v + 1, 0);

  return (
    <Stack>
      <LineChart
        key={key}
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            curve: 'linear',
          },
          {
            data: [3, 4, 6, 7, 9, 11],
            curve: 'linear',
          },
        ]}
        width={500}
        height={300}
        skipAnimation
        slots={{
          line: AnimatedLine,
          mark: AnimatedMark,
        }}
      />
      <Button onClick={() => animate()}>Run Animation</Button>
    </Stack>
  );
}

function AnimatedLine({ d, ownerState, skipAnimation }: AnimatedLineProps) {
  const animationProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: skipAnimation ? 0 : 1.5,
      ease: 'easeInOut',
    },
  } as const;

  return (
    <motion.path
      d={d}
      fill="transparent"
      stroke={ownerState.color}
      {...(skipAnimation ? {} : animationProps)}
    />
  );
}

function AnimatedMark({ x, y, color, skipAnimation }: MarkElementProps) {
  const animationProps = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      duration: 1,
      delay: 0.5,
      ease: 'backOut',
    },
  } as const;

  return (
    <motion.circle
      cx={x}
      cy={y}
      r={5}
      fill={color}
      {...(skipAnimation ? {} : animationProps)}
      onAnimationStart={() => console.log('Animation started')}
    />
  );
}
