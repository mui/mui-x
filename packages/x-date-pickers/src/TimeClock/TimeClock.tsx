import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses, unstable_useId as useId } from '@mui/utils';
import { usePickersTranslations } from '../hooks/usePickersTranslations';
import { useUtils, useNow } from '../internals/hooks/useUtils';
import { PickersArrowSwitcher } from '../internals/components/PickersArrowSwitcher';
import { convertValueToMeridiem, createIsAfterIgnoreDatePart } from '../internals/utils/time-utils';
import { useViews } from '../internals/hooks/useViews';
import type { PickerSelectionState } from '../internals/hooks/usePicker';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { PickerValidDate, TimeView } from '../models';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { getTimeClockUtilityClass } from './timeClockClasses';
import { Clock, ClockProps } from './Clock';
import { TimeClockProps } from './TimeClock.types';
import { getHourNumbers, getMinutesNumbers } from './ClockNumbers';
import { useControlledValueWithTimezone } from '../internals/hooks/useValueWithTimezone';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { useClockReferenceDate } from '../internals/hooks/useClockReferenceDate';

const useUtilityClasses = (ownerState: TimeClockProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    arrowSwitcher: ['arrowSwitcher'],
  };

  return composeClasses(slots, getTimeClockUtilityClass, classes);
};

const TimeClockRoot = styled(PickerViewRoot, {
  name: 'MuiTimeClock',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: TimeClockProps<any> }>({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
});

const TimeClockArrowSwitcher = styled(PickersArrowSwitcher, {
  name: 'MuiTimeClock',
  slot: 'ArrowSwitcher',
  overridesResolver: (props, styles) => styles.arrowSwitcher,
})<{ ownerState: TimeClockProps<any> }>({
  position: 'absolute',
  right: 12,
  top: 15,
});

type TimeClockComponent = (<TDate extends PickerValidDate>(
  props: TimeClockProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const TIME_CLOCK_DEFAULT_VIEWS: TimeView[] = ['hours', 'minutes'];

/**
 * Demos:
 *
 * - [TimePicker](https://mui.com/x/react-date-pickers/time-picker/)
 * - [TimeClock](https://mui.com/x/react-date-pickers/time-clock/)
 *
 * API:
 *
 * - [TimeClock API](https://mui.com/x/api/date-pickers/time-clock/)
 */
export const TimeClock = React.forwardRef(function TimeClock<TDate extends PickerValidDate>(
  inProps: TimeClockProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const utils = useUtils<TDate>();

  const props = useThemeProps({
    props: inProps,
    name: 'MuiTimeClock',
  });

  const {
    ampm = utils.is12HourCycleInCurrentLocale(),
    ampmInClock = false,
    autoFocus,
    slots,
    slotProps,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    disableIgnoringDatePartForTimeValidation = false,
    maxTime,
    minTime,
    disableFuture,
    disablePast,
    minutesStep = 1,
    shouldDisableTime,
    showViewSwitcher,
    onChange,
    view: inView,
    views = TIME_CLOCK_DEFAULT_VIEWS,
    openTo,
    onViewChange,
    focusedView,
    onFocusedViewChange,
    className,
    disabled,
    readOnly,
    timezone: timezoneProp,
    ...other
  } = props;

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'TimeClock',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    onChange,
    valueManager: singleItemValueManager,
  });

  const valueOrReferenceDate = useClockReferenceDate({
    value,
    referenceDate: referenceDateProp,
    utils,
    props,
    timezone,
  });

  const translations = usePickersTranslations<TDate>();
  const now = useNow<TDate>(timezone);

  const { view, setView, previousView, nextView, setValueAndGoToNextView } = useViews({
    view: inView,
    views,
    openTo,
    onViewChange,
    onChange: handleValueChange,
    focusedView,
    onFocusedViewChange,
  });

  const { meridiemMode, handleMeridiemChange } = useMeridiemMode<TDate>(
    valueOrReferenceDate,
    ampm,
    setValueAndGoToNextView,
  );

  const isTimeDisabled = React.useCallback(
    (rawValue: number, viewType: TimeView) => {
      const isAfter = createIsAfterIgnoreDatePart(disableIgnoringDatePartForTimeValidation, utils);
      const shouldCheckPastEnd =
        viewType === 'hours' || (viewType === 'minutes' && views.includes('seconds'));

      const containsValidTime = ({ start, end }: { start: TDate; end: TDate }) => {
        if (minTime && isAfter(minTime, end)) {
          return false;
        }

        if (maxTime && isAfter(start, maxTime)) {
          return false;
        }

        if (disableFuture && isAfter(start, now)) {
          return false;
        }

        if (disablePast && isAfter(now, shouldCheckPastEnd ? end : start)) {
          return false;
        }

        return true;
      };

      const isValidValue = (timeValue: number, step = 1) => {
        if (timeValue % step !== 0) {
          return false;
        }

        if (shouldDisableTime) {
          switch (viewType) {
            case 'hours':
              return !shouldDisableTime(utils.setHours(valueOrReferenceDate, timeValue), 'hours');
            case 'minutes':
              return !shouldDisableTime(
                utils.setMinutes(valueOrReferenceDate, timeValue),
                'minutes',
              );

            case 'seconds':
              return !shouldDisableTime(
                utils.setSeconds(valueOrReferenceDate, timeValue),
                'seconds',
              );

            default:
              return false;
          }
        }

        return true;
      };

      switch (viewType) {
        case 'hours': {
          const valueWithMeridiem = convertValueToMeridiem(rawValue, meridiemMode, ampm);
          const dateWithNewHours = utils.setHours(valueOrReferenceDate, valueWithMeridiem);
          const start = utils.setSeconds(utils.setMinutes(dateWithNewHours, 0), 0);
          const end = utils.setSeconds(utils.setMinutes(dateWithNewHours, 59), 59);

          return !containsValidTime({ start, end }) || !isValidValue(valueWithMeridiem);
        }

        case 'minutes': {
          const dateWithNewMinutes = utils.setMinutes(valueOrReferenceDate, rawValue);
          const start = utils.setSeconds(dateWithNewMinutes, 0);
          const end = utils.setSeconds(dateWithNewMinutes, 59);

          return !containsValidTime({ start, end }) || !isValidValue(rawValue, minutesStep);
        }

        case 'seconds': {
          const dateWithNewSeconds = utils.setSeconds(valueOrReferenceDate, rawValue);
          const start = dateWithNewSeconds;
          const end = dateWithNewSeconds;

          return !containsValidTime({ start, end }) || !isValidValue(rawValue);
        }

        default:
          throw new Error('not supported');
      }
    },
    [
      ampm,
      valueOrReferenceDate,
      disableIgnoringDatePartForTimeValidation,
      maxTime,
      meridiemMode,
      minTime,
      minutesStep,
      shouldDisableTime,
      utils,
      disableFuture,
      disablePast,
      now,
      views,
    ],
  );

  const selectedId = useId();

  const viewProps = React.useMemo<
    Pick<ClockProps<TDate>, 'onChange' | 'viewValue' | 'children'>
  >(() => {
    switch (view) {
      case 'hours': {
        const handleHoursChange = (hourValue: number, isFinish?: PickerSelectionState) => {
          const valueWithMeridiem = convertValueToMeridiem(hourValue, meridiemMode, ampm);
          setValueAndGoToNextView(
            utils.setHours(valueOrReferenceDate, valueWithMeridiem),
            isFinish,
            'hours',
          );
        };

        return {
          onChange: handleHoursChange,
          viewValue: utils.getHours(valueOrReferenceDate),
          children: getHourNumbers({
            value,
            utils,
            ampm,
            onChange: handleHoursChange,
            getClockNumberText: translations.hoursClockNumberText,
            isDisabled: (hourValue) => disabled || isTimeDisabled(hourValue, 'hours'),
            selectedId,
          }),
        };
      }

      case 'minutes': {
        const minutesValue = utils.getMinutes(valueOrReferenceDate);
        const handleMinutesChange = (minuteValue: number, isFinish?: PickerSelectionState) => {
          setValueAndGoToNextView(
            utils.setMinutes(valueOrReferenceDate, minuteValue),
            isFinish,
            'minutes',
          );
        };

        return {
          viewValue: minutesValue,
          onChange: handleMinutesChange,
          children: getMinutesNumbers<TDate>({
            utils,
            value: minutesValue,
            onChange: handleMinutesChange,
            getClockNumberText: translations.minutesClockNumberText,
            isDisabled: (minuteValue) => disabled || isTimeDisabled(minuteValue, 'minutes'),
            selectedId,
          }),
        };
      }

      case 'seconds': {
        const secondsValue = utils.getSeconds(valueOrReferenceDate);
        const handleSecondsChange = (secondValue: number, isFinish?: PickerSelectionState) => {
          setValueAndGoToNextView(
            utils.setSeconds(valueOrReferenceDate, secondValue),
            isFinish,
            'seconds',
          );
        };

        return {
          viewValue: secondsValue,
          onChange: handleSecondsChange,
          children: getMinutesNumbers({
            utils,
            value: secondsValue,
            onChange: handleSecondsChange,
            getClockNumberText: translations.secondsClockNumberText,
            isDisabled: (secondValue) => disabled || isTimeDisabled(secondValue, 'seconds'),
            selectedId,
          }),
        };
      }

      default:
        throw new Error('You must provide the type for ClockView');
    }
  }, [
    view,
    utils,
    value,
    ampm,
    translations.hoursClockNumberText,
    translations.minutesClockNumberText,
    translations.secondsClockNumberText,
    meridiemMode,
    setValueAndGoToNextView,
    valueOrReferenceDate,
    isTimeDisabled,
    selectedId,
    disabled,
  ]);

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  return (
    <TimeClockRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <Clock<TDate>
        autoFocus={autoFocus ?? !!focusedView}
        ampmInClock={ampmInClock && views.includes('hours')}
        value={value}
        type={view}
        ampm={ampm}
        minutesStep={minutesStep}
        isTimeDisabled={isTimeDisabled}
        meridiemMode={meridiemMode}
        handleMeridiemChange={handleMeridiemChange}
        selectedId={selectedId}
        disabled={disabled}
        readOnly={readOnly}
        {...viewProps}
      />
      {showViewSwitcher && (
        <TimeClockArrowSwitcher
          className={classes.arrowSwitcher}
          slots={slots}
          slotProps={slotProps}
          onGoToPrevious={() => setView(previousView!)}
          isPreviousDisabled={!previousView}
          previousLabel={translations.openPreviousView}
          onGoToNext={() => setView(nextView!)}
          isNextDisabled={!nextView}
          nextLabel={translations.openNextView}
          ownerState={ownerState}
        />
      )}
    </TimeClockRoot>
  );
}) as TimeClockComponent;

TimeClock.propTypes = {
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
   * @default false
   */
  ampmInClock: PropTypes.bool,
  /**
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */
  autoFocus: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue: PropTypes.object,
  /**
   * If `true`, the picker views and text field are disabled.
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
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * Controlled focused view.
   */
  focusedView: PropTypes.oneOf(['hours', 'minutes', 'seconds']),
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
   * Callback fired when the value changes.
   * @template TValue The value type. Will be either the same type as `value` or `null`. Can be in `[start, end]` format in case of range value.
   * @template TView The view type. Will be one of date or time views.
   * @param {TValue} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
   * @param {TView | undefined} selectedView Indicates the view in which the selection has been made.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired on focused view change.
   * @template TView
   * @param {TView} view The new view to focus or not.
   * @param {boolean} hasFocus `true` if the view should be focused.
   */
  onFocusedViewChange: PropTypes.func,
  /**
   * Callback fired on view change.
   * @template TView
   * @param {TView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * The default visible view.
   * Used when the component view is not controlled.
   * Must be a valid option from `views` list.
   */
  openTo: PropTypes.oneOf(['hours', 'minutes', 'seconds']),
  /**
   * If `true`, the picker views and text field are read-only.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid time using the validation props, except callbacks such as `shouldDisableTime`.
   */
  referenceDate: PropTypes.object,
  /**
   * Disable specific time.
   * @template TDate
   * @param {TDate} value The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   */
  shouldDisableTime: PropTypes.func,
  showViewSwitcher: PropTypes.bool,
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
  view: PropTypes.oneOf(['hours', 'minutes', 'seconds']),
  /**
   * Available views.
   * @default ['hours', 'minutes']
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours', 'minutes', 'seconds']).isRequired),
} as any;
