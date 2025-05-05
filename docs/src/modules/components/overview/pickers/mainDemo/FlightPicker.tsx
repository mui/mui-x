import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { FieldOwnerState } from '@mui/x-date-pickers/models';

export default function FlightPicker() {
  return (
    <Card variant="outlined" sx={{ flexGrow: 1, padding: 1 }}>
      {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
      <Typography variant="subtitle2" sx={{ pb: 2 }}>
        Book your flight
      </Typography>
      <DateRangePicker
        slots={{ field: MultiInputDateRangeField }}
        slotProps={{
          textField: ({ position }: FieldOwnerState & { position?: 'start' | 'end' }) => ({
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
