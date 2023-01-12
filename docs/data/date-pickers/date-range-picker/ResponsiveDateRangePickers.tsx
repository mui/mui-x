import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from 'docsx/src/modules/components/DemoContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';
import { Unstable_MobileNextDateRangePicker as MobileNextDateRangePicker } from '@mui/x-date-pickers-pro/MobileNextDateRangePicker';
import { Unstable_DesktopNextDateRangePicker as DesktopNextDateRangePicker } from '@mui/x-date-pickers-pro/DesktopNextDateRangePicker';
import { Unstable_StaticNextDateRangePicker as StaticNextDateRangePicker } from '@mui/x-date-pickers-pro/StaticNextDateRangePicker';

export default function ResponsiveDateRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="Desktop variant">
          <DesktopNextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Mobile variant">
          <MobileNextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Responsive variant">
          <NextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Static variant">
          <StaticNextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
