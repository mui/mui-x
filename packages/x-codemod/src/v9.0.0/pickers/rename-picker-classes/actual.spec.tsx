import { createTheme } from '@mui/material/styles';
import { DateRangePickerDay, dateRangePickerDayClasses } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { PickerDay, pickerDayClasses } from '@mui/x-date-pickers/PickerDay';

const theme = createTheme({
  components: {
    MuiDateRangePickerDay: {
      styleOverrides: {
        outsideCurrentMonth: { color: 'red' },
        hiddenDayFiller: { backgroundColor: 'blue' },
        rangeIntervalDayHighlightStart: { borderRadius: '50%' },
      },
    },
    MuiPickerDay: {
      styleOverrides: {
      },
    },
    MuiPickersDay: {
      styleOverrides: {
      },
    },
  },
});

const sx = {
  [`& .${dateRangePickerDayClasses.outsideCurrentMonth}`]: { color: 'red' },
  [`& .${dateRangePickerDayClasses.hiddenDayFiller}`]: { backgroundColor: 'blue' },
  [`& .MuiDateRangePickerDay-outsideCurrentMonth`]: { color: 'red' },
  ['& .MuiDateRangePickerDay-rangeIntervalDayHighlightStart']: { borderRadius: 0 },
};

const prefix = 'CustomPrefix-';
const cls = `${dateRangePickerDayClasses.outsideCurrentMonth}`;
const template = `${prefix}MuiDateRangePickerDay-outsideCurrentMonth`;
const complexTemplate = `MuiDateRangePickerDay-${dateRangePickerDayClasses.outsideCurrentMonth}`;
const multi = `MuiDateRangePickerDay-outsideCurrentMonth MuiDateRangePickerDay-hiddenDayFiller`;
