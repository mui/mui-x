import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';

export default function ViewsDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <NextDatePicker
          label="Year only"
          views={['year']}
          defaultValue={dayjs('2022-04-07')}
        />
        <NextDatePicker
          label="Year and Month"
          views={['year', 'month']}
          defaultValue={dayjs('2022-04-07')}
        />
        <NextDatePicker
          label="Year, month and date"
          openTo="year"
          views={['year', 'month', 'day']}
          defaultValue={dayjs('2022-04-07')}
        />
        <NextDatePicker
          label="Invert the order of views"
          views={['day', 'month', 'year']}
          defaultValue={dayjs('2022-04-07')}
        />
        <NextDatePicker label="Just date" views={['day']} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
