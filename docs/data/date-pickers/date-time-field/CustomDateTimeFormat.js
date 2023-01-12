import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/demo/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_DateTimeField as DateTimeField } from '@mui/x-date-pickers/DateTimeField';

export default function CustomDateTimeFormat() {
  const [value, setValue] = React.useState(dayjs('2022-04-07T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DateTimeField
          label="Format with meridiem"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="L hh:mm a"
        />
        <DateTimeField
          label="Format without meridiem"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="L HH:mm"
        />
        <DateTimeField
          label="Localized format with full letter month"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="LLL"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
