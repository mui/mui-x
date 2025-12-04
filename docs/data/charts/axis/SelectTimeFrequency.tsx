import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import { TickFrequency } from '@mui/x-charts/models';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function SelectTimeFrequency({
  tickFrequencies,
  timeOrdinalTicks,
  setTimeOrdinalTicks,
  tickNumber,
  setTickNumber,
}: {
  tickFrequencies: TickFrequency[];
  timeOrdinalTicks: Record<TickFrequency, boolean>;
  setTimeOrdinalTicks: React.Dispatch<
    React.SetStateAction<Record<TickFrequency, boolean>>
  >;
  tickNumber: number;
  setTickNumber: React.Dispatch<React.SetStateAction<number>>;
}) {
  const selectedFrequenciesNumber = Object.values(timeOrdinalTicks).filter(
    (value) => value,
  ).length;

  return (
    <Box sx={{ m: 3 }}>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">Select tick frequencies</FormLabel>
        <FormGroup row>
          {tickFrequencies.map((label) => {
            const checked = timeOrdinalTicks[label as keyof typeof timeOrdinalTicks];
            const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
              setTimeOrdinalTicks((prev) => ({
                ...prev,
                [event.target.name]: event.target.checked,
              }));
            };

            return (
              <FormControlLabel
                key={label}
                control={
                  <Checkbox checked={checked} onChange={handleChange} name={label} />
                }
                label={label}
              />
            );
          })}
        </FormGroup>
      </FormControl>
      <Typography id="tick-number-slider" gutterBottom>
        Select tick number
        {selectedFrequenciesNumber <= 1
          ? ' (disabled when less than 2 frequencies are selected)'
          : ''}
      </Typography>

      <Slider
        value={tickNumber}
        onChange={(_, value) => setTickNumber(value as number)}
        min={1}
        max={25}
        aria-labelledby="tick-number-slider"
        valueLabelDisplay="auto"
        sx={{ maxWidth: 200 }}
        disabled={selectedFrequenciesNumber <= 1}
      />
    </Box>
  );
}
