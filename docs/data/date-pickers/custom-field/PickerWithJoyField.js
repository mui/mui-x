import * as React from 'react';
import PropTypes from 'prop-types';

import { deepmerge } from '@mui/utils';
import { blue, grey } from '@mui/material/colors';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme,
  useTheme,
  useColorScheme,
} from '@mui/material/styles';
import { extendTheme as extendJoyTheme, styled } from '@mui/joy/styles';
import { useSlotProps } from '@mui/base/utils';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Typography from '@mui/joy/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { unstable_useDateField as useDateField } from '@mui/x-date-pickers/DateField';

const muiTheme = extendMuiTheme();

const joyTheme = extendJoyTheme({
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

const mergedTheme = {
  ...joyTheme,
  ...muiTheme,
  colorSchemes: deepmerge(joyTheme.colorSchemes, muiTheme.colorSchemes),
  typography: {
    ...joyTheme.typography,
    ...muiTheme.typography,
  },
  zIndex: {
    ...joyTheme.zIndex,
    ...muiTheme.zIndex,
  },
};

mergedTheme.generateCssVars = (colorScheme) => ({
  css: {
    ...joyTheme.generateCssVars(colorScheme).css,
    ...muiTheme.generateCssVars(colorScheme).css,
  },
  vars: deepmerge(
    joyTheme.generateCssVars(colorScheme).vars,
    muiTheme.generateCssVars(colorScheme).vars,
  ),
});
mergedTheme.unstable_sxConfig = {
  ...muiTheme.unstable_sxConfig,
  ...joyTheme.unstable_sxConfig,
};

const JoyField = React.forwardRef((props, inputRef) => {
  const {
    disabled,
    id,
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    ...other
  } = props;

  return (
    <FormControl disabled={disabled} id={id} sx={{ flexGrow: 1 }} ref={containerRef}>
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
  (props) => <Typography {...props}>{props.children ?? ' — '}</Typography>,
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

JoyDateField.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object])
        .isRequired,
    }),
  ]),
  slotProps: PropTypes.object,
  slots: PropTypes.object,
};

function JoyDatePicker(props) {
  return <DatePicker slots={{ field: JoyDateField, ...props.slots }} {...props} />;
}

/**
 * This component is for syncing the MUI docs's mode with this demo.
 * You might not need this component in your project.
 */

JoyDatePicker.propTypes = {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.any,
};

function SyncThemeMode({ mode }) {
  const { setMode } = useColorScheme();
  React.useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);
  return null;
}

export default function PickerWithJoyField() {
  const {
    palette: { mode },
  } = useTheme();
  return (
    <CssVarsProvider theme={mergedTheme}>
      <SyncThemeMode mode={mode} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={2} sx={{ width: 400 }}>
          <JoyDatePicker />
          <JoyDateRangePicker />
        </Stack>
      </LocalizationProvider>
    </CssVarsProvider>
  );
}
