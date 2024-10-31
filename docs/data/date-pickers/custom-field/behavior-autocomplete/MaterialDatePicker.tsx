import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  DatePicker,
  DatePickerFieldProps,
  DatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';

interface AutocompleteFieldProps extends DatePickerFieldProps {
  /**
   * @typescript-to-proptypes-ignore
   */
  options?: Dayjs[];
}

function AutocompleteField(props: AutocompleteFieldProps) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { value, timezone, onChange } = internalProps;
  const {
    InputProps,
    slotProps,
    slots,
    ownerState,
    label,
    focused,
    name,
    options = [],
    inputProps,
    ...other
  } = forwardedProps;

  const { hasValidationError } = useValidation({
    validator: validateDate,
    value,
    timezone,
    props: internalProps,
  });

  const mergeAdornments = (...adornments: React.ReactNode[]) => {
    const nonNullAdornments = adornments.filter((el) => el != null);
    if (nonNullAdornments.length === 0) {
      return null;
    }

    if (nonNullAdornments.length === 1) {
      return nonNullAdornments[0];
    }

    return (
      <Stack direction="row">
        {nonNullAdornments.map((adornment, index) => (
          <React.Fragment key={index}>{adornment}</React.Fragment>
        ))}
      </Stack>
    );
  };

  return (
    <Autocomplete
      {...other}
      options={options}
      ref={InputProps?.ref}
      sx={{ minWidth: 250 }}
      renderInput={(params) => (
        <TextField
          {...params}
          error={hasValidationError}
          label={label}
          inputProps={{ ...params.inputProps, ...inputProps }}
          InputProps={{
            ...params.InputProps,
            startAdornment: mergeAdornments(
              InputProps?.startAdornment,
              params.InputProps.startAdornment,
            ),
            endAdornment: mergeAdornments(
              InputProps?.endAdornment,
              params.InputProps.endAdornment,
            ),
          }}
        />
      )}
      getOptionLabel={(option) => {
        if (!dayjs.isDayjs(option)) {
          return '';
        }

        return option.format('MM / DD / YYYY');
      }}
      value={value}
      onChange={(_, newValue) => {
        onChange?.(newValue, { validationError: null });
      }}
      isOptionEqualToValue={(option, valueToCheck) =>
        option.toISOString() === valueToCheck.toISOString()
      }
    />
  );
}

interface AutocompleteDatePickerProps extends DatePickerProps {
  /**
   * @typescript-to-proptypes-ignore
   */
  options: Dayjs[];
}

function AutocompleteDatePicker(props: AutocompleteDatePickerProps) {
  const { options, ...other } = props;

  const optionsLookup = React.useMemo(
    () =>
      options.reduce(
        (acc, option) => {
          acc[option.toISOString()] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    [options],
  );

  return (
    <DatePicker
      slots={{ ...props.slots, field: AutocompleteField }}
      slotProps={{ ...props.slotProps, field: { options } as any }}
      shouldDisableDate={(date) => !optionsLookup[date.startOf('day').toISOString()]}
      {...other}
    />
  );
}

const today = dayjs().startOf('day');

export default function MaterialDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AutocompleteDatePicker
        label="Pick a date"
        options={[
          today,
          today.add(1, 'day'),
          today.add(4, 'day'),
          today.add(5, 'day'),
        ]}
      />
    </LocalizationProvider>
  );
}
