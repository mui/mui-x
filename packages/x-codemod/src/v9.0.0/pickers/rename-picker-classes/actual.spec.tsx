import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import { DateRangePickerDay, dateRangePickerDayClasses } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { PickerDay, pickerDayClasses } from '@mui/x-date-pickers/PickerDay';
import { PickersDay, pickersDayClasses } from '@mui/x-date-pickers/PickersDay';

const theme = createTheme({
  components: {
    MuiDateRangePickerDay: {
      styleOverrides: {
        outsideCurrentMonth: { color: 'red' },
        hiddenDayFiller: { backgroundColor: 'blue' },
        hiddenDaySpacingFiller: { opacity: 0 },
        rangeIntervalDayHighlightStart: { borderRadius: '50%' },
        rangeIntervalDayHighlightEnd: { borderRadius: '50%' },
        rangeIntervalDayPreviewStart: { border: '1px solid black' },
        rangeIntervalDayPreviewEnd: { border: '1px solid black' },
        dayInsideRangeInterval: { color: 'white' },
        rangeIntervalPreview: { opacity: 0.5 },
        rangeIntervalDayHighlight: { backgroundColor: 'green' },
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        dayWithMargin: { margin: 2 },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        dayWithMargin: { margin: 2 },
      },
    },
  },
});

const sx = {
  [`& .${dateRangePickerDayClasses.outsideCurrentMonth}`]: { color: 'red' },
  [`& .${dateRangePickerDayClasses.hiddenDayFiller}`]: { backgroundColor: 'blue' },
  [`& .${pickerDayClasses.dayWithMargin}`]: { margin: 2 },
  [`& .MuiDateRangePickerDay-outsideCurrentMonth`]: { color: 'red' },
  [`& .MuiPickerDay-dayWithMargin`]: { margin: 2 },
  [`& .MuiPickersDay-dayWithMargin`]: { margin: 2 },
  '& .MuiDateRangePickerDay-rangeIntervalDayHighlightStart': { borderRadius: 0 },
  [`& .${'MuiPickerDay'}-dayWithMargin`]: { margin: 0 },
  [`& .${pickersDayClasses.dayWithMargin}`]: { margin: 1 },
};

const cls = `${dateRangePickerDayClasses.outsideCurrentMonth}`;
const template = `${prefix}MuiDateRangePickerDay-outsideCurrentMonth`;
const complexTemplate = `MuiDateRangePickerDay-${dateRangePickerDayClasses.outsideCurrentMonth}`;
const multi = `MuiDateRangePickerDay-outsideCurrentMonth MuiDateRangePickerDay-hiddenDayFiller`;
