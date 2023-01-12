import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/demo/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';

export default function DateTimePickerValue() {
  const [value, setValue] = React.useState(dayjs('2022-04-07T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <NextDateTimePicker
          label="Uncontrolled picker"
          defaultValue={dayjs('2022-04-07T15:30')}
        />
        <NextDateTimePicker
          label="Controlled picker"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
