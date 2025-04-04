import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

export default function PaperComponentProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DesktopDatePicker
          label="Desktop variant"
          slotProps={{
            desktopPaper: { sx: { border: '5px red solid' } },
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
