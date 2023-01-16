import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';

export default function TimeClockValue() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="Uncontrolled clock" content="TimeClock">
          <TimeClock defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Controlled clock" content="TimeClock">
          <TimeClock value={value} onChange={(newValue) => setValue(newValue)} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
