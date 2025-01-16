import * as React from 'react';
import {
  useTheme as useMaterialTheme,
  useColorScheme as useMaterialColorScheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
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
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
import { unstable_useMultiInputRangeField as useMultiInputRangeField } from '@mui/x-date-pickers-pro/hooks';

const joyTheme = extendJoyTheme();

const JoyField = React.forwardRef((props, ref) => {
  const {
    // Should be ignored
    enableAccessibleFieldDOMStructure,
    disabled,
    id,
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    endDecorator,
    startDecorator,
    slotProps,
    inputRef,
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
          ...slotProps,
          root: { ...slotProps?.root, ref: containerRef },
          input: { ...slotProps?.input, ref: inputRef },
        }}
        {...other}
      />
    </FormControl>
  );
});

const JoyMultiInputDateRangeField = React.forwardRef((props, ref) => {
  const manager = useDateRangeManager({
    enableAccessibleFieldDOMStructure: false,
  });
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { slotProps, ownerState, ...otherForwardedProps } = forwardedProps;

  const startTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    ownerState: { position: 'start' },
  });

  const endTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    ownerState: { position: 'end' },
  });

  const fieldResponse = useMultiInputRangeField({
    manager,
    internalProps: { ...internalProps, enableAccessibleFieldDOMStructure: false },
    startForwardedProps: startTextFieldProps,
    endForwardedProps: endTextFieldProps,
  });

  return (
    <Stack
      ref={ref}
      spacing={2}
      overflow="auto"
      direction="row"
      alignItems="center"
      {...otherForwardedProps}
    >
      <JoyField {...fieldResponse.startDate} />
      <FormControl>
        <Typography sx={{ marginTop: '25px' }}>{' – '}</Typography>
      </FormControl>
      <JoyField {...fieldResponse.endDate} />
    </Stack>
  );
});

const JoyDateRangePicker = React.forwardRef((props, ref) => {
  return (
    <DateRangePicker
      ref={ref}
      {...props}
      enableAccessibleFieldDOMStructure={false}
      slots={{ ...props?.slots, field: JoyMultiInputDateRangeField }}
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

export default function JoyV6MultiInputRangeField() {
  const materialTheme = useMaterialTheme();
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode mode={materialTheme.palette.mode} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoyDateRangePicker />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
