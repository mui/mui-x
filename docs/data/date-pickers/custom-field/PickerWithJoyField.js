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
import IconButton from '@mui/joy/IconButton';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateRangeIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useSingleInputDateRangeField as useSingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';

const joyTheme = extendJoyTheme();

const JoyField = React.forwardRef((props, ref) => {
  const {
    disabled,
    id,
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    formControlSx,
    slotProps,
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
      ref={ref}
    >
      <FormLabel>{label}</FormLabel>
      <Input
        disabled={disabled}
        slotProps={{
          ...slotProps,
          root: { ...slotProps?.root, ref: containerRef },
        }}
        startDecorator={startAdornment}
        endDecorator={endAdornment}
        {...other}
      />
    </FormControl>
  );
});

const JoySingleInputDateRangeField = React.forwardRef((props, ref) => {
  const { slots, slotProps, onAdornmentClick, ...other } = props;

  const { inputRef: externalInputRef, ...textFieldProps } = useSlotProps({
    elementType: null,
    externalSlotProps: slotProps?.textField,
    externalForwardedProps: other,
    ownerState: props,
  });

  const { ref: inputRef, ...response } = useSingleInputDateRangeField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  return (
    <JoyField
      {...response}
      ref={ref}
      slotProps={{
        input: {
          ref: inputRef,
        },
      }}
      endDecorator={
        <IconButton onClick={onAdornmentClick} variant="plain" color="neutral">
          <DateRangeIcon color="action" />
        </IconButton>
      }
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
      ref={ref}
      open={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      slots={{ field: JoySingleInputDateRangeField }}
      slotProps={{
        field: { onAdornmentClick: toggleOpen },
      }}
      {...props}
    />
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

  const {
    startDate: { ref: startRef, ...startDateProps },
    endDate: { ref: endRef, ...endDateProps },
  } = useMultiInputDateRangeField({
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
      <JoyField
        {...startDateProps}
        slotProps={{
          input: {
            ref: startRef,
          },
        }}
      />
      <MultiInputJoyDateRangeFieldSeparator />
      <JoyField
        {...endDateProps}
        slotProps={{
          input: {
            ref: endRef,
          },
        }}
      />
    </MultiInputJoyDateRangeFieldRoot>
  );
});

const JoyDateRangePicker = React.forwardRef((props, ref) => {
  return (
    <DateRangePicker
      ref={ref}
      slots={{ field: JoyMultiInputDateRangeField }}
      {...props}
    />
  );
});

const JoyDateField = React.forwardRef((props, ref) => {
  const { inputRef: externalInputRef, slots, slotProps, ...textFieldProps } = props;

  const { ref: inputRef, ...other } = useDateField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  return (
    <JoyField
      ref={ref}
      slotProps={{
        input: {
          ref: inputRef,
        },
      }}
      {...other}
    />
  );
});

const JoyDatePicker = React.forwardRef((props, ref) => {
  return (
    <DatePicker
      ref={ref}
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
});

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
          <DemoContainer
            components={['DatePicker', 'DateRangePicker', 'DateRangePicker']}
          >
            <JoyDatePicker />
            <JoySingleInputDateRangePicker />
            <JoyDateRangePicker />
          </DemoContainer>
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
