import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';

export default function CustomTimeFormat() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeField', 'TimeField', 'TimeField']}>
        <TimeField
          label="Format with meridiem"
          defaultValue={dayjs('2022-04-17T15:30')}
          format="hh:mm a"
        />
        <TimeField
          label="Format without meridiem"
          defaultValue={dayjs('2022-04-17T15:30')}
          format="HH:mm"
        />
        <TimeField
          label="Format with seconds"
          defaultValue={dayjs('2022-04-17T15:30')}
          format="HH:mm:ss"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
