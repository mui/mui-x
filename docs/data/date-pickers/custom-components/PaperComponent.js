import * as React from 'react';
import Paper from '@mui/material/Paper';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const CustomPaper = React.forwardRef(function CustomPaper(props, ref) {
  // @ts-ignore
  const { ownerState, ...other } = props;

  return <Paper {...other} ref={ref} elevation={2} square />;
});

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
          slots={{ mobilePaper: CustomPaper }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
