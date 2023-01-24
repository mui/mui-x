import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_MobileNextDatePicker as MobileNextDatePicker } from '@mui/x-date-pickers/MobileNextDatePicker';
import { Unstable_DesktopNextDatePicker as DesktopNextDatePicker } from '@mui/x-date-pickers/DesktopNextDatePicker';
import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers';

export default function ResponsiveDatePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          "NextDatePicker",
          "MobileNextDatePicker",
          "DesktopNextDatePicker",
          "StaticNextDatePicker"
        ]}>
        <DemoItem label="Desktop variant" components={["DesktopNextDatePicker"]}>
          <DesktopNextDatePicker defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label="Mobile variant" components={["MobileNextDatePicker"]}>
          <MobileNextDatePicker defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label="Responsive variant" components={["NextDatePicker"]}>
          <NextDatePicker defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label="Static variant" components={["StaticNextDatePicker"]}>
          <StaticNextDatePicker defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
