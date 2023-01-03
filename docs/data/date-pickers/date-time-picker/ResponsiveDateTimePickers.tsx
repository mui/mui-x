import * as React from 'react';
import dayjs from 'dayjs';
import {DemoContainer, DemoItem} from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_MobileNextDateTimePicker as MobileNextDateTimePicker } from '@mui/x-date-pickers/MobileNextDateTimePicker';
import { Unstable_DesktopNextDateTimePicker as DesktopNextDateTimePicker } from '@mui/x-date-pickers/DesktopNextDateTimePicker';
import { Unstable_StaticNextDateTimePicker as StaticNextDateTimePicker } from '@mui/x-date-pickers/StaticNextDateTimePicker'

export default function ResponsiveDateTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="Desktop variant">
          <DesktopNextDateTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Mobile variant">
          <MobileNextDateTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Responsive variant">
          <NextDateTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Static variant">
          <StaticNextDateTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
