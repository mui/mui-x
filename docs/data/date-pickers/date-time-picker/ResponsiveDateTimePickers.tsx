import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_MobileNextDateTimePicker as MobileNextDateTimePicker } from '@mui/x-date-pickers/MobileNextDateTimePicker';
import { Unstable_DesktopNextDateTimePicker as DesktopNextDateTimePicker } from '@mui/x-date-pickers/DesktopNextDateTimePicker';

export default function ResponsiveDateTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <MobileNextDateTimePicker
          label="For mobile"
          defaultValue={dayjs('2022-04-07T15:30')}
        />
        <DesktopNextDateTimePicker
          label="For desktop"
          defaultValue={dayjs('2022-04-07T15:30')}
        />
        <NextDateTimePicker
          label="Responsive"
          defaultValue={dayjs('2022-04-07T15:30')}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
