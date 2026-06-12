import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import type { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import type { DateRange as DateRangeValue } from '@mui/x-date-pickers-pro/models';
import type { Dayjs } from 'dayjs';
import type { DateRange } from '../types/electricity';

const MIN_DATE = dayjs('2024-01-01');
const MAX_DATE = dayjs('2024-12-31');

const shortcuts: PickersShortcutsItem<DateRangeValue<Dayjs>>[] = [
  { label: 'Q1 2024', getValue: () => [dayjs('2024-01-01'), dayjs('2024-03-31')] },
  { label: 'Q2 2024', getValue: () => [dayjs('2024-04-01'), dayjs('2024-06-30')] },
  { label: 'Q3 2024', getValue: () => [dayjs('2024-07-01'), dayjs('2024-09-30')] },
  { label: 'Q4 2024', getValue: () => [dayjs('2024-10-01'), dayjs('2024-12-31')] },
  { label: 'Full Year', getValue: () => [MIN_DATE, MAX_DATE] },
];

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
          shortcuts: { items: shortcuts },
        }}
      />
    </LocalizationProvider>
  );
}
