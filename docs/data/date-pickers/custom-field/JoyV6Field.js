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
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';
import { usePickerContext } from '@mui/x-date-pickers/hooks';

import { CalendarIcon } from '@mui/x-date-pickers/icons';

const joyTheme = extendJoyTheme();

const JoyField = React.forwardRef((props, ref) => {
  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,
    // Should be passed to the button that opens the picker
    openPickerAriaLabel,
    // Can be passed to an icon to clear the value
    clearable,
    onClear,
    // Can be used to render a custom label
    label,
    // Can be used to style the component
    disabled,
    readOnly,
    focused,
    error,
    inputRef,
    // The rest can be passed to the root element
    formControlSx,
    endDecorator,
    slotProps,
    slots,
    ...other
  } = props;

  const pickerContext = usePickerContext();
  const handleTogglePicker = (event) => {
    if (pickerContext.open) {
      pickerContext.onClose(event);
    } else {
      pickerContext.onOpen(event);
    }
  };

  return (
    <FormControl
      sx={[...(Array.isArray(formControlSx) ? formControlSx : [formControlSx])]}
      ref={ref}
    >
      <FormLabel>{label}</FormLabel>
      <Input
        ref={pickerContext.triggerRef}
        disabled={disabled}
        endDecorator={
          <React.Fragment>
            <IconButton
              onClick={handleTogglePicker}
              aria-label={openPickerAriaLabel}
            >
              <CalendarIcon />
            </IconButton>
            {endDecorator}
          </React.Fragment>
        }
        slotProps={{
          ...slotProps,
          input: { ref: inputRef },
        }}
        {...other}
      />
    </FormControl>
  );
});

const JoyDateField = React.forwardRef((props, ref) => {
  const fieldResponse = useDateField({
    ...props,
    enableAccessibleFieldDOMStructure: false,
  });

  return <JoyField ref={ref} {...fieldResponse} />;
});

const JoyDatePicker = React.forwardRef((props, ref) => {
  return (
    <DatePicker
      ref={ref}
      {...props}
      slots={{ ...props.slots, field: JoyDateField }}
      slotProps={{
        ...props.slotProps,
        field: {
          ...props.slotProps?.field,
          formControlSx: {
            flexDirection: 'row',
          },
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

export default function JoyV6Field() {
  const materialTheme = useMaterialTheme();
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode mode={materialTheme.palette.mode} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoyDatePicker
            slotProps={{
              field: { clearable: true },
            }}
          />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
