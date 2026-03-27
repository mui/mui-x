import { createTheme } from '@mui/material/styles';
import { DateRangePickerDay, dateRangePickerDayClasses } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { PickerDay, pickerDayClasses } from '@mui/x-date-pickers/PickerDay';
import { pickersDayClasses } from '@mui/x-date-pickers';

const theme = createTheme({
  components: {
    MuiDateRangePickerDay: {
      styleOverrides: {
        outsideCurrentMonth: { color: 'red' },
        hiddenDayFiller: { backgroundColor: 'blue' },
        rangeIntervalDayHighlightStart: { borderRadius: '50%' },
        rangeIntervalDayHighlightEnd: { borderRadius: '50%' },
        rangeIntervalDayPreviewStart: { opacity: 0.5 },
        rangeIntervalDayPreviewEnd: { opacity: 0.5 },
        dayInsideRangeInterval: { backgroundColor: 'gray' },
        rangeIntervalPreview: { border: '1px dashed blue' },
        rangeIntervalDayHighlight: { color: 'white' },
        rangeIntervalDayPreview: { color: 'blue' },
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        outsideCurrentMonth: { color: 'red' },
      },
    },
  },
});

const sx = {
  [`& .${dateRangePickerDayClasses.outsideCurrentMonth}`]: { color: 'red' },
  [`& .${dateRangePickerDayClasses.hiddenDayFiller}`]: { backgroundColor: 'blue' },
  [`& .MuiDateRangePickerDay-outsideCurrentMonth`]: { color: 'red' },
  ['& .MuiDateRangePickerDay-rangeIntervalDayHighlightStart']: { borderRadius: 0 },
  ['& .MuiDateRangePickerDay-rangeIntervalDayHighlightEnd']: { borderRadius: 0 },
  ['& .MuiDateRangePickerDay-dayInsideRangeInterval']: { backgroundColor: 'transparent' },
};

const pickerDaySx = {
  [`& .${pickerDayClasses.outsideCurrentMonth}`]: { color: 'red' },
};

const pickersDaySx = {
  [`& .${pickersDayClasses.outsideCurrentMonth}`]: { color: 'red' },
};

const prefix = 'CustomPrefix-';
const cls = `${dateRangePickerDayClasses.outsideCurrentMonth}`;
const template = `${prefix}MuiDateRangePickerDay-outsideCurrentMonth`;
const complexTemplate = `MuiDateRangePickerDay-${dateRangePickerDayClasses.outsideCurrentMonth}`;
const multi = `MuiDateRangePickerDay-outsideCurrentMonth MuiDateRangePickerDay-hiddenDayFiller`;
// Unrelated strings that happen to contain class names should not be modified
const unrelated = 'outsideCurrentMonth is a calendar concept';
const unrelatedTemplate = `The day is outsideCurrentMonth or dayInsideRangeInterval`;
