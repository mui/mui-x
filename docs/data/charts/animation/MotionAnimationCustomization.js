import { LineChart } from '@mui/x-charts/LineChart';
import * as React from 'react';
import { motion } from 'motion/react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const xAxisData = [1, 2, 3, 5, 8, 10];
const lineAnimationDuration = 1.5;

export default function MotionAnimationCustomization() {
  const [key, animate] = React.useReducer((v) => v + 1, 0);
  const [animationType, setAnimationType] = React.useState('progressive');

  const handleChange = (event) => {
    setAnimationType(event.target.value);
  };

  return (
    <Stack alignItems="center">
      <LineChart
        key={`${key}-${animationType}`}
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
            animationType,
          },
          mark: {
            totalPoints: xAxisData.length,
            animationType,
          },
        }}
      />
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="animation-type-label">Animation Type</InputLabel>
          <Select
            labelId="animation-type-label"
            id="animation-type-select"
            value={animationType}
            label="Animation Type"
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

function AnimatedLine({ d, ownerState, skipAnimation, animationType }) {
  if (animationType === 'fadeIn') {
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

function AnimatedMark({
  x,
  y,
  color,
  skipAnimation,
  dataIndex,
  totalPoints,
  animationType,
}) {
  const delay =
    animationType === 'progressive'
      ? ((dataIndex ?? 0) / (totalPoints - 1)) * lineAnimationDuration
      : 0;

  const transition =
    animationType === 'progressive'
      ? { duration: 0.2, delay, ease: 'backOut' }
      : { duration: 0.5, ease: 'easeOut', delay: lineAnimationDuration * 0.2 };

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
