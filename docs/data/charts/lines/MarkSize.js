import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { HighlightedCode } from '@mui/internal-core-docs/HighlightedCode';
import { LineChart, lineClasses } from '@mui/x-charts/LineChart';

const shapes = ['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'];

export default function MarkSize() {
  const [shape, setShape] = React.useState('circle');
  const [radius, setRadius] = React.useState(6);
  const [scale, setScale] = React.useState(1.2);

  const isCircle = shape === 'circle';
  const markStyle = isCircle ? { r: radius } : { scale: `${scale}` };

  const code = `<LineChart
  series={[{ data: [...], showMark: true, shape: '${shape}' }]}
  sx={{
    [\`& .\${lineClasses.mark}\`]: {
      ${isCircle ? `r: ${radius}` : `scale: '${scale}'`},
    },
  }}
/>`;

  return (
    <Box sx={{ p: 2, width: '100%', maxWidth: 600 }}>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', mb: 1 }}>
        <TextField
          select
          label="shape"
          value={shape}
          sx={{ minWidth: 140 }}
          onChange={(event) => setShape(event.target.value)}
        >
          {shapes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Stack sx={{ flex: 1 }}>
          <Typography id="mark-size" gutterBottom>
            {isCircle ? 'radius' : 'scale'}
          </Typography>
          {isCircle ? (
            <Slider
              aria-labelledby="mark-size"
              value={radius}
              onChange={(event, value) => setRadius(value)}
              valueLabelDisplay="auto"
              min={1}
              max={12}
              step={1}
            />
          ) : (
            <Slider
              aria-labelledby="mark-size"
              value={scale}
              onChange={(event, value) => setScale(value)}
              valueLabelDisplay="auto"
              min={0.5}
              max={3}
              step={0.1}
            />
          )}
        </Stack>
      </Stack>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[{ data: [2, 5.5, 2, 8.5, 1.5, 5], showMark: true, shape }]}
        height={250}
        sx={{ [`& .${lineClasses.mark}`]: markStyle }}
      />
      <HighlightedCode code={code} language="tsx" />
    </Box>
  );
}
