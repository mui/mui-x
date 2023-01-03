import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_MobileNextDatePicker as MobileNextDatePicker } from '@mui/x-date-pickers/MobileNextDatePicker';
import { Unstable_DesktopNextDatePicker as DesktopNextDatePicker } from '@mui/x-date-pickers/DesktopNextDatePicker';

export default function ResponsiveDatePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <MobileNextDatePicker
          label="For mobile"
          defaultValue={dayjs('2022-04-07')}
        />
        <DesktopNextDatePicker
          label="For desktop"
          defaultValue={dayjs('2022-04-07')}
        />
        <NextDatePicker label="Responsive" defaultValue={dayjs('2022-04-07')} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
