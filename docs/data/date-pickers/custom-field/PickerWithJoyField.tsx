import * as React from 'react';
import { Dayjs } from 'dayjs';

import type {} from '@mui/material/themeCssVarsAugmentation';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme,
  shouldSkipGeneratingVar as muiShouldSkipGeneratingVar,
} from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';
import {
  styled,
  extendTheme as extendJoyTheme,
  shouldSkipGeneratingVar as joyShouldSkipGeneratingVar,
} from '@mui/joy/styles';
import deepmerge from '@mui/utils/deepmerge';
import { useSlotProps } from '@mui/base/utils';
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
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import {
  unstable_useDateField as useDateField,
  UseDateFieldProps,
} from '@mui/x-date-pickers/DateField';
import {
  BaseMultiInputFieldProps,
  DateRange,
  DateRangeValidationError,
  UseDateRangeFieldProps,
  MultiInputFieldSlotTextFieldProps,
  BaseSingleInputFieldProps,
  DateValidationError,
} from '@mui/x-date-pickers-pro';

const { unstable_sxConfig: muiSxConfig, ...muiTheme } = extendMuiTheme();

const { unstable_sxConfig: joySxConfig, ...joyTheme } = extendJoyTheme({
  cssVarPrefix: 'mui',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          ...blue,
          solidColor: 'var(--mui-palette-primary-contrastText)',
          solidBg: 'var(--mui-palette-primary-main)',
          solidHoverBg: 'var(--mui-palette-primary-dark)',
          plainColor: 'var(--mui-palette-primary-main)',
          plainHoverBg:
            'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          plainActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
          outlinedBorder: 'rgba(var(--mui-palette-primary-mainChannel) / 0.5)',
          outlinedColor: 'var(--mui-palette-primary-main)',
          outlinedHoverBg:
            'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          outlinedHoverBorder: 'var(--mui-palette-primary-main)',
          outlinedActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
        },
        neutral: {
          ...grey,
        },
        divider: 'var(--mui-palette-divider)',
        text: {
          tertiary: 'rgba(0 0 0 / 0.56)',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          ...blue,
          solidColor: 'var(--mui-palette-primary-contrastText)',
          solidBg: 'var(--mui-palette-primary-main)',
          solidHoverBg: 'var(--mui-palette-primary-dark)',
          plainColor: 'var(--mui-palette-primary-main)',
          plainHoverBg:
            'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          plainActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
          outlinedBorder: 'rgba(var(--mui-palette-primary-mainChannel) / 0.5)',
          outlinedColor: 'var(--mui-palette-primary-main)',
          outlinedHoverBg:
            'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          outlinedHoverBorder: 'var(--mui-palette-primary-main)',
          outlinedActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
        },
        neutral: {
          ...grey,
        },
        divider: 'var(--mui-palette-divider)',
        text: {
          tertiary: 'rgba(255 255 255 / 0.5)',
        },
      },
    },
  },
  fontFamily: {
    display: '"Roboto","Helvetica","Arial",sans-serif',
    body: '"Roboto","Helvetica","Arial",sans-serif',
  },
  shadow: {
    xs: `var(--mui-shadowRing), ${muiTheme.shadows[1]}`,
    sm: `var(--mui-shadowRing), ${muiTheme.shadows[2]}`,
    md: `var(--mui-shadowRing), ${muiTheme.shadows[4]}`,
    lg: `var(--mui-shadowRing), ${muiTheme.shadows[8]}`,
    xl: `var(--mui-shadowRing), ${muiTheme.shadows[12]}`,
  },
});

const mergedTheme = deepmerge(joyTheme, muiTheme) as unknown as ReturnType<
  typeof extendMuiTheme
>;

mergedTheme.unstable_sxConfig = {
  ...muiSxConfig,
  ...joySxConfig,
};

interface JoyFieldProps extends InputProps {
  label?: React.ReactNode;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
}

type JoyFieldComponent = ((
  props: JoyFieldProps & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const JoyField = React.forwardRef(
  (props: JoyFieldProps, inputRef: React.Ref<HTMLInputElement>) => {
    const {
      disabled,
      id,
      label,
      InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
      ...other
    } = props;

    return (
      <FormControl
        disabled={disabled}
        id={id}
        sx={{ flexGrow: 1 }}
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
  },
) as JoyFieldComponent;

const MultiInputJoyDateRangeFieldRoot = styled(
  React.forwardRef((props: StackProps, ref: React.Ref<HTMLDivElement>) => (
    <Stack ref={ref} spacing={2} direction="row" alignItems="center" {...props} />
  )),
  {
    name: 'MuiMultiInputDateRangeField',
    slot: 'Root',
    overridesResolver: (props, styles) => styles.root,
  },
)({});

const MultiInputJoyDateRangeFieldSeparator = styled(
  (props: TypographyProps) => (
    <Typography {...props}>{props.children ?? ' — '}</Typography>
  ),
  {
    name: 'MuiMultiInputDateRangeField',
    slot: 'Separator',
    overridesResolver: (props, styles) => styles.separator,
  },
)({});

interface JoyMultiInputDateRangeFieldProps
  extends UseDateRangeFieldProps<Dayjs>,
    BaseMultiInputFieldProps<DateRange<Dayjs>, DateRangeValidationError> {}

type JoyMultiInputDateRangeFieldComponent = ((
  props: JoyMultiInputDateRangeFieldProps & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

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

    const { inputRef: startInputRef, ...startTextFieldProps } = useSlotProps({
      elementType: null as any,
      externalSlotProps: slotProps?.textField,
      ownerState: { ...props, position: 'start' },
    }) as MultiInputFieldSlotTextFieldProps;

    const { inputRef: endInputRef, ...endTextFieldProps } = useSlotProps({
      elementType: null as any,
      externalSlotProps: slotProps?.textField,
      ownerState: { ...props, position: 'end' },
    }) as MultiInputFieldSlotTextFieldProps;

    const { startDate, endDate } = useMultiInputDateRangeField<
      Dayjs,
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
  },
) as JoyMultiInputDateRangeFieldComponent;

function JoyDateRangePicker(props: DateRangePickerProps<Dayjs>) {
  return (
    <DateRangePicker slots={{ field: JoyMultiInputDateRangeField }} {...props} />
  );
}

interface JoyDateFieldProps
  extends UseDateFieldProps<Dayjs>,
    BaseSingleInputFieldProps<Dayjs | null, DateValidationError> {}

function JoyDateField(props: JoyDateFieldProps) {
  const { inputRef: externalInputRef, slots, slotProps, ...textFieldProps } = props;

  const response = useDateField<Dayjs, typeof textFieldProps>({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  return <JoyField {...response} />;
}

function JoyDatePicker(props: DatePickerProps<Dayjs>) {
  return <DatePicker slots={{ field: JoyDateField, ...props.slots }} {...props} />;
}

export default function PickerWithJoyField() {
  return (
    <CssVarsProvider
      theme={mergedTheme}
      shouldSkipGeneratingVar={(keys) =>
        muiShouldSkipGeneratingVar(keys) || joyShouldSkipGeneratingVar(keys)
      }
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={2} sx={{ width: 400 }}>
          <JoyDatePicker />
          <JoyDateRangePicker />
        </Stack>
      </LocalizationProvider>
    </CssVarsProvider>
  );
}
