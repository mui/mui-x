import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_useControlled as useControlled,
  unstable_useId as useId,
} from '@mui/utils';
import useEventCallback from '@mui/utils/useEventCallback';
import { Clock, ClockProps } from './Clock';
import { useUtils, useNow, useLocaleText } from '../internals/hooks/useUtils';
import { getHourNumbers, getMinutesNumbers } from './ClockNumbers';
import { PickersArrowSwitcher } from '../internals/components/PickersArrowSwitcher';
import { convertValueToMeridiem, createIsAfterIgnoreDatePart } from '../internals/utils/time-utils';
import { useViews } from '../internals/hooks/useViews';
import { PickerSelectionState } from '../internals/hooks/usePickerState';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { TimeView } from '../internals/models';
import { getTimeClockUtilityClass } from './timeClockClasses';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { TimeClockProps } from './TimeClock.types';

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

type TimeClockComponent = (<TDate>(
  props: TimeClockProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

/**
 *
 * API:
 *
 * - [TimeClock API](https://mui.com/x/api/date-pickers/time-clock/)
 */
export const TimeClock = React.forwardRef(function TimeClock<TDate extends unknown>(
  inProps: TimeClockProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const localeText = useLocaleText<TDate>();
  const now = useNow<TDate>();
  const utils = useUtils<TDate>();

  const props = useThemeProps({
    props: inProps,
    name: 'MuiTimeClock',
  });

  const {
    ampm = utils.is12HourCycleInCurrentLocale(),
    ampmInClock = false,
    autoFocus,
    components,
    componentsProps,
    value: valueProp,
    disableIgnoringDatePartForTimeValidation = false,
    maxTime,
    minTime,
    disableFuture,
    disablePast,
    minutesStep = 1,
    shouldDisableClock,
    shouldDisableTime,
    showViewSwitcher,
    onChange,
    defaultValue,
    view: inView,
    views = ['hours', 'minutes'],
    openTo,
    onViewChange,
    className,
    sx,
    disabled,
    readOnly,
  } = props;

  const [value, setValue] = useControlled({
    name: 'DateCalendar',
    state: 'value',
    controlled: valueProp,
    default: defaultValue ?? null,
  });

  const handleValueChange = useEventCallback(
    (newValue: TDate | null, selectionState?: PickerSelectionState) => {
      setValue(newValue);
      onChange?.(newValue, selectionState);
    },
  );

  const { view, setView, previousView, nextView, setValueAndGoToNextView } = useViews({
    view: inView,
    views,
    openTo,
    onViewChange,
    onChange: handleValueChange,
  });

  const selectedTimeOrMidnight = React.useMemo(
    () => value || utils.setSeconds(utils.setMinutes(utils.setHours(now, 0), 0), 0),
    [value, now, utils],
  );

  const { meridiemMode, handleMeridiemChange } = useMeridiemMode<TDate>(
    selectedTimeOrMidnight,
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

        if (shouldDisableClock?.(timeValue, viewType)) {
          return false;
        }

        if (shouldDisableTime) {
          switch (viewType) {
            case 'hours':
              return !shouldDisableTime(utils.setHours(selectedTimeOrMidnight, timeValue), 'hours');
            case 'minutes':
              return !shouldDisableTime(
                utils.setMinutes(selectedTimeOrMidnight, timeValue),
                'minutes',
              );

            case 'seconds':
              return !shouldDisableTime(
                utils.setSeconds(selectedTimeOrMidnight, timeValue),
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
          const dateWithNewHours = utils.setHours(selectedTimeOrMidnight, valueWithMeridiem);
          const start = utils.setSeconds(utils.setMinutes(dateWithNewHours, 0), 0);
          const end = utils.setSeconds(utils.setMinutes(dateWithNewHours, 59), 59);

          return !containsValidTime({ start, end }) || !isValidValue(valueWithMeridiem);
        }

        case 'minutes': {
          const dateWithNewMinutes = utils.setMinutes(selectedTimeOrMidnight, rawValue);
          const start = utils.setSeconds(dateWithNewMinutes, 0);
          const end = utils.setSeconds(dateWithNewMinutes, 59);

          return !containsValidTime({ start, end }) || !isValidValue(rawValue, minutesStep);
        }

        case 'seconds': {
          const dateWithNewSeconds = utils.setSeconds(selectedTimeOrMidnight, rawValue);
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
      selectedTimeOrMidnight,
      disableIgnoringDatePartForTimeValidation,
      maxTime,
      meridiemMode,
      minTime,
      minutesStep,
      shouldDisableClock,
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
            utils.setHours(selectedTimeOrMidnight, valueWithMeridiem),
            isFinish,
          );
        };

        return {
          onChange: handleHoursChange,
          viewValue: utils.getHours(selectedTimeOrMidnight),
          children: getHourNumbers({
            value,
            utils,
            ampm,
            onChange: handleHoursChange,
            getClockNumberText: localeText.hoursClockNumberText,
            isDisabled: (hourValue) => disabled || isTimeDisabled(hourValue, 'hours'),
            selectedId,
          }),
        };
      }

      case 'minutes': {
        const minutesValue = utils.getMinutes(selectedTimeOrMidnight);
        const handleMinutesChange = (minuteValue: number, isFinish?: PickerSelectionState) => {
          setValueAndGoToNextView(utils.setMinutes(selectedTimeOrMidnight, minuteValue), isFinish);
        };

        return {
          viewValue: minutesValue,
          onChange: handleMinutesChange,
          children: getMinutesNumbers<TDate>({
            utils,
            value: minutesValue,
            onChange: handleMinutesChange,
            getClockNumberText: localeText.minutesClockNumberText,
            isDisabled: (minuteValue) => disabled || isTimeDisabled(minuteValue, 'minutes'),
            selectedId,
          }),
        };
      }

      case 'seconds': {
        const secondsValue = utils.getSeconds(selectedTimeOrMidnight);
        const handleSecondsChange = (secondValue: number, isFinish?: PickerSelectionState) => {
          setValueAndGoToNextView(utils.setSeconds(selectedTimeOrMidnight, secondValue), isFinish);
        };

        return {
          viewValue: secondsValue,
          onChange: handleSecondsChange,
          children: getMinutesNumbers({
            utils,
            value: secondsValue,
            onChange: handleSecondsChange,
            getClockNumberText: localeText.secondsClockNumberText,
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
    localeText.hoursClockNumberText,
    localeText.minutesClockNumberText,
    localeText.secondsClockNumberText,
    meridiemMode,
    setValueAndGoToNextView,
    selectedTimeOrMidnight,
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
      sx={sx}
    >
      <Clock<TDate>
        autoFocus={autoFocus}
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
          components={components}
          componentsProps={componentsProps}
          onGoToPrevious={() => setView(previousView!)}
          isPreviousDisabled={!previousView}
          previousLabel={localeText.openPreviousView}
          onGoToNext={() => setView(nextView!)}
          isNextDisabled={!nextView}
          nextLabel={localeText.openNextView}
          ownerState={ownerState}
        />
      )}
    </TimeClockRoot>
  );
}) as TimeClockComponent;

TimeClock.propTypes = {
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
  /**
   * Set to `true` if focus should be moved to clock picker.
   */
  autoFocus: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
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
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue: PropTypes.any,
  /**
   * If `true`, the picker and text field are disabled.
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
   * Maximal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  maxTime: PropTypes.any,
  /**
   * Minimal selectable time.
   * The date part of the object will be ignored unless `props.disableIgnoringDatePartForTimeValidation === true`.
   */
  minTime: PropTypes.any,
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep: PropTypes.number,
  /**
   * Callback fired when the value changes.
   * @template TDate
   * @param {TDate | null} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
   */
  onChange: PropTypes.func,
  /**
   * Callback fired on view change.
   * @param {TimeView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * Initially open view.
   * @default 'hours'
   */
  openTo: PropTypes.oneOf(['hours', 'minutes', 'seconds']),
  /**
   * Make picker read only.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * Disable specific clock time.
   * @param {number} clockValue The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   * @deprecated Consider using `shouldDisableTime`.
   */
  shouldDisableClock: PropTypes.func,
  /**
   * Disable specific time.
   * @param {TDate} value The value to check.
   * @param {TimeView} view The clock type of the timeValue.
   * @returns {boolean} If `true` the time will be disabled.
   */
  shouldDisableTime: PropTypes.func,
  showViewSwitcher: PropTypes.bool,
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
   * Controlled open view.
   */
  view: PropTypes.oneOf(['hours', 'minutes', 'seconds']),
  /**
   * Views for calendar picker.
   * @default ['hours', 'minutes']
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours', 'minutes', 'seconds']).isRequired),
} as any;
