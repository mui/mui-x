import * as React from 'react';

import {
  useTheme as useMaterialTheme,
  useColorScheme as useMaterialColorScheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
} from '@mui/material/styles';
import {
  extendTheme as extendJoyTheme,
  useColorScheme,
  styled,
  CssVarsProvider,
  THEME_ID,
} from '@mui/joy/styles';
import { useSlotProps } from '@mui/base/utils';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Typography from '@mui/joy/Typography';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';

const joyTheme = extendJoyTheme();

const JoyField = React.forwardRef((props, inputRef) => {
  const {
    disabled,
    id,
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    formControlSx,
    ...other
  } = props;

  return (
    <FormControl
      disabled={disabled}
      id={id}
      sx={[
        {
          flexGrow: 1,
        },
        ...(Array.isArray(formControlSx) ? formControlSx : [formControlSx]),
      ]}
      ref={containerRef}
    >
      <FormLabel>{label}</FormLabel>
      <Input
        disabled={disabled}
        slotProps={{ input: { ref: inputRef } }}
        startDecorator={startAdornment}
        endDecorator={endAdornment}
        {...other}
      />
    </FormControl>
  );
});

const MultiInputJoyDateRangeFieldRoot = styled(
  React.forwardRef((props, ref) => (
    <Stack ref={ref} spacing={2} direction="row" alignItems="center" {...props} />
  )),
  {
    name: 'MuiMultiInputDateRangeField',
    slot: 'Root',
    overridesResolver: (props, styles) => styles.root,
  },
)({});

const MultiInputJoyDateRangeFieldSeparator = styled(
  (props) => (
    <FormControl>
      {/* Ensure that the separator is correctly aligned */}
      <span />
      <Typography {...props}>{props.children ?? ' — '}</Typography>
    </FormControl>
  ),
  {
    name: 'MuiMultiInputDateRangeField',
    slot: 'Separator',
    overridesResolver: (props, styles) => styles.separator,
  },
)({ marginTop: '25px' });

const JoyMultiInputDateRangeField = React.forwardRef((props, ref) => {
  const {
    slotProps,
    value,
    defaultValue,
    format,
    onChange,
    readOnly,
    disabled,
    onError,
    shouldDisableDate,
    minDate,
    maxDate,
    disableFuture,
    disablePast,
    selectedSections,
    onSelectedSectionsChange,
    className,
  } = props;

  const { inputRef: startInputRef, ...startTextFieldProps } = useSlotProps({
    elementType: null,
    externalSlotProps: slotProps?.textField,
    ownerState: { ...props, position: 'start' },
  });

  const { inputRef: endInputRef, ...endTextFieldProps } = useSlotProps({
    elementType: null,
    externalSlotProps: slotProps?.textField,
    ownerState: { ...props, position: 'end' },
  });

  const { startDate, endDate } = useMultiInputDateRangeField({
    sharedProps: {
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      disabled,
      onError,
      shouldDisableDate,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      selectedSections,
      onSelectedSectionsChange,
    },
    startTextFieldProps,
    endTextFieldProps,
    startInputRef,
    endInputRef,
  });

  return (
    <MultiInputJoyDateRangeFieldRoot ref={ref} className={className}>
      <JoyField {...startDate} />
      <MultiInputJoyDateRangeFieldSeparator />
      <JoyField {...endDate} />
    </MultiInputJoyDateRangeFieldRoot>
  );
});

function JoyDateRangePicker(props) {
  return (
    <DateRangePicker slots={{ field: JoyMultiInputDateRangeField }} {...props} />
  );
}

function JoyDateField(props) {
  const { inputRef: externalInputRef, slots, slotProps, ...textFieldProps } = props;

  const response = useDateField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  return <JoyField {...response} />;
}

function JoyDatePicker(props) {
  return (
    <DatePicker
      {...props}
      slots={{ field: JoyDateField, ...props.slots }}
      slotProps={{
        field: {
          formControlSx: {
            flexDirection: 'row',
          },
        },
      }}
    />
  );
}

/**
 * This component is for syncing the MUI docs's mode with this demo.
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

export default function PickerWithJoyField() {
  const materialTheme = useMaterialTheme();
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode mode={materialTheme.palette.mode} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker', 'DateRangePicker']}>
            <JoyDatePicker />
            <JoyDateRangePicker />
          </DemoContainer>
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
