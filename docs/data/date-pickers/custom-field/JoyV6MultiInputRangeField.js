import * as React from 'react';
import {
  ThemeProvider,
  createTheme,
  useColorScheme as useMaterialColorScheme,
} from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import {
  extendTheme as extendJoyTheme,
  useColorScheme,
  CssVarsProvider,
  THEME_ID,
} from '@mui/joy/styles';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Typography from '@mui/joy/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { usePickerContext, useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
import { unstable_useMultiInputRangeField as useMultiInputRangeField } from '@mui/x-date-pickers-pro/hooks';

const joyTheme = extendJoyTheme();

function JoyField(props) {
  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,
    triggerRef,
    disabled,
    id,
    label,
    slotProps,
    inputRef,
    ...other
  } = props;

  return (
    <FormControl disabled={disabled} id={id}>
      <FormLabel>{label}</FormLabel>
      <Input
        disabled={disabled}
        slotProps={{
          ...slotProps,
          input: { ...slotProps?.input, ref: inputRef },
        }}
        {...other}
        ref={triggerRef}
      />
    </FormControl>
  );
}

function JoyMultiInputDateRangeField(props) {
  const manager = useDateRangeManager({
    enableAccessibleFieldDOMStructure: false,
  });
  const pickerContext = usePickerContext();
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { slotProps, ...otherForwardedProps } = forwardedProps;

  const startTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    additionalProps: { label: 'Start' },
    ownerState: { position: 'start' },
  });

  const endTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    additionalProps: { label: 'End' },
    ownerState: { position: 'end' },
  });

  const fieldResponse = useMultiInputRangeField({
    manager,
    internalProps: { ...internalProps, enableAccessibleFieldDOMStructure: false },
    rootProps: {
      ref: pickerContext.rootRef,
      spacing: 2,
      overflow: 'auto',
      direction: 'row',
      alignItems: 'center',
      ...otherForwardedProps,
    },
    startTextFieldProps,
    endTextFieldProps,
  });

  return (
    <Stack {...fieldResponse.root}>
      <JoyField
        {...fieldResponse.startTextField}
        triggerRef={pickerContext.triggerRef}
      />
      <FormControl>
        <Typography sx={{ marginTop: '25px' }}>{' – '}</Typography>
      </FormControl>
      <JoyField {...fieldResponse.endTextField} />
    </Stack>
  );
}

JoyMultiInputDateRangeField.fieldType = 'multi-input';

function JoyDateRangePicker(props) {
  return (
    <DateRangePicker
      {...props}
      enableAccessibleFieldDOMStructure={false}
      slots={{ ...props?.slots, field: JoyMultiInputDateRangeField }}
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

export default function JoyV6MultiInputRangeField() {
  return (
    <ThemeProvider theme={theme}>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoyDateRangePicker />
        </LocalizationProvider>
      </CssVarsProvider>
    </ThemeProvider>
  );
}
