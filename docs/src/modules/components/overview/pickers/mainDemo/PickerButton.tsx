import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { DatePicker, DatePickerFieldProps } from '@mui/x-date-pickers/DatePicker';
import { DateFieldProps } from '@mui/x-date-pickers/DateField';
import { useParsedFormat, usePickerContext, useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';

function ButtonDateField(
  props: DatePickerFieldProps & Pick<DateFieldProps, 'slots' | 'slotProps' | 'inputRef'>,
) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  // `slots`, `slotProps` and `inputRef` target the default text field, not a `<button>`.
  const { slots, slotProps, inputRef, ...buttonProps } = forwardedProps;

  const pickerContext = usePickerContext();

  const parsedFormat = useParsedFormat();
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    props: internalProps,
  });

  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  return (
    <Button
      {...buttonProps}
      variant="outlined"
      size="small"
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={[
        { minWidth: 'fit-content' },
        ...(Array.isArray(pickerContext.rootSx) ? pickerContext.rootSx : [pickerContext.rootSx]),
      ]}
      fullWidth
      color={hasValidationError ? 'error' : 'primary'}
      ref={pickerContext.triggerRef}
      className={pickerContext.rootClassName}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ? `${pickerContext.label}: ${valueStr}` : valueStr}
    </Button>
  );
}

export default function PickerButton() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2023-04-17'));

  return (
    <Card variant="outlined" sx={{ padding: 1 }}>
      <DatePicker
        value={value}
        format="MMM DD, YYYY"
        onChange={(newValue) => setValue(newValue)}
        slots={{ field: ButtonDateField }}
        slotProps={{
          nextIconButton: { size: 'small' },
          previousIconButton: { size: 'small' },
        }}
        views={['day', 'month', 'year']}
      />
    </Card>
  );
}
