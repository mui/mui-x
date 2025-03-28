import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { DemoContainer, DemoItem } from '../_shared/DemoContainer';

export default function TimeClockValue() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimeClock', 'TimeClock']}>
        <DemoItem label="Uncontrolled clock">
          <TimeClock defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Controlled clock">
          <TimeClock value={value} onChange={(newValue) => setValue(newValue)} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
