import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';

export default function CustomTimeFormat() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeField', 'TimeField', 'TimeField']}>
        <TimeField
          label="Format with meridiem"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="hh:mm a"
        />
        <TimeField
          label="Format without meridiem"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="HH:mm"
        />
        <TimeField
          label="Format with seconds"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          format="HH:mm:ss"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
