import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_MobileNextTimePicker as MobileNextTimePicker } from '@mui/x-date-pickers/MobileNextTimePicker';
import { Unstable_DesktopNextTimePicker as DesktopNextTimePicker } from '@mui/x-date-pickers/DesktopNextTimePicker';

export default function ResponsiveTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <MobileNextTimePicker
          label="For mobile"
          defaultValue={dayjs('2022-04-07T15:30')}
        />
        <DesktopNextTimePicker
          label="For desktop"
          defaultValue={dayjs('2022-04-07T15:30')}
        />
        <NextTimePicker
          label="Responsive"
          defaultValue={dayjs('2022-04-07T15:30')}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
