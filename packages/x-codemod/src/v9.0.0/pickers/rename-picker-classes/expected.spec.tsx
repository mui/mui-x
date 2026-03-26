import { createTheme } from '@mui/material/styles';
import {
  DateRangePickerDay,
  dateRangePickerDayClasses,
} from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { PickerDay, pickerDayClasses } from '@mui/x-date-pickers/PickerDay';

const theme = createTheme({
  components: {
    MuiDateRangePickerDay: {
      styleOverrides: {
        dayOutsideMonth: { opacity: 0.6 },
        fillerCell: { opacity: 0 },
        selectionStart: { borderRadius: '50%' },
        selectionEnd: { borderRadius: '50%' },
        previewStart: { border: '1px solid black' },
        previewEnd: { border: '1px solid black' },
        insideSelection: { color: 'white' },
        insidePreviewing: { opacity: 0.5 },
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        dayWithoutMargin: { margin: 0 },
      },
    },
  },
});

const sx = {
  [`& .${dateRangePickerDayClasses.dayOutsideMonth}`]: { opacity: 0.6 },
  [`& .${dateRangePickerDayClasses.fillerCell}`]: { opacity: 0 },
  [`& .${pickerDayClasses.dayWithoutMargin}`]: { margin: 0 },
  [`& .MuiDateRangePickerDay-dayOutsideMonth`]: { opacity: 0.6 },
  [`& .MuiPickerDay-dayWithoutMargin`]: { margin: 0 },
  ['& .MuiDateRangePickerDay-selectionStart']: { borderRadius: 0 },
};

const prefix = 'CustomPrefix-';
const cls = `${dateRangePickerDayClasses.dayOutsideMonth}`;
const template = `${prefix}MuiDateRangePickerDay-dayOutsideMonth`;
const complexTemplate = `MuiDateRangePickerDay-${dateRangePickerDayClasses.dayOutsideMonth}`;
const multi = `MuiDateRangePickerDay-dayOutsideMonth MuiDateRangePickerDay-fillerCell`;
