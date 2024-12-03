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
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';

const joyTheme = extendJoyTheme();

const JoyField = React.forwardRef((props, ref) => {
  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,
    // Can be passed to the button that clears the value
    clearable,
    onClear,
    disabled,
    id,
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    endDecorator,
    startDecorator,
    inputRef,
    slots,
    slotProps,
    ...other
  } = props;

  return (
    <FormControl disabled={disabled} id={id} ref={ref}>
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
          root: { ref: containerRef },
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
          <JoyDatePicker />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
