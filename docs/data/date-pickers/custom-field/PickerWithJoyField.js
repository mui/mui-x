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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
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
    formControlSx,
    ...other
  } = props;

  return (
    <FormControl
      disabled={disabled}
      id={id}
      sx={{ flexGrow: 1, ...formControlSx }}
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
  return (
    <DatePicker
      {...props}
      slots={{ field: JoyDateField, ...props.slots }}
      slotProps={{
        ...props.slotProps,
        field: {
          ...props.slotProps?.field,
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

JoyDatePicker.propTypes = {
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.shape({
    /**
     * Props passed down to the action bar component.
     */
    actionBar: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    day: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    /**
     * Props passed down to the desktop [Paper](https://mui.com/material-ui/api/paper/) component.
     */
    desktopPaper: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    /**
     * Props passed down to the desktop [Transition](https://mui.com/material-ui/transitions/) component.
     */
    desktopTransition: PropTypes.object,
    /**
     * Props passed down to the [TrapFocus](https://mui.com/base/react-focus-trap/) component on desktop.
     */
    desktopTrapFocus: PropTypes.shape({
      /**
       * A single child content element.
       */
      children: PropTypes.element.isRequired,
      /**
       * If `true`, the focus trap will not automatically shift focus to itself when it opens, and
       * replace it to the last focused element when it closes.
       * This also works correctly with any focus trap children that have the `disableAutoFocus` prop.
       *
       * Generally this should never be set to `true` as it makes the focus trap less
       * accessible to assistive technologies, like screen readers.
       * @default false
       */
      disableAutoFocus: PropTypes.bool,
      /**
       * If `true`, the focus trap will not prevent focus from leaving the focus trap while open.
       *
       * Generally this should never be set to `true` as it makes the focus trap less
       * accessible to assistive technologies, like screen readers.
       * @default false
       */
      disableEnforceFocus: PropTypes.bool,
      /**
       * If `true`, the focus trap will not restore focus to previously focused element once
       * focus trap is hidden or unmounted.
       * @default false
       */
      disableRestoreFocus: PropTypes.bool,
      /**
       * Returns an array of ordered tabbable nodes (i.e. in tab order) within the root.
       * For instance, you can provide the "tabbable" npm dependency.
       * @param {HTMLElement} root
       */
      getTabbable: PropTypes.func,
      /**
       * This prop extends the `open` prop.
       * It allows to toggle the open state without having to wait for a rerender when changing the `open` prop.
       * This prop should be memoized.
       * It can be used to support multiple focus trap mounted at the same time.
       * @default function defaultIsEnabled(): boolean {
       *   return true;
       * }
       */
      isEnabled: PropTypes.func,
      /**
       * If `true`, focus is locked.
       */
      open: PropTypes.bool,
    }),
    /**
     * Props passed down to the [`Dialog`](https://mui.com/material-ui/api/dialog/) component.
     */
    dialog: PropTypes.object,
    field: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({
        className: PropTypes.string,
        /**
         * The default value. Use when the component is not controlled.
         */
        defaultValue: PropTypes.object,
        disabled: PropTypes.bool,
        format: PropTypes.string,
        id: PropTypes.string,
        inputProps: PropTypes.shape({
          'aria-label': PropTypes.string,
        }),
        InputProps: PropTypes.shape({
          endAdornment: PropTypes.node,
          startAdornment: PropTypes.node,
        }),
        inputRef: PropTypes.oneOfType([
          PropTypes.func,
          PropTypes.shape({
            current: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object])
              .isRequired,
          }),
        ]),
        label: PropTypes.node,
        /**
         * Callback fired when the value changes.
         * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
         * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
         * @param {TValue} value The new value.
         * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
         */
        onChange: PropTypes.func,
        /**
         * Callback fired when the error associated to the current value changes.
         * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
         * @template TError The validation error type. Will be either `string` or a `null`. Can be in `[start, end]` format in case of range value.
         * @param {TError} error The new error.
         * @param {TValue} value The value associated to the error.
         */
        onError: PropTypes.func,
        /**
         * Callback fired when the selected sections change.
         * @param {FieldSelectedSections} newValue The new selected sections.
         */
        onSelectedSectionsChange: PropTypes.func,
        /**
         * It prevents the user from changing the value of the field
         * (not from interacting with the field).
         * @default false
         */
        readOnly: PropTypes.bool,
        /**
         * The currently selected sections.
         * This prop accept four formats:
         * 1. If a number is provided, the section at this index will be selected.
         * 2. If an object with a `startIndex` and `endIndex` properties are provided, the sections between those two indexes will be selected.
         * 3. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
         * 4. If `null` is provided, no section will be selected
         * If not provided, the selected sections will be handled internally.
         */
        selectedSections: PropTypes.oneOfType([
          PropTypes.oneOf([
            'all',
            'day',
            'hours',
            'meridiem',
            'minutes',
            'month',
            'seconds',
            'weekDay',
            'year',
          ]),
          PropTypes.number,
          PropTypes.shape({
            endIndex: PropTypes.number.isRequired,
            startIndex: PropTypes.number.isRequired,
          }),
        ]),
        slotProps: PropTypes.object,
        slots: PropTypes.object,
        /**
         * The ref object used to imperatively interact with the field.
         */
        unstableFieldRef: PropTypes.oneOfType([
          PropTypes.func,
          PropTypes.shape({
            current: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object])
              .isRequired,
          }),
        ]),
        /**
         * The selected value.
         * Used when the component is controlled.
         */
        value: PropTypes.object,
      }),
    ]),
    inputAdornment: PropTypes.object,
    /**
     * Props passed down to the layoutRoot component.
     */
    layout: PropTypes.shape({
      children: PropTypes.node,
      classes: PropTypes.object,
      className: PropTypes.string,
      /**
       * Overridable components.
       * @default {}
       * @deprecated Please use `slots`.
       */
      components: PropTypes.shape({
        /**
         * Custom component for the action bar, it is placed below the picker views.
         * @default PickersActionBar
         */
        ActionBar: PropTypes.elementType,
        /**
         * Custom component for wrapping the layout.
         * It wraps the toolbar, views, action bar, and shortcuts.
         */
        Layout: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        /**
         * Custom component for the shortcuts.
         * @default PickersShortcuts
         */
        Shortcuts: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        /**
         * Tabs enabling toggling between views.
         */
        Tabs: PropTypes.elementType,
        /**
         * Custom component for the toolbar.
         * It is placed above the picker views.
         */
        Toolbar: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
      }),
      /**
       * The props used for each component slot.
       * @default {}
       * @deprecated Please use `slotProps`.
       */
      componentsProps: PropTypes.shape({
        /**
         * Props passed down to the action bar component.
         */
        actionBar: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        /**
         * Props passed down to the layoutRoot component.
         */
        layout: PropTypes.object,
        /**
         * Props passed down to the shortcuts component.
         */
        shortcuts: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        /**
         * Props passed down to the tabs component.
         */
        tabs: PropTypes.object,
        /**
         * Props passed down to the toolbar component.
         */
        toolbar: PropTypes.object,
      }),
      disabled: PropTypes.bool,
      isLandscape: PropTypes.bool,
      isValid: PropTypes.func,
      onAccept: PropTypes.func,
      onCancel: PropTypes.func,
      onChange: PropTypes.func,
      onClear: PropTypes.func,
      onClose: PropTypes.func,
      onDismiss: PropTypes.func,
      onOpen: PropTypes.func,
      onSetToday: PropTypes.func,
      onViewChange: PropTypes.func,
      /**
       * Force rendering in particular orientation.
       */
      orientation: PropTypes.oneOf(['landscape', 'portrait']),
      readOnly: PropTypes.bool,
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps: PropTypes.shape({
        /**
         * Props passed down to the action bar component.
         */
        actionBar: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        /**
         * Props passed down to the layoutRoot component.
         */
        layout: PropTypes.object,
        /**
         * Props passed down to the shortcuts component.
         */
        shortcuts: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        /**
         * Props passed down to the tabs component.
         */
        tabs: PropTypes.object,
        /**
         * Props passed down to the toolbar component.
         */
        toolbar: PropTypes.object,
      }),
      /**
       * Overridable component slots.
       * @default {}
       */
      slots: PropTypes.any,
      sx: PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.oneOf([null]),
            PropTypes.func,
            PropTypes.object,
            PropTypes.bool,
          ]),
        ),
        PropTypes.func,
        PropTypes.object,
      ]),
      value: PropTypes.object,
      view: PropTypes.oneOf([
        'day',
        'hours',
        'minutes',
        'month',
        'seconds',
        'year',
        null,
      ]).isRequired,
      views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year'])),
      wrapperVariant: PropTypes.oneOf(['desktop', 'mobile']),
    }),
    leftArrowIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    /**
     * Props passed down to the mobile [Paper](https://mui.com/material-ui/api/paper/) component.
     */
    mobilePaper: PropTypes.object,
    /**
     * Props passed down to the mobile [Transition](https://mui.com/material-ui/transitions/) component.
     */
    mobileTransition: PropTypes.object,
    nextIconButton: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    openPickerButton: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    openPickerIcon: PropTypes.object,
    /**
     * Props passed down to [Popper](https://mui.com/material-ui/api/popper/) component.
     */
    popper: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    previousIconButton: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    rightArrowIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    /**
     * Props passed down to the shortcuts component.
     */
    shortcuts: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    switchViewButton: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    switchViewIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    textField: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    toolbar: PropTypes.shape({
      /**
       * className applied to the root component.
       */
      className: PropTypes.string,
      /**
       * If `true`, show the toolbar even in desktop mode.
       * @default `true` for Desktop, `false` for Mobile.
       */
      hidden: PropTypes.bool,
      /**
       * Toolbar date format.
       */
      toolbarFormat: PropTypes.string,
      /**
       * Toolbar value placeholder—it is displayed when the value is empty.
       * @default "––"
       */
      toolbarPlaceholder: PropTypes.node,
    }),
  }),
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
        <DemoContainer components={['DatePicker', 'DateRangePicker']}>
          <JoyDatePicker />
          <JoyDateRangePicker />
        </DemoContainer>
      </LocalizationProvider>
    </CssVarsProvider>
  );
}
