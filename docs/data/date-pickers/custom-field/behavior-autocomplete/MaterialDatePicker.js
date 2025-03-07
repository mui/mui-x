import * as React from 'react';
import dayjs from 'dayjs';
import useForkRef from '@mui/utils/useForkRef';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import { CalendarIcon } from '@mui/x-date-pickers/icons';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  usePickerContext,
  usePickerTranslations,
  useSplitFieldProps,
} from '@mui/x-date-pickers/hooks';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';

function AutocompleteField(props) {
  const { forwardedProps, internalProps } = useSplitFieldProps(props, 'date');
  const pickerContext = usePickerContext();
  const pickerTranslations = usePickerTranslations();
  const { options = [], ...other } = forwardedProps;
  const { value, setValue, timezone } = pickerContext;

  const { hasValidationError, getValidationErrorForNewValue } = useValidation({
    validator: validateDate,
    value,
    timezone,
    props: internalProps,
  });

  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);

  const formattedValue = value ? value.format('ll') : null;
  const openPickerAriaLabel =
    pickerTranslations.openDatePickerDialogue(formattedValue);

  return (
    <Autocomplete
      {...other}
      options={options}
      ref={handleRef}
      className={pickerContext.rootClassName}
      sx={[
        { minWidth: 250 },
        ...(Array.isArray(pickerContext.rootSx)
          ? pickerContext.rootSx
          : [pickerContext.rootSx]),
      ]}
      renderInput={(params) => {
        const endAdornment = params.InputProps.endAdornment;
        return (
          <TextField
            {...params}
            error={hasValidationError}
            focused={pickerContext.open}
            label={pickerContext.label}
            name={pickerContext.name}
            InputProps={{
              ...params.InputProps,
              endAdornment: React.cloneElement(endAdornment, {
                children: (
                  <React.Fragment>
                    <IconButton
                      onClick={() => pickerContext.setOpen((prev) => !prev)}
                      aria-label={openPickerAriaLabel}
                      size="small"
                    >
                      <CalendarIcon />
                    </IconButton>
                    {endAdornment.props.children}
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

        return option.format('MM/DD/YYYY');
      }}
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue, {
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
