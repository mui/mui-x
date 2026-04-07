// @ts-nocheck
import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { PickerDay, PickerDayProps, pickerDayClasses } from '@mui/x-date-pickers/PickerDay';
import {
  DateRangePickerDay,
  DateRangePickerDayProps,
  dateRangePickerDayClasses,
} from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { createTheme } from '@mui/material/styles';

// Use this space to add tests that touch multiple codemods in the preset-safe package
// It is important to ensure that the codemods don't conflict with each other
// For example, if one codemod changes a prop name, another codemod modifying its value should work too.
// Don't hesitate to add props on existing components.

// rename-field-ref
function FieldRefUsage() {
  const fieldRef = React.useRef(null);
  return (
    <div>
      <DateField fieldRef={fieldRef} />
      <DatePicker slotProps={{ field: { fieldRef: fieldRef } }} />
      <DateRangePicker slotProps={{ field: { fieldRef: fieldRef } }} />
    </div>
  );
}

// rename-pickers-day + theme component name
const theme1 = createTheme({
  components: {
    MuiPickerDay: {
      styleOverrides: {
        root: { color: 'red' },
      },
    },
  },
});

function OldPickersDay(props: PickerDayProps) {
  return <PickerDay {...props} className={pickerDayClasses.root} />;
}

// rename-picker-day-2 + theme component name
const theme2 = createTheme({
  components: {
    MuiDateRangePickerDay: {
      styleOverrides: {
        root: { backgroundColor: 'green' },
      },
    },
  },
});

function CustomRangeDay2(props: DateRangePickerDayProps) {
  return <DateRangePickerDay {...props} className={dateRangePickerDayClasses.root} />;
}

// remove-picker-day-2
function RemoveDay2Slot() {
  return <DateRangePicker />;
}

// rename-picker-classes
const classesSx = {
  [`& .MuiDateRangePickerDay-dayOutsideMonth`]: { color: 'red' },
  ['& .MuiDateRangePickerDay-selectionStart']: { borderRadius: 0 },
  ['& .MuiDateRangePickerDay-insideSelection']: { backgroundColor: 'transparent' },
};

// remove-disable-margin
// prettier-ignore
function DisableMarginUsage() {
  return (
    <PickerDay
      day={new Date()}
      sx={{
        '--PickerDay-horizontalMargin': 0,
      }}
    />
  );
}

// remove-enable-accessible-field-dom-structure inside slotProps.field
function SlotPropsFieldUsage() {
  return (
    <DatePicker slotProps={{ field: {
      format: 'MM/DD/YYYY',
    } }} />
  );
}

function App() {
  const fieldRef = React.useRef(null);
  return (
    <div>
      <DatePicker slotProps={{ field: { fieldRef: fieldRef } }} />
    </div>
  );
}
