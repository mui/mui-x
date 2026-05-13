import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { PickerDay, PickerDayProps, pickerDayClasses } from '@mui/x-date-pickers/PickerDay';
import { DateRangePickerDay, DateRangePickerDayProps, dateRangePickerDayClasses } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiPickerDay: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
    MuiDateRangePickerDay: {
      styleOverrides: {
        root: {
          backgroundColor: 'blue',
        },
      },
    },
  },
});

function CustomDay(props: PickerDayProps) {
  return <PickerDay {...props} className={pickerDayClasses.root} />;
}

function CustomRangeDay(props: DateRangePickerDayProps) {
  return <DateRangePickerDay {...props} className={dateRangePickerDayClasses.root} />;
}

const sx = {
  '& .MuiPickerDay-root': {
    color: 'green',
  },
  [`& .${'MuiDateRangePickerDay-root'}`]: {
    color: 'yellow',
  }
};

function App() {
  return (
    <div>
      <DatePicker slots={{ day: CustomDay }} />
      <DateRangePicker slots={{ day: CustomRangeDay }} />
    </div>
  );
}
