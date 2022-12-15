import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_TimeField as TimeField } from '@mui/x-date-pickers/TimeField';

export default function CustomTimeFormat() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
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
