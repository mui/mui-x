import { createTheme } from '@mui/material/styles';
import { DateRangePickerDay, dateRangePickerDayClasses } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { PickerDay, pickerDayClasses } from '@mui/x-date-pickers/PickerDay';

const theme = createTheme({
  components: {
    MuiDateRangePickerDay: {
      styleOverrides: {
        dayOutsideMonth: { color: 'red' },
        fillerCell: { backgroundColor: 'blue' },
        selectionStart: { borderRadius: '50%' },
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
  [`& .${dateRangePickerDayClasses.dayOutsideMonth}`]: { color: 'red' },
  [`& .${dateRangePickerDayClasses.fillerCell}`]: { backgroundColor: 'blue' },
  [`& .MuiDateRangePickerDay-dayOutsideMonth`]: { color: 'red' },
  ['& .MuiDateRangePickerDay-selectionStart']: { borderRadius: 0 },
};

const prefix = 'CustomPrefix-';
const cls = `${dateRangePickerDayClasses.dayOutsideMonth}`;
const template = `${prefix}MuiDateRangePickerDay-dayOutsideMonth`;
const complexTemplate = `MuiDateRangePickerDay-${dateRangePickerDayClasses.dayOutsideMonth}`;
const multi = `MuiDateRangePickerDay-dayOutsideMonth MuiDateRangePickerDay-fillerCell`;
