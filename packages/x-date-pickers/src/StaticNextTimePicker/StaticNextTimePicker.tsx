import * as React from 'react';
import PropTypes from 'prop-types';
import { StaticNextTimePickerProps } from './StaticNextTimePicker.types';
import { useNextTimePickerDefaultizedProps } from '../NextTimePicker/shared';
import { timePickerValueManager } from '../TimePicker/shared';
import { useStaticPicker } from '../internals/hooks/useStaticPicker';
import { ClockPickerView } from '../internals/models';
import { renderTimeView } from '../internals/utils/viewRenderers';

type StaticTimePickerComponent = (<TTime>(
  props: StaticNextTimePickerProps<TTime> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const VIEW_LOOKUP = {
  hours: renderTimeView,
  minutes: renderTimeView,
  seconds: renderTimeView,
};

const StaticNextTimePicker = React.forwardRef(function StaticNextTimePicker<TTime>(
  inProps: StaticNextTimePickerProps<TTime>,
  ref: React.Ref<HTMLDivElement>,
) {
  const defaultizedProps = useNextTimePickerDefaultizedProps<
    TTime,
    StaticNextTimePickerProps<TTime>
  >(inProps, 'MuiStaticNextTimePicker');

  const displayStaticWrapperAs = defaultizedProps.displayStaticWrapperAs ?? 'mobile';

  // Props with the default values specific to the static variant
  const props = {
    ...defaultizedProps,
    displayStaticWrapperAs,
    showToolbar: defaultizedProps.showToolbar ?? displayStaticWrapperAs === 'mobile',
  };

  const { renderPicker } = useStaticPicker<TTime, ClockPickerView, typeof props>({
    props,
    valueManager: timePickerValueManager,
    viewLookup: VIEW_LOOKUP,
    ref,
  });

  return renderPicker();
}) as StaticTimePickerComponent;

StaticNextTimePicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * 12h/24h view for hour selection clock.
   * @default `utils.is12HourCycleInCurrentLocale()`
   */
  ampm: PropTypes.bool,
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default false
   */
  ampmInClock: PropTypes.bool,
  autoFocus: PropTypes.bool,
  /**
   * Class name applied to the root element.
   */
  className: PropTypes.string,
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
   * If `true` disable values before the current time
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,
  /**
   * If `true` disable values after the current time.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default "mobile"
   */
  displayStaticWrapperAs: PropTypes.oneOf(['desktop', 'mobile']),
  /**
   * Locale for components texts.
   * Allows overriding texts coming from `LocalizationProvider` and `theme`.
   */
  localeText: PropTypes.object,
  /**
   * Max time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  maxTime: PropTypes.any,
  /**
   * Min time acceptable time.
   * For input validation date part of passed object will be ignored if `disableIgnoringDatePartForTimeValidation` not specified.
   */
  minTime: PropTypes.any,
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep: PropTypes.number,
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
   * Callback fired when the error associated to the current value changes.
   * @template TValue, TError
   * @param {TError} error The new error.
   * @param {TValue} value The value associated to the error.
   */
  onError: PropTypes.func,
  /**
   * Callback fired on view change.
   * @template View
   * @param {View} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * First view to show.
   */
  openTo: PropTypes.oneOf(['hours', 'minutes', 'seconds']),
  /**
   * Force rendering in particular orientation.
   */
  orientation: PropTypes.oneOf(['landscape', 'portrait']),
  readOnly: PropTypes.bool,
  /**
   * Dynamically check if time is disabled or not.
   * If returns `false` appropriate time point will ot be acceptable.
   * @param {number} timeValue The value to check.
   * @param {ClockPickerView} view The clock type of the timeValue.
   * @returns {boolean} Returns `true` if the time should be disabled
   */
  shouldDisableTime: PropTypes.func,
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
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours', 'minutes', 'seconds']).isRequired),
} as any;

export { StaticNextTimePicker };
