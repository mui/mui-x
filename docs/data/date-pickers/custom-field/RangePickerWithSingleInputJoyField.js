import * as React from 'react';

import {
  useTheme as useMaterialTheme,
  useColorScheme as useMaterialColorScheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
} from '@mui/material/styles';
import {
  extendTheme as extendJoyTheme,
  useColorScheme,
  CssVarsProvider,
  THEME_ID,
} from '@mui/joy/styles';
import { useSlotProps } from '@mui/base/utils';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import { DateRangeIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useSingleInputDateRangeField as useSingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { useClearableField } from '@mui/x-date-pickers/hooks';

const joyTheme = extendJoyTheme();

const JoyField = React.forwardRef((props, ref) => {
  const {
    disabled,
    id,
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    endDecorator,
    startDecorator,
    slotProps,
    ...other
  } = props;

  return (
    <FormControl disabled={disabled} id={id} sx={{ minWidth: 350 }} ref={ref}>
      <FormLabel>{label}</FormLabel>
      <Input
        ref={ref}
        disabled={disabled}
        startDecorator={
          <React.Fragment>
            {startAdornment}
            {startDecorator}
          </React.Fragment>
        }
        endDecorator={
          <React.Fragment>
            {endAdornment}
            {endDecorator}
          </React.Fragment>
        }
        slotProps={{
          ...slotProps,
          root: { ...slotProps?.root, ref: containerRef },
        }}
        {...other}
      />
    </FormControl>
  );
});

const JoySingleInputDateRangeField = React.forwardRef((props, ref) => {
  const { slots, slotProps, onAdornmentClick, ...other } = props;

  const { inputRef: externalInputRef, ...textFieldProps } = useSlotProps({
    elementType: FormControl,
    externalSlotProps: slotProps?.textField,
    externalForwardedProps: other,
    ownerState: props,
  });

  const {
    onClear,
    clearable,
    ref: inputRef,
    ...fieldProps
  } = useSingleInputDateRangeField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  /* If you don't need a clear button, you can skip the use of this hook */
  const { InputProps: ProcessedInputProps, fieldProps: processedFieldProps } =
    useClearableField({
      onClear,
      clearable,
      fieldProps,
      InputProps: fieldProps.InputProps,
      slots: { ...slots, clearButton: IconButton },
      slotProps: { ...slotProps, clearIcon: { color: 'action' } },
    });

  return (
    <JoyField
      {...processedFieldProps}
      ref={ref}
      slotProps={{
        input: {
          ref: inputRef,
        },
      }}
      endDecorator={
        <IconButton
          onClick={onAdornmentClick}
          variant="plain"
          color="neutral"
          sx={{ marginLeft: 2.5 }}
        >
          <DateRangeIcon color="action" />
        </IconButton>
      }
      InputProps={{ ...ProcessedInputProps }}
    />
  );
});

JoySingleInputDateRangeField.fieldType = 'single-input';

const JoySingleInputDateRangePicker = React.forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = (event) => {
    // allows toggle behavior
    event.stopPropagation();
    setIsOpen((currentOpen) => !currentOpen);
  };

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  return (
    <DateRangePicker
      {...props}
      ref={ref}
      open={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      slots={{ field: JoySingleInputDateRangeField }}
      slotProps={{
        ...props?.slotProps,
        field: {
          ...props?.slotProps?.field,
          onAdornmentClick: toggleOpen,
        },
      }}
    />
  );
});

/**
 * This component is for syncing the theme mode of this demo with the MUI docs mode.
 * You might not need this component in your project.
 */
function SyncThemeMode({ mode }) {
  const { setMode } = useColorScheme();
  const { setMode: setMaterialMode } = useMaterialColorScheme();
  React.useEffect(() => {
    setMode(mode);
    setMaterialMode(mode);
  }, [mode, setMode, setMaterialMode]);
  return null;
}

export default function RangePickerWithSingleInputJoyField() {
  const materialTheme = useMaterialTheme();
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode mode={materialTheme.palette.mode} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoySingleInputDateRangePicker
            slotProps={{
              field: { clearable: true },
            }}
          />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
