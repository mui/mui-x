import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function SelectTimeFrequency({
  tickFrequencies,
  timeOrdinalTicks,
  setTimeOrdinalTicks,
  tickNumber,
  setTickNumber,
}) {
  return (
    <Box sx={{ m: 3 }}>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">Select tick frequencies</FormLabel>
        <FormGroup row>
          {tickFrequencies.map((label) => {
            const checked = timeOrdinalTicks[label];
            const handleChange = (event) => {
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
      </Typography>

      <Slider
        value={tickNumber}
        onChange={(_, value) => setTickNumber(value)}
        min={1}
        max={15}
        aria-labelledby="tick-number-slider"
        valueLabelDisplay="auto"
        sx={{ maxWidth: 200 }}
      />
    </Box>
  );
}
