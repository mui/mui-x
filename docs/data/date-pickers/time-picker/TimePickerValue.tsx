import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/demo/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';

export default function TimePickerValue() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <NextTimePicker
          label="Uncontrolled picker"
          defaultValue={dayjs('2022-04-07T15:30')}
        />
        <NextTimePicker
          label="Controlled picker"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
