import { createTheme } from '@mui/material/styles';
import { DateRangePickerDay, dateRangePickerDayClasses } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { PickerDay, pickerDayClasses } from '@mui/x-date-pickers/PickerDay';

const theme = createTheme({
  components: {
    MuiDateRangePickerDay: {
      styleOverrides: {
        dayOutsideMonth: { color: 'red' },
        fillerCell: { backgroundColor: 'blue' },

        selectionStart: {
          borderRadius: '50%',
          color: 'white',
        },

        selectionEnd: { borderRadius: '50%' },

        previewStart: {
          opacity: 0.5,
          color: 'blue',
        },

        previewEnd: { opacity: 0.5 },
        insideSelection: { backgroundColor: 'gray' },
        insidePreviewing: { border: '1px dashed blue' },
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        dayOutsideMonth: { color: 'red' },
      },
    },
  },
});

const sx = {
  [`& .${dateRangePickerDayClasses.dayOutsideMonth}`]: { color: 'red' },
  [`& .${dateRangePickerDayClasses.fillerCell}`]: { backgroundColor: 'blue' },
  [`& .MuiDateRangePickerDay-dayOutsideMonth`]: { color: 'red' },
  ['& .MuiDateRangePickerDay-selectionStart']: { borderRadius: 0 },
  ['& .MuiDateRangePickerDay-selectionEnd']: { borderRadius: 0 },
  ['& .MuiDateRangePickerDay-insideSelection']: { backgroundColor: 'transparent' },
};

const pickerDaySx = {
  [`& .${pickerDayClasses.dayOutsideMonth}`]: { color: 'red' },
};

const pickersDaySx = {
  [`& .${pickerDayClasses.dayOutsideMonth}`]: { color: 'red' },
};

const prefix = 'CustomPrefix-';
const cls = `${dateRangePickerDayClasses.dayOutsideMonth}`;
const template = `${prefix}MuiDateRangePickerDay-dayOutsideMonth`;
const complexTemplate = `MuiDateRangePickerDay-${dateRangePickerDayClasses.dayOutsideMonth}`;
const multi = `MuiDateRangePickerDay-dayOutsideMonth MuiDateRangePickerDay-fillerCell`;
