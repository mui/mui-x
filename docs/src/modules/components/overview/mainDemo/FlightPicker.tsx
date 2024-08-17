import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function FlightPicker() {
  return (
    <Card variant="outlined" sx={{ flexGrow: 1, padding: 1 }}>
      <Typography variant="subtitle2" sx={{ pb: 2 }}>
        Book your flight
      </Typography>
      <DateRangePicker
        slotProps={{
          textField: ({ position }) => ({
            label: position === 'start' ? 'Outbound' : 'Inbound',
            InputProps: {
              startAdornment: (
                <InputAdornment position="start">
                  {position === 'start' ? <FlightTakeoffIcon /> : <FlightLandIcon />}
                </InputAdornment>
              ),
            },
          }),
        }}
      />
    </Card>
  );
}
