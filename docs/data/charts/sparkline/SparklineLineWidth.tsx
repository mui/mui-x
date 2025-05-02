import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { SparkLineChart, SparkLineChartProps } from '@mui/x-charts/SparkLineChart';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';

const values = [8, 7, 9, 0, 0, 5, 20, 20, 7];

const settings = {
  data: values,
  height: 100,
  showHighlight: true,
  showTooltip: true,
} satisfies Partial<SparkLineChartProps>;

export default function SparklineLineWidth() {
  const [strokeWidth, setStrokeWidth] = React.useState<number>(2);
  const [disableClipping, setDisableClipping] = React.useState(false);
  const [clipAreaOffset, setClipAreaOffset] = React.useState<number>(0);

  return (
    <Stack sx={{ width: '100%' }} direction="column" gap={1}>
      <Stack direction="row">
        <FormControlLabel
          checked={disableClipping}
          control={
            <Checkbox
              onChange={(event) => setDisableClipping(event.target.checked)}
            />
          }
          label="Disable Clipping"
          labelPlacement="end"
        />
        <FormControlLabel
          value={strokeWidth}
          control={
            <Slider
              aria-label="Stroke Width"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={5}
              onChange={(event, value) => setStrokeWidth(value)}
            />
          }
          label="Stroke Width"
          labelPlacement="top"
        />

        <FormControlLabel
          value={clipAreaOffset ?? 0}
          control={
            <Slider
              aria-label="Clip Area Offset"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={5}
              onChange={(event, value) => setClipAreaOffset(value)}
            />
          }
          label="Clip Area Offset"
          labelPlacement="top"
        />
      </Stack>

      <Box sx={{ flexGrow: 1 }}>
        <SparkLineChart
          {...settings}
          yAxis={{ min: 0 }}
          disableClipping={disableClipping}
          clipAreaOffset={{
            top: clipAreaOffset,
            bottom: clipAreaOffset,
            left: clipAreaOffset,
            right: clipAreaOffset,
          }}
          slotProps={{
            line: { strokeWidth },
          }}
        />
      </Box>
    </Stack>
  );
}
