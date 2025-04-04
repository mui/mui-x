import * as React from 'react';
import {
  ThemeProvider,
  createTheme,
  useColorScheme as useMaterialColorScheme,
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
import { createSvgIcon } from '@mui/joy/utils';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';
import { usePickerContext } from '@mui/x-date-pickers/hooks';

const CalendarIcon = createSvgIcon(
  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />,
  'Calendar',
);

const ClearIcon = createSvgIcon(
  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
  'Clear',
);

const joyTheme = extendJoyTheme();

function JoyDateField(props) {
  const fieldResponse = useDateField(props);

  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,
    // Should be passed to the button that opens the picker
    openPickerAriaLabel,
    // Can be passed to the button that clears the value
    onClear,
    clearable,
    // Can be used to style the component
    disabled,
    readOnly,
    error,
    inputRef,
    // The rest can be passed to the root element
    id,
    value,
    ...other
  } = fieldResponse;

  const pickerContext = usePickerContext();

  return (
    <FormControl disabled={disabled} id={id} ref={pickerContext.rootRef}>
      <FormLabel>{pickerContext.label}</FormLabel>
      <Input
        disabled={disabled}
        endDecorator={
          <React.Fragment>
            {clearable && value && (
              <IconButton
                title="Clear"
                tabIndex={-1}
                onClick={onClear}
                sx={{ marginRight: 0.5 }}
              >
                <ClearIcon size="md" />
              </IconButton>
            )}
            <IconButton
              onClick={() => pickerContext.setOpen((prev) => !prev)}
              aria-label={openPickerAriaLabel}
            >
              <CalendarIcon size="md" />
            </IconButton>
          </React.Fragment>
        }
        slotProps={{
          input: { ref: inputRef },
        }}
        {...other}
        value={value}
        ref={pickerContext.triggerRef}
      />
    </FormControl>
  );
}

function JoyDatePicker(props) {
  return (
    <DatePicker
      {...props}
      enableAccessibleFieldDOMStructure={false}
      slots={{ ...props.slots, field: JoyDateField }}
    />
  );
}

/**
 * This component is for syncing the theme mode of this demo with the MUI docs mode.
 * You might not need this component in your project.
 */
function SyncThemeMode() {
  const { setMode } = useColorScheme();
  const { mode } = useMaterialColorScheme();
  React.useEffect(() => {
    if (mode) {
      setMode(mode);
    }
  }, [mode, setMode]);
  return null;
}

const theme = createTheme({ colorSchemes: { light: true, dark: true } });

export default function JoyV6Field() {
  return (
    <ThemeProvider theme={theme}>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoyDatePicker
            slotProps={{
              field: { clearable: true },
            }}
          />
        </LocalizationProvider>
      </CssVarsProvider>
    </ThemeProvider>
  );
}
