import {
  LineChart,
  type AnimatedLineProps,
  type MarkElementProps,
} from '@mui/x-charts/LineChart';
import * as React from 'react';
import { motion } from 'motion/react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const xAxisData = [1, 2, 3, 5, 8, 10];
const lineAnimationDuration = 1.5;

type AnimationStyle = 'progressive' | 'fadeIn';

export default function MotionAnimationCustomization() {
  const [key, animate] = React.useReducer((v) => v + 1, 0);
  const [animationStyle, setAnimationStyle] =
    React.useState<AnimationStyle>('progressive');

  const handleChange = (event: SelectChangeEvent<AnimationStyle>) => {
    setAnimationStyle(event.target.value as AnimationStyle);
  };

  return (
    <Stack alignItems="center">
      <LineChart
        key={`${key}-${animationStyle}`}
        xAxis={[{ data: xAxisData, scaleType: 'point' }]}
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
        slots={{
          line: AnimatedLine,
          mark: AnimatedMark,
        }}
        slotProps={{
          line: {
            animationStyle,
          } as CustomLineProps,
          mark: {
            totalPoints: xAxisData.length,
            animationStyle,
          } as CustomMarkElementProps,
        }}
      />
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="animation-type-label">Animation Style</InputLabel>
          <Select
            labelId="animation-type-label"
            id="animation-type-select"
            value={animationStyle}
            label="Animation Style"
            onChange={handleChange}
          >
            <MenuItem value="progressive">Progressive</MenuItem>
            <MenuItem value="fadeIn">Fade In</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={() => animate()}>Run Animation</Button>
      </Stack>
    </Stack>
  );
}

interface CustomLineProps extends AnimatedLineProps {
  animationStyle?: AnimationStyle;
}

function AnimatedLine({
  d,
  ownerState,
  skipAnimation,
  animationStyle = 'progressive',
}: CustomLineProps) {
  if (animationStyle === 'fadeIn') {
    return (
      <motion.path
        d={d}
        fill="transparent"
        stroke={ownerState.color}
        strokeWidth={2}
        initial={{ opacity: skipAnimation ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: lineAnimationDuration, ease: 'easeInOut' }}
      />
    );
  }

  return (
    <motion.path
      d={d}
      fill="transparent"
      stroke={ownerState.color}
      strokeWidth={2}
      initial={{
        pathLength: skipAnimation ? 1 : 0,
      }}
      animate={{ pathLength: 1 }}
      transition={{ duration: lineAnimationDuration, ease: 'linear' }}
    />
  );
}

interface CustomMarkElementProps extends MarkElementProps {
  totalPoints: number;
  animationStyle?: AnimationStyle;
}

function AnimatedMark({
  x,
  y,
  color,
  skipAnimation,
  dataIndex,
  totalPoints,
  animationStyle = 'progressive',
}: CustomMarkElementProps) {
  const delay =
    animationStyle === 'progressive'
      ? ((dataIndex ?? 0) / (totalPoints - 1)) * lineAnimationDuration
      : 0;

  const transition =
    animationStyle === 'progressive'
      ? { duration: 0.2, delay, ease: 'backOut' as const }
      : {
          duration: 0.5,
          ease: 'easeOut' as const,
          delay: lineAnimationDuration * 0.2,
        };

  return (
    <motion.circle
      cx={x}
      cy={y}
      r={5}
      fill={color}
      initial={{
        scale: skipAnimation ? 1 : 0,
        opacity: skipAnimation ? 1 : 0,
      }}
      animate={{ scale: 1, opacity: 1 }}
      transition={transition}
    />
  );
}
