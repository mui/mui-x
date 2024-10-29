import * as React from 'react';

import Button from '@mui/material/Button';
import useForkRef from '@mui/utils/useForkRef';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

const DateRangeButtonField = React.forwardRef((props, ref) => {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref: containerRef } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  const handleRef = useForkRef(ref, containerRef);

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={handleRef}
      aria-label={ariaLabel}
      onClick={() => setOpen?.((prev) => !prev)}
    >
      {label ? `Current date range: ${label}` : 'Pick a date range'}
    </Button>
  );
});

DateRangeButtonField.fieldType = 'single-input';

const ButtonDateRangePicker = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DateRangePicker
      slots={{ field: DateRangeButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } }}
      ref={ref}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
});

export default function DateRangePickerWithButtonField() {
  const [value, setValue] = React.useState([null, null]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ButtonDateRangePicker
        label={
          value[0] === null && value[1] === null
            ? null
            : value
                .map((date) => (date ? date.format('MM/DD/YYYY') : 'null'))
                .join(' - ')
        }
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    </LocalizationProvider>
  );
}
