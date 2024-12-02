import * as React from 'react';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import { CalendarIcon } from '@mui/x-date-pickers/icons';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { usePickerContext, useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';

function AutocompleteField(props) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { value, timezone, onChange } = internalProps;
  const {
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

  const pickerContext = usePickerContext();
  const handleTogglePicker = (event) => {
    if (pickerContext.open) {
      pickerContext.onClose(event);
    } else {
      pickerContext.onOpen(event);
    }
  };

  const { hasValidationError, getValidationErrorForNewValue } = useValidation({
    validator: validateDate,
    value,
    timezone,
    props: internalProps,
  });

  return (
    <Autocomplete
      {...other}
      options={options}
      ref={pickerContext.triggerRef}
      sx={{ minWidth: 250 }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            error={hasValidationError}
            label={label}
            inputProps={{ ...params.inputProps, ...inputProps }}
            InputProps={{
              ...params.InputProps,
              endAdornment: React.cloneElement(params.InputProps.endAdornment, {
                children: (
                  <React.Fragment>
                    <IconButton onClick={handleTogglePicker} size="small">
                      <CalendarIcon />
                    </IconButton>
                    {params.InputProps.endAdornment?.props.children}
                  </React.Fragment>
                ),
              }),
            }}
          />
        );
      }}
      getOptionLabel={(option) => {
        if (!dayjs.isDayjs(option)) {
          return '';
        }

        return option.format('MM / DD / YYYY');
      }}
      value={value}
      onChange={(_, newValue) => {
        onChange(newValue, {
          validationError: getValidationErrorForNewValue(newValue),
        });
      }}
      isOptionEqualToValue={(option, valueToCheck) =>
        option.toISOString() === valueToCheck.toISOString()
      }
    />
  );
}

function AutocompleteDatePicker(props) {
  const { options, ...other } = props;

  const optionsLookup = React.useMemo(
    () =>
      options.reduce((acc, option) => {
        acc[option.toISOString()] = true;
        return acc;
      }, {}),
    [options],
  );

  return (
    <DatePicker
      slots={{ ...props.slots, field: AutocompleteField }}
      slotProps={{ ...props.slotProps, field: { options } }}
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
