import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { MobileDateTimeRangePicker } from '@mui/x-date-pickers-pro/MobileDateTimeRangePicker';
import { DesktopDateTimeRangePicker } from '@mui/x-date-pickers-pro/DesktopDateTimeRangePicker';

export default function ResponsiveDateTimeRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimeRangePicker',
          'MobileDateTimeRangePicker',
          'DesktopDateTimeRangePicker',
        ]}
      >
        <DemoItem label="Desktop variant" component="DesktopDateTimeRangePicker">
          <DesktopDateTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-21T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Mobile variant" component="MobileDateTimeRangePicker">
          <MobileDateTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-21T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Responsive variant" component="DateTimeRangePicker">
          <DateTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-21T18:30')]}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
