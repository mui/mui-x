// @ts-nocheck
import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { dayCalendarClasses } from '@mui/x-date-pickers/DateCalendar';
// prettier-ignore
import {
  DateRangePicker,
  DateRangePickerSlotProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import TextField from '@mui/material/TextField';

const className = dayCalendarClasses.root;

<div>
  <DateRangePicker
    slotProps={{
      layout: {
        sx: {
          width: 50,
        },
      } as DateRangePickerSlotProps<any>,
    }}
    slots={{
      layout: test,
    }}
  />
  <DatePicker
    slots={{
      layout: CustomLayout,
    }}
  />
  <TextField
    components={{
      Input: CustomInput,
    }}
  />
</div>;
