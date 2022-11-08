import * as React from 'react';
import PropTypes from 'prop-types';
import { resolveComponentProps } from '@mui/base/utils';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { DesktopNextDatePickerProps } from './DesktopNextDatePicker.types';
import {
  getDatePickerFieldFormat,
  useNextDatePickerDefaultizedProps,
} from '../NextDatePicker/shared';
import { useLocaleText, useUtils, validateDate } from '../internals';
import { useDesktopPicker } from '../internals/hooks/useDesktopPicker';
import { Calendar } from '../internals/components/icons';
import { Unstable_DateField as DateField } from '../DateField';
import { extractValidationProps } from '../internals/utils/validation';
import { renderDateView } from '../internals/utils/viewRenderers';

type DesktopDatePickerComponent = (<TDate>(
  props: DesktopNextDatePickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const VIEW_LOOKUP = {
  day: renderDateView,
  month: renderDateView,
  year: renderDateView,
};

const DesktopNextDatePicker = React.forwardRef(function DesktopNextDatePicker<TDate>(
  inProps: DesktopNextDatePickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const localeText = useLocaleText();
  const utils = useUtils();

  // Props with the default values common to all date pickers
  const { className, sx, ...defaultizedProps } = useNextDatePickerDefaultizedProps<
    TDate,
    DesktopNextDatePickerProps<TDate>
  >(inProps, 'MuiDesktopNextDatePicker');

  // Props with the default values specific to the desktop variant
  const props = {
    ...defaultizedProps,
    format: getDatePickerFieldFormat(utils, defaultizedProps),
    showToolbar: defaultizedProps.showToolbar ?? false,
    autoFocus: true,
    components: {
      OpenPickerIcon: Calendar,
      Field: DateField,
      ...defaultizedProps.components,
    },
    componentsProps: {
      ...defaultizedProps.componentsProps,
      field: (ownerState: any) => ({
        ...resolveComponentProps(defaultizedProps.componentsProps?.field, ownerState),
        ...extractValidationProps(defaultizedProps),
        ref,
        className,
        sx,
        inputRef: defaultizedProps.inputRef,
        label: defaultizedProps.label,
      }),
    },
  };

  const { renderPicker } = useDesktopPicker({
    props,
    valueManager: singleItemValueManager,
    getOpenDialogAriaText: localeText.openDatePickerDialogue,
    viewLookup: VIEW_LOOKUP,
    validator: validateDate,
  });

  return renderPicker();
}) as DesktopDatePickerComponent;

DesktopNextDatePicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  autoFocus: PropTypes.bool,
  /**
   * Class name applied to the root element.
   */
  className: PropTypes.string,
  /**
   * If `true` the popup or dialog will close after submitting full date.
   * @default `true` for Desktop, `false` for Mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  closeOnSelect: PropTypes.bool,
  /**
   * Overrideable components.
   * @default {}
   */
  components: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps: PropTypes.object,
  /**
   * Formats the day of week displayed in the calendar header.
   * @param {string} day The day of week provided by the adapter's method `getWeekdays`.
   * @returns {string} The name to display.
   * @default (day) => day.charAt(0).toUpperCase()
   */
  dayOfWeekFormatter: PropTypes.func,
  /**
   * Default calendar month displayed when `value={null}`.
   */
  defaultCalendarMonth: PropTypes.any,
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue: PropTypes.any,
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true` disable values before the current date and time.
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * Do not render open picker button (renders only the field).
   * @default false
   */
  disableOpenPicker: PropTypes.bool,
  /**
   * If `true` disable values after the current date and time.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * Calendar will show more weeks in order to match this value.
   * Put it to 6 for having fix number of week in Gregorian calendars
   * @default undefined
   */
  fixedWeekNumber: PropTypes.number,
  /**
   * Format of the date when rendered in the input(s).
   * Defaults to localized format based on the used `views`.
   */
  format: PropTypes.string,
  /**
   * Pass a ref to the `input` element.
   */
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]),
  /**
   * The label content.
   */
  label: PropTypes.node,
  /**
   * If `true` renders `LoadingComponent` in calendar instead of calendar view.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Locale for components texts.
   * Allows overriding texts coming from `LocalizationProvider` and `theme`.
   */
  localeText: PropTypes.object,
  /**
   * Maximal selectable date.
   */
  maxDate: PropTypes.any,
  /**
   * Minimal selectable date.
   */
  minDate: PropTypes.any,
  /**
   * Callback fired when the value is accepted @DateIOType.
   * @template TValue
   * @param {TValue} value The value that was just accepted.
   */
  onAccept: PropTypes.func,
  /**
   * Callback fired when the value changes.
   * @template TValue, TError
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} The context containing the validation result of the current value.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see open).
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when the error associated to the current value changes.
   * If the error has a non-null value, then the `TextField` will be rendered in `error` state.
   *
   * @template TValue, TError
   * @param {TError} error The new error describing why the current value is not valid.
   * @param {TValue} value The value associated to the error.
   */
  onError: PropTypes.func,
  /**
   * Callback firing on month change @DateIOType.
   * @template TDate
   * @param {TDate} month The new month.
   * @returns {void|Promise} -
   */
  onMonthChange: PropTypes.func,
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see open).
   */
  onOpen: PropTypes.func,
  /**
   * Callback fired when the selected sections change.
   * @param {FieldSelectedSections} newValue The new selected sections.
   */
  onSelectedSectionsChange: PropTypes.func,
  /**
   * Callback fired on view change.
   * @template View
   * @param {View} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * Callback firing on year change @DateIOType.
   * @template TDate
   * @param {TDate} year The new year.
   */
  onYearChange: PropTypes.func,
  /**
   * Control the popup or dialog open state.
   * @default false
   */
  open: PropTypes.bool,
  /**
   * First view to show.
   */
  openTo: PropTypes.oneOf(['day', 'month', 'year']),
  /**
   * Force rendering in particular orientation.
   */
  orientation: PropTypes.oneOf(['landscape', 'portrait']),
  readOnly: PropTypes.bool,
  /**
   * Disable heavy animations.
   * @default typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent)
   */
  reduceAnimations: PropTypes.bool,
  /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span data-mui-test="loading-progress">...</span>
   */
  renderLoading: PropTypes.func,
  /**
   * The currently selected sections.
   * This prop accept four formats:
   * 1. If a number is provided, the section at this index will be selected.
   * 2. If an object with a `startIndex` and `endIndex` properties are provided, the sections between those two indexes will be selected.
   * 3. If a string of type `MuiDateSectionName` is provided, the first section with that name will be selected.
   * 4. If `null` is provided, no section will be selected
   * If not provided, the selected sections will be handled internally.
   */
  selectedSections: PropTypes.oneOfType([
    PropTypes.oneOf(['day', 'hour', 'meridiem', 'minute', 'month', 'second', 'year']),
    PropTypes.number,
    PropTypes.shape({
      endIndex: PropTypes.number.isRequired,
      startIndex: PropTypes.number.isRequired,
    }),
  ]),
  /**
   * Disable specific date.
   * @template TDate
   * @param {TDate} day The date to test.
   * @returns {boolean} If `true` the date will be disabled.
   */
  shouldDisableDate: PropTypes.func,
  /**
   * Disable specific month.
   * @template TDate
   * @param {TDate} month The month to test.
   * @returns {boolean} If `true` the month will be disabled.
   */
  shouldDisableMonth: PropTypes.func,
  /**
   * Disable specific year.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} If `true` the year will be disabled.
   */
  shouldDisableYear: PropTypes.func,
  /**
   * If `true`, days that have `outsideCurrentMonth={true}` are displayed.
   * @default false
   */
  showDaysOutsideCurrentMonth: PropTypes.bool,
  /**
   * If `true`, the toolbar will be visible.
   * @default `true` for mobile, `false` for desktop
   */
  showToolbar: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.any,
  /**
   * Array of views to show.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired),
} as any;

export { DesktopNextDatePicker };
