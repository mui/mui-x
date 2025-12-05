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
  ordinalTimeTicks,
  setOrdinalTimeTicks,
  tickNumber,
  setTickNumber,
}) {
  const selectedFrequenciesNumber = Object.values(ordinalTimeTicks).filter(
    (value) => value,
  ).length;

  return (
    <Box sx={{ m: 3 }}>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">Select tick frequencies</FormLabel>
        <FormGroup row>
          {tickFrequencies.map((label) => {
            const checked = ordinalTimeTicks[label];
            const handleChange = (event) => {
              setOrdinalTimeTicks((prev) => ({
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
        onChange={(_, value) => setTickNumber(value)}
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
