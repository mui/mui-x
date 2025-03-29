import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function ResponsivePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DatePicker', 'DesktopDatePicker', 'MobileDatePicker']}
      >
        <DemoItem label="Responsive variant">
          <DatePicker defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
        <DemoItem label="Desktop variant">
          <DesktopDatePicker defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
        <DemoItem label="Mobile variant">
          <MobileDatePicker defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
