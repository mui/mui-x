import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { pickersLayoutClasses } from '@mui/x-date-pickers';

export default function ResponsiveDateRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="Desktop variant">
          <DesktopDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Mobile variant">
          <MobileDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Responsive variant">
          <DateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label="Static variant">
          <StaticDateRangePicker
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
            sx={{
              [`.${pickersLayoutClasses.contentWrapper}`]: {
                alignItems: 'center',
              },
            }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
