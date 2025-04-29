// @ts-nocheck
import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { dayPickerClasses } from '@mui/x-date-pickers/DateCalendar';
// prettier-ignore
import {
  DateRangePicker,
  DateRangePickerSlotsComponentsProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import TextField from '@mui/material/TextField';

const className = dayPickerClasses.root;

<div>
  <DateRangePicker
    componentsProps={{
      layout: {
        sx: {
          width: 50,
        },
      } as DateRangePickerSlotsComponentsProps<any>,
    }}
    components={{
      Layout: test,
    }}
  />
  <DatePicker
    components={{
      Layout: CustomLayout,
    }}
  />
  <TextField
    components={{
      Input: CustomInput,
    }}
  />
</div>;
