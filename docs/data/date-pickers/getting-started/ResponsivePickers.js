import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_MobileNextDatePicker as MobileNextDatePicker } from '@mui/x-date-pickers/MobileNextDatePicker';
import { Unstable_DesktopNextDatePicker as DesktopNextDatePicker } from '@mui/x-date-pickers/DesktopNextDatePicker';

export default function ResponsivePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="Desktop variant">
          <DesktopNextDatePicker defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label="Mobile variant">
          <MobileNextDatePicker defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label="Responsive variant">
          <NextDatePicker defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
