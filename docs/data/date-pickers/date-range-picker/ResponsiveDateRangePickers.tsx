import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';
import { Unstable_MobileNextDateRangePicker as MobileNextDateRangePicker } from '@mui/x-date-pickers-pro/MobileNextDateRangePicker';
import { Unstable_DesktopNextDateRangePicker as DesktopNextDateRangePicker } from '@mui/x-date-pickers-pro/DesktopNextDateRangePicker';
import { Unstable_StaticNextDateRangePicker as StaticNextDateRangePicker } from '@mui/x-date-pickers-pro/StaticNextDateRangePicker';

export default function ResponsiveDateRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          "NextDateRangePicker",
          "MobileNextDateRangePicker",
          "DesktopNextDateRangePicker",
          "StaticNextDateRangePicker"
        ]}>
        <DemoItem label="Desktop variant" components={["DesktopNextDateRangePicker"]}>
          <DesktopNextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Mobile variant" components={["MobileNextDateRangePicker"]}>
          <MobileNextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Responsive variant" components={["NextDateRangePicker"]}>
          <NextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Static variant" components={["StaticNextDateRangePicker"]}>
          <StaticNextDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
