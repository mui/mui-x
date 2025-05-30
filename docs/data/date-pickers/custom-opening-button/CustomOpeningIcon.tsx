import * as React from 'react';
import { createSvgIcon } from '@mui/material/utils';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '../_shared/DemoContainer';

const FlightLandIcon = createSvgIcon(
  <path d="M2.5 19h19v2h-19v-2zm16.84-3.15c.8.21 1.62-.26 1.84-1.06.21-.8-.26-1.62-1.06-1.84l-5.31-1.42-2.76-9.02L10.12 2v8.28L5.15 8.95l-.93-2.32-1.45-.39v5.17l16.57 4.44z" />,
  'FlightLandIcon',
);

function MuiIcon() {
  return <img src="/static/logo.svg" alt="Date picker opening icon" width={32} />;
}

export default function CustomOpeningIcon() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
        <DatePicker
          label="Departure"
          // Using an SVG component from `@mui/icons-material`
          slots={{ openPickerIcon: FlightTakeoffIcon }}
        />
        <DatePicker
          label="Arrival"
          // Using a custom SVG component
          slots={{ openPickerIcon: FlightLandIcon }}
        />
        <DatePicker
          label="New release date"
          // Using an img component
          slots={{ openPickerIcon: MuiIcon }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
