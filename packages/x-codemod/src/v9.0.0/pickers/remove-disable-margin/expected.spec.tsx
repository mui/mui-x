import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { PickerDay } from '@mui/x-date-pickers/PickerDay';
import { DateRangePickerDay } from '@mui/x-date-pickers-pro/DateRangePickerDay';

// Direct JSX usage — bare prop (implicit true)
function DirectBare() {
  return (
    <PickerDay day={new Date()} sx={{
      mx: 0,
    }} />
  );
}

// Direct JSX usage — explicit true
function DirectTrue() {
  return (
    <DateRangePickerDay day={new Date()} isHighlighting={false} isEndOfHighlighting={false} isStartOfHighlighting={false} isPreviewing={false} isEndOfPreviewing={false} isStartOfPreviewing={false} sx={{
      mx: 0,
    }} />
  );
}

// Direct JSX usage — explicit false (just remove, no sx needed)
function DirectFalse() {
  return <PickerDay day={new Date()} />;
}

// Direct JSX usage — existing sx prop (merge mx: 0 in)
function DirectWithSx() {
  return (
    <PickerDay
      sx={{
        color: 'red',
        mx: 0,
      }}
      day={new Date()} />
  );
}

// slotProps.day — bare disableMargin in object
function SlotPropsBasic() {
  return (
    <DatePicker slotProps={{ day: { sx: {
      mx: 0,
    } } }} />
  );
}

// slotProps.day — with existing sx
function SlotPropsWithSx() {
  return (
    <DatePicker slotProps={{ day: {
      sx: {
        color: 'red',
        mx: 0,
      },
    } }} />
  );
}

// slotProps.day — false (just remove)
function SlotPropsFalse() {
  return <DateRangePicker slotProps={{ day: {} }} />;
}

// slotProps.day — other slotProps keys unaffected
function SlotPropsOtherKeys() {
  return (
    <DatePicker slotProps={{ day: { sx: {
      mx: 0,
    } }, toolbar: { hidden: true } }} />
  );
}
