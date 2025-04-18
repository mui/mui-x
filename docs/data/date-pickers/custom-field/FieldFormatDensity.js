import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DemoContainer } from '../_shared/DemoContainer';

export default function FieldFormatDensity() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DateField', 'DateField']}>
        <DateField defaultValue={dayjs('2022-04-17')} />
        <DateField defaultValue={dayjs('2022-04-17')} formatDensity="dense" />
        <DateField defaultValue={dayjs('2022-04-17')} formatDensity="spacious" />
      </DemoContainer>
    </LocalizationProvider>
  );
}
