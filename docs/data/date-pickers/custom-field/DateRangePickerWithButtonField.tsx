import * as React from 'react';
import { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import useForkRef from '@mui/utils/useForkRef';
import { DateRange, FieldType } from '@mui/x-date-pickers-pro/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DateRangePicker,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeFieldProps } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

interface DateRangeButtonFieldProps extends SingleInputDateRangeFieldProps<Dayjs> {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

type DateRangeButtonFieldComponent = ((
  props: DateRangeButtonFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { fieldType?: FieldType };

const DateRangeButtonField = React.forwardRef(
  (props: DateRangeButtonFieldProps, ref: React.Ref<HTMLElement>) => {
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
  },
) as DateRangeButtonFieldComponent;

DateRangeButtonField.fieldType = 'single-input';

const ButtonDateRangePicker = React.forwardRef(
  (
    props: Omit<DateRangePickerProps<Dayjs>, 'open' | 'onOpen' | 'onClose'>,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const [open, setOpen] = React.useState(false);

    return (
      <DateRangePicker
        slots={{ field: DateRangeButtonField, ...props.slots }}
        slotProps={{ field: { setOpen } as any }}
        ref={ref}
        {...props}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      />
    );
  },
);

export default function DateRangePickerWithButtonField() {
  const [value, setValue] = React.useState<DateRange<Dayjs>>([null, null]);

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
