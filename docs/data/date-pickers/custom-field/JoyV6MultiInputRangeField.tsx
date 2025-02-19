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
import Input, { InputProps } from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Typography from '@mui/joy/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { usePickerContext, useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerFieldProps,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { useDateRangeManager } from '@mui/x-date-pickers-pro/managers';
import {
  unstable_useMultiInputRangeField as useMultiInputRangeField,
  UseMultiInputRangeFieldTextFieldProps,
} from '@mui/x-date-pickers-pro/hooks';
import {
  MultiInputFieldRefs,
  MultiInputFieldSlotTextFieldProps,
} from '@mui/x-date-pickers-pro/models';

const joyTheme = extendJoyTheme();

interface JoyTextFieldProps
  extends UseMultiInputRangeFieldTextFieldProps<false, {}>,
    Omit<InputProps, keyof UseMultiInputRangeFieldTextFieldProps<false, {}>> {
  label?: React.ReactNode;
  triggerRef?: React.Ref<HTMLDivElement>;
}

function JoyField(props: JoyTextFieldProps) {
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

interface JoyMultiInputDateRangeFieldProps
  extends Omit<
      DateRangePickerFieldProps,
      'unstableFieldRef' | 'clearable' | 'onClear'
    >,
    MultiInputFieldRefs {
  slotProps: {
    textField: any;
  };
}

function JoyMultiInputDateRangeField(props: JoyMultiInputDateRangeFieldProps) {
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
    ownerState: { position: 'start' } as any,
  }) as MultiInputFieldSlotTextFieldProps;

  const endTextFieldProps = useSlotProps({
    elementType: 'input',
    externalSlotProps: slotProps?.textField,
    additionalProps: { label: 'End' },
    ownerState: { position: 'end' } as any,
  }) as MultiInputFieldSlotTextFieldProps;

  const fieldResponse = useMultiInputRangeField({
    manager,
    internalProps: { ...internalProps, enableAccessibleFieldDOMStructure: false },
    rootProps: {
      ref: pickerContext.rootRef,
      spacing: 2,
      overflow: 'auto',
      direction: 'row' as const,
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

function JoyDateRangePicker(props: DateRangePickerProps) {
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
function SyncThemeMode({ mode }: { mode: 'light' | 'dark' }) {
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
