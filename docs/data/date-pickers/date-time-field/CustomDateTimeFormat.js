import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

export default function CustomDateTimeFormat() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DateTimeField', 'DateTimeField', 'DateTimeField']}
      >
        <DateTimeField
          label="Format with meridiem"
          defaultValue={dayjs('2022-04-17T15:30')}
          format="L hh:mm a"
        />
        <DateTimeField
          label="Format without meridiem"
          defaultValue={dayjs('2022-04-17T15:30')}
          format="L HH:mm"
        />
        <DateTimeField
          label="Localized format with full letter month"
          defaultValue={dayjs('2022-04-17T15:30')}
          format="LLL"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
