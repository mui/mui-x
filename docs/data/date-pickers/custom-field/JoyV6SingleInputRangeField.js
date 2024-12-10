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
import { createSvgIcon } from '@mui/joy/utils';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useSingleInputDateRangeField as useSingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export const DateRangeIcon = createSvgIcon(
  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />,
  'DateRange',
);

const joyTheme = extendJoyTheme();

const JoySingleInputDateRangeField = React.forwardRef((props, ref) => {
  const fieldResponse = useSingleInputDateRangeField({
    ...props,
    enableAccessibleFieldDOMStructure: false,
  });

  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,
    // Can be passed to the button that clears the value
    onClear,
    clearable,
    disabled,
    id,
    label,
    InputProps: { ref: containerRef } = {},
    inputRef,
    slots,
    slotProps,
    ...other
  } = fieldResponse;

  return (
    <FormControl
      disabled={disabled}
      id={id}
      ref={ref}
      style={{
        minWidth: 300,
      }}
    >
      <FormLabel>{label}</FormLabel>
      <Input
        ref={containerRef}
        disabled={disabled}
        endDecorator={<DateRangeIcon size="md" />}
        slotProps={{
          input: { ref: inputRef },
        }}
        {...other}
      />
    </FormControl>
  );
});

JoySingleInputDateRangeField.fieldType = 'single-input';

const JoySingleInputDateRangePicker = React.forwardRef((props, ref) => {
  return (
    <DateRangePicker
      {...props}
      ref={ref}
      slots={{ ...props.slots, field: JoySingleInputDateRangeField }}
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

export default function JoyV6SingleInputRangeField() {
  const materialTheme = useMaterialTheme();
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode mode={materialTheme.palette.mode} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoySingleInputDateRangePicker />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
