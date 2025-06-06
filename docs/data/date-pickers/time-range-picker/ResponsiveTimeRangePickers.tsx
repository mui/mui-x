import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { MobileTimeRangePicker } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';
import { DesktopTimeRangePicker } from '@mui/x-date-pickers-pro/DesktopTimeRangePicker';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function ResponsiveTimeRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'TimeRangePicker',
          'MobileTimeRangePicker',
          'DesktopTimeRangePicker',
        ]}
      >
        <DemoItem label="Desktop variant" component="DesktopTimeRangePicker">
          <DesktopTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Mobile variant" component="MobileTimeRangePicker">
          <MobileTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Responsive variant" component="TimeRangePicker">
          <TimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
