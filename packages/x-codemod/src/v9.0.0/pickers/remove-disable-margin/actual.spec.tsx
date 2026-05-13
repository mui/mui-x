// @ts-nocheck
import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { PickerDay } from '@mui/x-date-pickers/PickerDay';
import { DateRangePickerDay } from '@mui/x-date-pickers-pro/DateRangePickerDay';

// Direct JSX usage — bare prop (implicit true)
// prettier-ignore
function DirectBare() {
  return (
    <PickerDay
      day={new Date()}
      disableMargin
    />
  );
}

// Direct JSX usage — explicit true
function DirectTrue() {
  return (
    <DateRangePickerDay
      disableMargin={true}
      day={new Date()}
      isHighlighting={false}
      isEndOfHighlighting={false}
      isStartOfHighlighting={false}
      isPreviewing={false}
      isEndOfPreviewing={false}
      isStartOfPreviewing={false}
    />
  );
}

// Direct JSX usage — explicit false (just remove, no sx needed)
function DirectFalse() {
  return <PickerDay disableMargin={false} day={new Date()} />;
}

// Direct JSX usage — existing sx prop (merge mx: 0 in)
// prettier-ignore
function DirectWithSx() {
  return (
    <PickerDay
      day={new Date()}
      disableMargin
      sx={{ color: 'red' }}
    />
  );
}

// slotProps.day — bare disableMargin in object
// prettier-ignore
function SlotPropsBasic() {
  return (
    <DatePicker
      slotProps={{
        day: { disableMargin: true },
      }}
    />
  );
}

// slotProps.day — with existing sx
function SlotPropsWithSx() {
  return (
    <DatePicker
      slotProps={{
        day: { disableMargin: true, sx: { color: 'red' } },
      }}
    />
  );
}

// slotProps.day — false (just remove)
function SlotPropsFalse() {
  return (
    <DateRangePicker
      slotProps={{
        day: { disableMargin: false },
      }}
    />
  );
}

// slotProps.day — other slotProps keys unaffected
// prettier-ignore
function SlotPropsOtherKeys() {
  return (
    <DatePicker
      slotProps={{
        day: { disableMargin: true },
        toolbar: { hidden: true },
      }}
    />
  );
}
