import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DemoContainer } from '../_shared/DemoContainer';

export default function CustomDateFormat() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DateField']}>
        <DateField
          label="Dash separator"
          defaultValue={dayjs('2022-04-17')}
          format="MM-DD-YYYY"
        />
        <DateField
          label="Full letter month"
          defaultValue={dayjs('2022-04-17')}
          format="LL"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
