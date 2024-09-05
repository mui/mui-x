import * as React from 'react';
import Paper from '@mui/material/Paper';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

function CustomPaper(props) {
  return <Paper {...props} />;
}

export default function PaperComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DesktopDatePicker
          label="Desktop variant"
          slots={{
            desktopPaper: CustomPaper,
          }}
        />
        <MobileDatePicker
          label="Mobile variant"
          slotProps={{
            mobilePaper: { sx: { border: '5px red solid' } },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
