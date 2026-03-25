import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import { DateRangePickerDay, dateRangePickerDayClasses } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { PickerDay, pickerDayClasses } from '@mui/x-date-pickers/PickerDay';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

const theme = createTheme({
  components: {
    MuiDateRangePickerDay: {
      styleOverrides: {
        dayOutsideMonth: { color: 'red' },
        fillerCell: { backgroundColor: 'blue' },
        fillerCell: { opacity: 0 },
        selectionStart: { borderRadius: '50%' },
        selectionEnd: { borderRadius: '50%' },
        previewStart: { border: '1px solid black' },
        previewEnd: { border: '1px solid black' },
        insideSelection: { color: 'white' },
        insidePreviewing: { opacity: 0.5 },
        selectionStart: { backgroundColor: 'green' },
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        dayWithoutMargin: { margin: 2 },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        dayWithoutMargin: { margin: 2 },
      },
    },
  },
});

const sx = {
  [`& .${dateRangePickerDayClasses.dayOutsideMonth}`]: { color: 'red' },
  [`& .${dateRangePickerDayClasses.fillerCell}`]: { backgroundColor: 'blue' },
  [`& .${pickerDayClasses.dayWithoutMargin}`]: { margin: 2 },
  [`& .MuiDateRangePickerDay-dayOutsideMonth`]: { color: 'red' },
  [`& .MuiPickerDay-dayWithoutMargin`]: { margin: 2 },
  [`& .MuiPickersDay-dayWithoutMargin`]: { margin: 2 },
  '& .MuiDateRangePickerDay-selectionStart': { borderRadius: 0 },
  [`& .${'MuiPickerDay'}-dayWithoutMargin`]: { margin: 0 },
  [`& .${pickerDayClasses.dayWithoutMargin}`]: { margin: 1 },
};

const cls = `${dateRangePickerDayClasses.dayOutsideMonth}`;
const template = `${prefix}MuiDateRangePickerDay-dayOutsideMonth`;
const complexTemplate = `MuiDateRangePickerDay-${dateRangePickerDayClasses.dayOutsideMonth}`;
const multi = `MuiDateRangePickerDay-dayOutsideMonth MuiDateRangePickerDay-fillerCell`;
