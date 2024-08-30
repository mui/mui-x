import * as React from 'react';
import { Dayjs } from 'dayjs';
import {
  useTheme as useMaterialTheme,
  useColorScheme as useMaterialColorScheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
} from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import {
  extendTheme as extendJoyTheme,
  useColorScheme,
  styled,
  CssVarsProvider,
  THEME_ID,
} from '@mui/joy/styles';
import Input, { InputProps } from '@mui/joy/Input';
import Stack, { StackProps } from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Typography, { TypographyProps } from '@mui/joy/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import {
  BaseMultiInputFieldProps,
  DateRange,
  DateRangeValidationError,
  MultiInputFieldSlotTextFieldProps,
  RangeFieldSection,
  UseDateRangeFieldProps,
} from '@mui/x-date-pickers-pro/models';

const joyTheme = extendJoyTheme();

interface JoyFieldProps extends InputProps {
  label?: React.ReactNode;
  inputRef?: React.Ref<HTMLInputElement>;
  enableAccessibleFieldDOMStructure?: boolean;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
}

type JoyFieldComponent = ((
  props: JoyFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const JoyField = React.forwardRef(
  (props: JoyFieldProps, ref: React.Ref<HTMLDivElement>) => {
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
  },
) as JoyFieldComponent;

const MultiInputJoyDateRangeFieldRoot = styled(
  React.forwardRef((props: StackProps, ref: React.Ref<HTMLDivElement>) => (
    <Stack
      ref={ref}
      spacing={2}
      direction="row"
      alignItems="center"
      overflow="auto"
      {...props}
    />
  )),
  {
    name: 'MuiMultiInputDateRangeField',
    slot: 'Root',
    overridesResolver: (props, styles) => styles.root,
  },
)({});

const MultiInputJoyDateRangeFieldSeparator = styled(
  (props: TypographyProps) => (
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

interface JoyMultiInputDateRangeFieldProps
  extends UseDateRangeFieldProps<Dayjs, false>,
    BaseMultiInputFieldProps<
      DateRange<Dayjs>,
      Dayjs,
      RangeFieldSection,
      false,
      DateRangeValidationError
    > {}

type JoyMultiInputDateRangeFieldComponent = ((
  props: JoyMultiInputDateRangeFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const JoyMultiInputDateRangeField = React.forwardRef(
  (props: JoyMultiInputDateRangeFieldProps, ref: React.Ref<HTMLDivElement>) => {
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

    const startTextFieldProps = useSlotProps({
      elementType: FormControl,
      externalSlotProps: slotProps?.textField,
      ownerState: { ...props, position: 'start' },
    }) as MultiInputFieldSlotTextFieldProps;

    const endTextFieldProps = useSlotProps({
      elementType: FormControl,
      externalSlotProps: slotProps?.textField,
      ownerState: { ...props, position: 'end' },
    }) as MultiInputFieldSlotTextFieldProps;

    const fieldResponse = useMultiInputDateRangeField<
      Dayjs,
      false,
      MultiInputFieldSlotTextFieldProps
    >({
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
        enableAccessibleFieldDOMStructure: false,
      },
      startTextFieldProps,
      endTextFieldProps,
    });

    return (
      <MultiInputJoyDateRangeFieldRoot ref={ref} className={className}>
        <JoyField {...fieldResponse.startDate} />
        <MultiInputJoyDateRangeFieldSeparator />
        <JoyField {...fieldResponse.endDate} />
      </MultiInputJoyDateRangeFieldRoot>
    );
  },
) as JoyMultiInputDateRangeFieldComponent;

const JoyDateRangePicker = React.forwardRef(
  (props: DateRangePickerProps<Dayjs>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <DateRangePicker
        ref={ref}
        {...props}
        slots={{ ...props?.slots, field: JoyMultiInputDateRangeField }}
      />
    );
  },
);

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
