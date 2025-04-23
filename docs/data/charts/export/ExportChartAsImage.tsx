import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { ChartProApi } from '@mui/x-charts-pro/ChartContainerPro';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';

function ExportParamsSelector({
  apiRef,
}: {
  apiRef: React.RefObject<ChartProApi | undefined>;
}) {
  const [type, setType] = React.useState('image/png');
  const [rawQuality, setRawQuality] = React.useState('0.9');
  const quality = Math.max(0, Math.min(1, Number.parseFloat(rawQuality)));

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
      sx={{ width: '100%' }}
    >
      <FormControl fullWidth>
        <FormLabel id="image-format-radio-buttons-group-label">
          Image Format
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="image-format-radio-buttons-group-label"
          name="image-format"
          value={type}
          onChange={(event) =>
            setType(event.target.value as 'image/png' | 'image/jpeg' | 'image/webp')
          }
        >
          <FormControlLabel
            value="image/png"
            control={<Radio />}
            label="image/png"
          />
          <FormControlLabel
            value="image/jpeg"
            control={<Radio />}
            label="image/jpeg"
          />
          <FormControlLabel
            value="image/webp"
            control={<Radio />}
            label="image/webp"
          />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <TextField
          label="Quality"
          value={rawQuality}
          onChange={(event) => setRawQuality(event.target.value)}
          disabled={type === 'image/png'}
          helperText="Only applicable to lossy formats."
        />
      </FormControl>
      <Button
        variant="outlined"
        onClick={() => apiRef.current?.exportAsImage({ type, quality })}
      >
        Export Image
      </Button>
    </Stack>
  );
}

export default function ExportChartAsImage() {
  const apiRef = React.useRef<ChartProApi>(undefined);

  return (
    <Stack width="100%" gap={2}>
      <LineChartPro
        apiRef={apiRef}
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          { data: [4, 9, 1, 4, 9, 6], label: 'Series A' },
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            area: true,
            label: 'Series B',
          },
        ]}
        height={300}
        grid={{ vertical: true, horizontal: true }}
      />
      <ExportParamsSelector apiRef={apiRef} />
    </Stack>
  );
}
