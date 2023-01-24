import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

export default function ResponsiveDateTimePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimePicker',
          'MobileDateTimePicker',
          'DesktopDateTimePicker',
          'StaticDateTimePicker',
        ]}
      >
        <DemoItem label="Desktop variant" components={['DesktopDateTimePicker']}>
          <DesktopDateTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Mobile variant" components={['MobileDateTimePicker']}>
          <MobileDateTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Responsive variant" components={['DateTimePicker']}>
          <DateTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Static variant" components={['StaticDateTimePicker']}>
          <StaticDateTimePicker defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
