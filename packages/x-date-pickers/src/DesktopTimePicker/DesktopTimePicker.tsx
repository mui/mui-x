'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import { refType } from '@mui/utils';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { TimeField } from '../TimeField';
import { DesktopTimePickerProps } from './DesktopTimePicker.types';
import { TimePickerViewRenderers, useTimePickerDefaultizedProps } from '../TimePicker/shared';
import { usePickerTranslations } from '../hooks/usePickerTranslations';
import { useUtils } from '../internals/hooks/useUtils';
import { extractValidationProps, validateTime } from '../validation';
import { ClockIcon } from '../icons';
import { useDesktopPicker } from '../internals/hooks/useDesktopPicker';
import {
  renderDigitalClockTimeView,
  renderMultiSectionDigitalClockTimeView,
} from '../timeViewRenderers';
import { PickersActionBarAction } from '../PickersActionBar';
import { TimeViewWithMeridiem } from '../internals/models';
import { resolveTimeFormat } from '../internals/utils/time-utils';
import { resolveTimeViewsResponse } from '../internals/utils/date-time-utils';
import { TimeView, PickerOwnerState } from '../models';
import { buildGetOpenDialogAriaText } from '../locales/utils/getPickersLocalization';

type DesktopTimePickerComponent = (<TEnableAccessibleFieldDOMStructure extends boolean = true>(
  props: DesktopTimePickerProps<TEnableAccessibleFieldDOMStructure> &
    React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [TimePicker](https://mui.com/x/react-date-pickers/time-picker/)
 * - [Validation](https://mui.com/x/react-date-pickers/validation/)
 *
 * API:
 *
 * - [DesktopTimePicker API](https://mui.com/x/api/date-pickers/desktop-time-picker/)
 */
const DesktopTimePicker = React.forwardRef(function DesktopTimePicker<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
>(
  inProps: DesktopTimePickerProps<TEnableAccessibleFieldDOMStructure>,
  ref: React.Ref<HTMLDivElement>,
) {
  const translations = usePickerTranslations();
  const utils = useUtils();

  // Props with the default values common to all time pickers
  const defaultizedProps = useTimePickerDefaultizedProps<
    TimeViewWithMeridiem,
    DesktopTimePickerProps<TEnableAccessibleFieldDOMStructure>
  >(inProps, 'MuiDesktopTimePicker');

  const {
    shouldRenderTimeInASingleColumn,
    views: resolvedViews,
    timeSteps,
  } = resolveTimeViewsResponse<TimeView, TimeViewWithMeridiem>(defaultizedProps);

  const renderTimeView = shouldRenderTimeInASingleColumn
    ? renderDigitalClockTimeView
    : renderMultiSectionDigitalClockTimeView;

  const viewRenderers: TimePickerViewRenderers<TimeViewWithMeridiem, any> = {
    hours: renderTimeView,
    minutes: renderTimeView,
    seconds: renderTimeView,
    meridiem: renderTimeView,
    ...defaultizedProps.viewRenderers,
  };

  const ampmInClock = defaultizedProps.ampmInClock ?? true;
  const actionBarActions: PickersActionBarAction[] = shouldRenderTimeInASingleColumn
    ? []
    : ['accept'];
  // Need to avoid adding the `meridiem` view when unexpected renderer is specified
  const shouldHoursRendererContainMeridiemView =
    viewRenderers.hours?.name === renderMultiSectionDigitalClockTimeView.name;
  const views = !shouldHoursRendererContainMeridiemView
    ? resolvedViews.filter((view) => view !== 'meridiem')
    : resolvedViews;

  // Props with the default values specific to the desktop variant
  const props = {
    ...defaultizedProps,
    ampmInClock,
    timeSteps,
    viewRenderers,
    format: resolveTimeFormat(utils, defaultizedProps),
    // Setting only `hours` time view in case of single column time picker
    // Allows for easy view lifecycle management
    views: shouldRenderTimeInASingleColumn ? ['hours' as TimeViewWithMeridiem] : views,
    slots: {
      field: TimeField,
      openPickerIcon: ClockIcon,
      ...defaultizedProps.slots,
    },
    slotProps: {
      ...defaultizedProps.slotProps,
      field: (ownerState: PickerOwnerState) => ({
        ...resolveComponentProps(defaultizedProps.slotProps?.field, ownerState),
        ...extractValidationProps(defaultizedProps),
        ref,
      }),
      toolbar: {
        hidden: true,
        ampmInClock,
        ...defaultizedProps.slotProps?.toolbar,
      },
      actionBar: {
        actions: actionBarActions,
        ...defaultizedProps.slotProps?.actionBar,
      },
    },
  };

  const { renderPicker } = useDesktopPicker<
    TimeViewWithMeridiem,
    TEnableAccessibleFieldDOMStructure,
    typeof props
  >({
    props,
    valueManager: singleItemValueManager,
    valueType: 'time',
    getOpenDialogAriaText: buildGetOpenDialogAriaText({
      utils,
      formatKey: 'fullTime',
      contextTranslation: translations.openTimePickerDialogue,
      propsTranslation: props.localeText?.openTimePickerDialogue,
    }),
    validator: validateTime,
  });

  return renderPicker();
}) as DesktopTimePickerComponent;

DesktopTimePicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * 12h/24h view for hour selection clock.
   * @default utils.is12HourCycleInCurrentLocale()
   */
  ampm: PropTypes.bool,
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default true on desktop, false on mobile
   */
  ampmInClock: PropTypes.bool,
  /**
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  /**
   * If `true`, the popover or modal will close after submitting the full date.
   * @default `true` for desktop, `false` for mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect: PropTypes.bool,
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue: PropTypes.object,
  /**
   * If `true`, the component is disabled.
   * When disabled, the value cannot be changed and no interaction is possible.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, disable values after the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,
  /**
   * If `true`, the open picker button will not be rendered (renders only the field).
   * @default false
   */
  disableOpenPicker: PropTypes.bool,
  /**
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * @default true
   */
  enableAccessibleFieldDOMStructure: PropTypes.any,
  /**
   * Format of the date when rendered in the input(s).
   * Defaults to localized format based on the used `views`.
   */
  format: PropTypes.string,
  /**
   * Density of the format when rendered in the input.
   * Setting `formatDensity` to `"spacious"` will add a space before and after each `/`, `-` and `.` character.
   * @default "dense"
   */
  formatDensity: PropTypes.oneOf(['dense', 'spacious']),
  /**
   * Pass a ref to the `input` element.
   */
  inputRef: refType,
  /**
   * The label content.
   */
  label: PropTypes.node,
  /**
   * Locale for components texts.
   * Allows overriding texts coming from `LocalizationProvider` and `theme`.
   */
  localeText: PropTypes.object,
  /**
   * Maximal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  maxTime: PropTypes.object,
  /**
   * Minimal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  minTime: PropTypes.object,
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep: PropTypes.number,
  /**
   * Name attribute used by the `input` element in the Field.
   */
  name: PropTypes.string,
  /**
   * Callback fired when the value is accepted.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The value that was just accepted.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onAccept: PropTypes.func,
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see `open`).
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when the error associated with the current value changes.
   * When a validation error is detected, the `error` parameter contains a non-null value.
   * This can be used to render an appropriate form error.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @param {TError} error The reason why the current value is not valid.
   * @param {TValue} value The value associated with the error.
   */
  onError: PropTypes.func,
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see `open`).
   */
  onOpen: PropTypes.func,
  /**
   * Callback fired when the selected sections change.
   * @param {FieldSelectedSections} newValue The new selected sections.
   */
  onSelectedSectionsChange: PropTypes.func,
  /**
   * Callback fired on view change.
   * @template TView
   * @param {TView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * Control the popup or dialog open state.
   * @default false
   */
  open: PropTypes.bool,
  /**
   * The default visible view.
   * Used when the component view is not controlled.
   * Must be a valid option from `views` list.
   */
  openTo: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
  /**
   * Force rendering in particular orientation.
   */
  orientation: PropTypes.oneOf(['landscape', 'portrait']),
  /**
   * If `true`, the component is read-only.
   * When read-only, the value cannot be changed but the user can interact with the interface.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations: PropTypes.bool,
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.
   */
  referenceDate: PropTypes.object,
  /**
   * The currently selected sections.
   * This prop accepts four formats:
   * 1. If a number is provided, the section at this index will be selected.
   * 2. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
   * 3. If `"all"` is provided, all the sections will be selected.
   * 4. If `null` is provided, no section will be selected.
   * If not provided, the selected sections will be handled internally.
   */
  selectedSections: PropTypes.oneOfType([
    PropTypes.oneOf([
      'all',
      'day',
      'empty',
      'hours',
      'meridiem',
      'minutes',
      'month',
      'seconds',
      'weekDay',
      'year',
    ]),
    PropTypes.number,
  ]),
  /**
   * Disable specific time.
   * @param {PickerValidDate} value The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   */
  shouldDisableTime: PropTypes.func,
  /**
   * If `true`, disabled digital clock items will not be rendered.
   * @default false
   */
  skipDisabled: PropTypes.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Amount of time options below or at which the single column time renderer is used.
   * @default 24
   */
  thresholdToRenderTimeInASingleColumn: PropTypes.number,
  /**
   * The time steps between two time unit options.
   * For example, if `timeStep.minutes = 8`, then the available minute options will be `[0, 8, 16, 24, 32, 40, 48, 56]`.
   * When single column time renderer is used, only `timeStep.minutes` will be used.
   * @default{ hours: 1, minutes: 5, seconds: 5 }
   */
  timeSteps: PropTypes.shape({
    hours: PropTypes.number,
    minutes: PropTypes.number,
    seconds: PropTypes.number,
  }),
  /**
   * Choose which timezone to use for the value.
   * Example: "default", "system", "UTC", "America/New_York".
   * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
   * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
   * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
   */
  timezone: PropTypes.string,
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.object,
  /**
   * The visible view.
   * Used when the component view is controlled.
   * Must be a valid option from `views` list.
   */
  view: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
  /**
   * Define custom view renderers for each section.
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers: PropTypes.shape({
    hours: PropTypes.func,
    meridiem: PropTypes.func,
    minutes: PropTypes.func,
    seconds: PropTypes.func,
  }),
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours', 'minutes', 'seconds']).isRequired),
} as any;

export { DesktopTimePicker };
