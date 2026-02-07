import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import type { DateRange } from '../types/electricity';

const MIN_DATE = dayjs('2024-01-01');
const MAX_DATE = dayjs('2024-12-31');

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker
        value={value}
        onChange={onChange}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        slotProps={{
          textField: { size: 'small' },
        }}
      />
    </LocalizationProvider>
  );
}
