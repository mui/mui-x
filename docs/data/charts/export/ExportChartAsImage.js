import * as React from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { useChartProApiRef } from '@mui/x-charts-pro/hooks';

function ExportParamsSelector({ apiRef }) {
  const [type, setType] = React.useState('image/png');
  const [rawQuality, setRawQuality] = React.useState('0.9');
  const quality = Math.max(0, Math.min(1, Number.parseFloat(rawQuality)));

  return (
    <Stack justifyContent="space-between" gap={2} sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <FormLabel id="image-format-radio-buttons-group-label">
          Image Format
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="image-format-radio-buttons-group-label"
          name="image-format"
          value={type}
          onChange={(event) => setType(event.target.value)}
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
      <div>
        <Button
          onClick={() => apiRef.current.exportAsImage({ type, quality })}
          variant="contained"
        >
          Export Image
        </Button>
      </div>
    </Stack>
  );
}

export default function ExportChartAsImage() {
  const apiRef = useChartProApiRef();

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
