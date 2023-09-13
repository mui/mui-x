import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { MobileTimeRangePicker } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';
import { DesktopTimeRangePicker } from '@mui/x-date-pickers-pro/DesktopTimeRangePicker';
// import { StaticTimeRangePicker } from '@mui/x-date-pickers-pro/StaticTimeRangePicker';
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout';

export default function ResponsiveTimeRangePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'TimeRangePicker',
          'MobileTimeRangePicker',
          'DesktopDateRangePicker',
          'StaticTimeRangePicker',
        ]}
      >
        <DemoItem label="Desktop variant" component="DesktopDateRangePicker">
          <DesktopTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Mobile variant" component="MobileDateRangePicker">
          <MobileTimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
          />
        </DemoItem>
        <DemoItem label="Responsive variant" component="DateRangePicker">
          <TimeRangePicker
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
          />
        </DemoItem>
        {/* <DemoItem label="Static variant" component="StaticDateRangePicker"> */}
        {/*   <StaticTimeRangePicker */}
        {/*     defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]} */}
        {/*     sx={{ */}
        {/*       [`.${pickersLayoutClasses.contentWrapper}`]: { */}
        {/*         alignItems: 'center', */}
        {/*       }, */}
        {/*     }} */}
        {/*   /> */}
        {/* </DemoItem> */}
      </DemoContainer>
    </LocalizationProvider>
  );
}
