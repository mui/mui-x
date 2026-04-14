// @ts-nocheck
import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { PickersDay, PickersDayProps, pickersDayClasses } from '@mui/x-date-pickers/PickersDay';
import {
  DateRangePickerDay2,
  DateRangePickerDay2Props,
  dateRangePickerDay2Classes,
} from '@mui/x-date-pickers-pro/DateRangePickerDay2';
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
      <DateField unstableFieldRef={fieldRef} />
      <DatePicker
        slotProps={{ field: { unstableFieldRef: fieldRef } }}
        enableAccessibleFieldDOMStructure={false}
      />
      <DateRangePicker
        slotProps={{ field: { unstableFieldRef: fieldRef } }}
        enableAccessibleFieldDOMStructure={false}
      />
    </div>
  );
}

// rename-pickers-day + theme component name
const theme1 = createTheme({
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: { color: 'red' },
      },
    },
  },
});

function OldPickersDay(props: PickersDayProps) {
  return <PickersDay {...props} className={pickersDayClasses.root} />;
}

// rename-picker-day-2 + theme component name
const theme2 = createTheme({
  components: {
    MuiDateRangePickerDay2: {
      styleOverrides: {
        root: { backgroundColor: 'green' },
      },
    },
  },
});

function CustomRangeDay2(props: DateRangePickerDay2Props) {
  return <DateRangePickerDay2 {...props} className={dateRangePickerDay2Classes.root} />;
}

// remove-picker-day-2
function RemoveDay2Slot() {
  return <DateRangePicker slots={{ day: DateRangePickerDay2 }} />;
}

// rename-picker-classes
const classesSx = {
  [`& .MuiDateRangePickerDay-outsideCurrentMonth`]: { color: 'red' },
  ['& .MuiDateRangePickerDay-rangeIntervalDayHighlightStart']: { borderRadius: 0 },
  ['& .MuiDateRangePickerDay-dayInsideRangeInterval']: { backgroundColor: 'transparent' },
};

// remove-disable-margin
// prettier-ignore
function DisableMarginUsage() {
  return (
    <PickersDay
      disableMargin
      day={new Date()}
    />
  );
}

// remove-enable-accessible-field-dom-structure inside slotProps.field
function SlotPropsFieldUsage() {
  return (
    <DatePicker slotProps={{ field: { enableAccessibleFieldDOMStructure: false, format: 'MM/DD/YYYY' } }} />
  );
}

function App() {
  const fieldRef = React.useRef(null);
  return (
    <div>
      <DatePicker slotProps={{ field: { unstableFieldRef: fieldRef } }} />
    </div>
  );
}

// migrate-text-field-props
function LegacyTextFieldProps() {
  return (
    <div>
      <DateField
        InputProps={{ name: 'birthday' }}
        inputProps={{ 'data-testid': 'html-input' }}
      />
      <DatePicker
        slotProps={{
          textField: { InputProps: { name: 'date' } },
        }}
      />
    </div>
  );
}
