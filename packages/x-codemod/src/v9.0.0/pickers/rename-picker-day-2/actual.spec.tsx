import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { PickerDay2, PickerDay2Props, pickerDay2Classes } from '@mui/x-date-pickers/PickerDay2';
import { DateRangePickerDay2, DateRangePickerDay2Props, dateRangePickerDay2Classes } from '@mui/x-date-pickers-pro/DateRangePickerDay2';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiPickerDay2: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
    MuiDateRangePickerDay2: {
      styleOverrides: {
        root: {
          backgroundColor: 'blue',
        },
      },
    },
  },
});

function CustomDay(props: PickerDay2Props) {
  return <PickerDay2 {...props} className={pickerDay2Classes.root} />;
}

function CustomRangeDay(props: DateRangePickerDay2Props) {
  return <DateRangePickerDay2 {...props} className={dateRangePickerDay2Classes.root} />;
}

const sx = {
  '& .MuiPickerDay2-root': {
    color: 'green',
  },
  [`& .${'MuiDateRangePickerDay2-root'}`]: {
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
