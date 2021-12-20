import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import { Clock } from './Clock';
import { pipe } from '../../utils/utils';
import { useUtils, useNow } from '../../hooks/useUtils';
import { getHourNumbers, getMinutesNumbers } from './ClockNumbers';
import { PickersArrowSwitcher } from '../../internal/pickers/PickersArrowSwitcher';
import {
  convertValueToMeridiem,
  createIsAfterIgnoreDatePart,
  TimeValidationProps,
} from '../../utils/time-utils';
import { PickerOnChangeFn } from '../../hooks/useViews';
import { PickerSelectionState } from '../../hooks/usePickerState';
import { useMeridiemMode } from '../../hooks/date-helpers-hooks';
import { ClockPickerView, MuiPickersAdapter } from '../../models';
import { getClockPickerUtilityClass, ClockPickerClasses } from './clockPickerClasses';
import { DesktopDatePickerProps } from '@mui/x-date-picker';

export interface ClockPickerComponentsPropsOverrides {}

const useUtilityClasses = (ownerState: ClockPickerInternalProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    arrowSwitcher: ['arrowSwitcher'],
  };

  return composeClasses(slots, getClockPickerUtilityClass, classes);
};

export interface ExportedClockPickerProps<TDate> extends TimeValidationProps<TDate> {
  /**
   * 12h/24h view for hour selection clock.
   * @default false
   */
  ampm?: boolean;
  /**
   * Step over minutes.
   * @default 1
   */
  minutesStep?: number;
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default false
   */
  ampmInClock?: boolean;
  /**
   * Accessible text that helps user to understand which time and view is selected.
   * @param {ClockPickerView} view The current view rendered.
   * @param {TDate | null} time The current time.
   * @param {MuiPickersAdapter<TDate>} adapter The current date adapter.
   * @returns {string} The clock label.
   * @default <TDate extends any>(
   *   view: ClockView,
   *   time: TDate | null,
   *   adapter: MuiPickersAdapter<TDate>,
   * ) =>
   *   `Select ${view}. ${
   *     time === null ? 'No time selected' : `Selected time is ${adapter.format(time, 'fullTime')}`
   *   }`
   */
  getClockLabelText?: (
    view: ClockPickerView,
    time: TDate | null,
    adapter: MuiPickersAdapter<TDate>,
  ) => string;
}

export interface ClockPickerInternalProps<TDate> extends ExportedClockPickerProps<TDate> {
  /**
   * Set to `true` if focus should be moved to clock picker.
   */
  autoFocus?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ClockPickerClasses>;
  /**
   * The components used for each slot.
   * Either a string to use a HTML element or a component.
   */
  components?: {
    LeftArrowButton?: React.ElementType;
    LeftArrowIcon?: React.ElementType;
    RightArrowButton?: React.ElementType;
    RightArrowIcon?: React.ElementType;
  };

  /**
   * The props used for each slot inside.
   */
  componentsProps?: {
    leftArrowButton?: React.SVGAttributes<SVGSVGElement> & ClockPickerComponentsPropsOverrides;
    rightArrowButton?: React.SVGAttributes<SVGSVGElement> & ClockPickerComponentsPropsOverrides;
  };

  /**
   * Selected date @DateIOType.
   */
  date: TDate | null;
  /**
   * Get clock number aria-text for hours.
   * @param {string} hours The hours to format.
   * @returns {string} the formatted hours text.
   * @default (hours: string) => `${hours} hours`
   */
  getHoursClockNumberText?: (hours: string) => string;
  /**
   * Get clock number aria-text for minutes.
   * @param {string} minutes The minutes to format.
   * @returns {string} the formatted minutes text.
   * @default (minutes: string) => `${minutes} minutes`
   */
  getMinutesClockNumberText?: (minutes: string) => string;
  /**
   * Get clock number aria-text for seconds.
   * @param {string} seconds The seconds to format.
   * @returns {string} the formatted seconds text.
   * @default (seconds: string) => `${seconds} seconds`
   */
  getSecondsClockNumberText?: (seconds: string) => string;
  /**
   * Left arrow icon aria-label text.
   * @default 'open previous view'
   */
  leftArrowButtonText?: string;
  previousViewAvailable: boolean;
  nextViewAvailable: boolean;
  /**
   * On change callback @DateIOType.
   */
  onChange: PickerOnChangeFn<TDate>;
  openNextView: () => void;
  openPreviousView: () => void;
  /**
   * Right arrow icon aria-label text.
   * @default 'open next view'
   */
  rightArrowButtonText?: string;
  showViewSwitcher?: boolean;
  view: ClockPickerView;
}

const ClockPickerArrowSwitcher = styled(PickersArrowSwitcher, {
  name: 'MuiClockPicker',
  slot: 'ArrowSwticher',
  overridesResolver: (props, styles) => styles.arrowSwitcher,
})<{ ownerState: ClockPickerInternalProps<any> }>({
  position: 'absolute',
  right: 12,
  top: 15,
});

const defaultGetClockLabelText = <TDate extends unknown>(
  view: ClockPickerView,
  time: TDate | null,
  adapter: MuiPickersAdapter<TDate>,
) =>
  `Select ${view}. ${
    time === null ? 'No time selected' : `Selected time is ${adapter.format(time, 'fullTime')}`
  }`;

const defaultGetMinutesClockNumberText = (minutes: string) => `${minutes} minutes`;

const defaultGetHoursClockNumberText = (hours: string) => `${hours} hours`;

const defaultGetSecondsClockNumberText = (seconds: string) => `${seconds} seconds`;

type ClockPickerComponent = (<TDate>(props: ClockPickerInternalProps<TDate>) => JSX.Element) & {
  propTypes?: any;
};

/**
 *
 * API:
 *
 * - [ClockPicker API](https://mui.com/api/clock-picker/)
 */
export const ClockPickerInternal = (<TDate extends unknown>(
  inProps: ClockPickerInternalProps<TDate>,
) => {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiClockPicker',
  });

  const {
    ampm = false,
    ampmInClock = false,
    autoFocus,
    components,
    componentsProps,
    date,
    disableIgnoringDatePartForTimeValidation = false,
    getClockLabelText = defaultGetClockLabelText,
    getHoursClockNumberText = defaultGetHoursClockNumberText,
    getMinutesClockNumberText = defaultGetMinutesClockNumberText,
    getSecondsClockNumberText = defaultGetSecondsClockNumberText,
    leftArrowButtonText = 'open previous view',
    maxTime,
    minTime,
    minutesStep = 1,
    nextViewAvailable,
    onChange,
    openNextView,
    openPreviousView,
    previousViewAvailable,
    rightArrowButtonText = 'open next view',
    shouldDisableTime,
    showViewSwitcher,
    view,
  } = props;

  const now = useNow<TDate>();
  const utils = useUtils<TDate>();
  const midnight = utils.setSeconds(utils.setMinutes(utils.setHours(now, 0), 0), 0);
  const dateOrMidnight = date || midnight;

  const { meridiemMode, handleMeridiemChange } = useMeridiemMode<TDate>(
    dateOrMidnight,
    ampm,
    onChange,
  );

  const isTimeDisabled = React.useCallback(
    (rawValue: number, viewType: ClockPickerView) => {
      if (date === null) {
        return false;
      }

      const validateTimeValue = (getRequestedTimePoint: (when: 'start' | 'end') => TDate) => {
        const isAfterComparingFn = createIsAfterIgnoreDatePart(
          disableIgnoringDatePartForTimeValidation,
          utils,
        );

        return Boolean(
          (minTime && isAfterComparingFn(minTime, getRequestedTimePoint('end'))) ||
            (maxTime && isAfterComparingFn(getRequestedTimePoint('start'), maxTime)) ||
            (shouldDisableTime && shouldDisableTime(rawValue, viewType)),
        );
      };

      switch (viewType) {
        case 'hours': {
          const hoursWithMeridiem = convertValueToMeridiem(rawValue, meridiemMode, ampm);
          return validateTimeValue((when: 'start' | 'end') =>
            pipe(
              (currentDate) => utils.setHours(currentDate, hoursWithMeridiem),
              (dateWithHours) => utils.setMinutes(dateWithHours, when === 'start' ? 0 : 59),
              (dateWithMinutes) => utils.setSeconds(dateWithMinutes, when === 'start' ? 0 : 59),
            )(date),
          );
        }

        case 'minutes':
          return validateTimeValue((when: 'start' | 'end') =>
            pipe(
              (currentDate) => utils.setMinutes(currentDate, rawValue),
              (dateWithMinutes) => utils.setSeconds(dateWithMinutes, when === 'start' ? 0 : 59),
            )(date),
          );

        case 'seconds':
          return validateTimeValue(() => utils.setSeconds(date, rawValue));

        default:
          throw new Error('not supported');
      }
    },
    [
      ampm,
      date,
      disableIgnoringDatePartForTimeValidation,
      maxTime,
      meridiemMode,
      minTime,
      shouldDisableTime,
      utils,
    ],
  );

  const selectedId = useId();

  const viewProps = React.useMemo(() => {
    switch (view) {
      case 'hours': {
        const handleHoursChange = (value: number, isFinish?: PickerSelectionState) => {
          const valueWithMeridiem = convertValueToMeridiem(value, meridiemMode, ampm);
          onChange(utils.setHours(dateOrMidnight, valueWithMeridiem), isFinish);
        };

        return {
          onChange: handleHoursChange,
          value: utils.getHours(dateOrMidnight),
          children: getHourNumbers({
            date,
            utils,
            ampm,
            onChange: handleHoursChange,
            getClockNumberText: getHoursClockNumberText,
            isDisabled: (value) => isTimeDisabled(value, 'hours'),
            selectedId,
          }),
        };
      }

      case 'minutes': {
        const minutesValue = utils.getMinutes(dateOrMidnight);
        const handleMinutesChange = (value: number, isFinish?: PickerSelectionState) => {
          onChange(utils.setMinutes(dateOrMidnight, value), isFinish);
        };

        return {
          value: minutesValue,
          onChange: handleMinutesChange,
          children: getMinutesNumbers({
            utils,
            value: minutesValue,
            onChange: handleMinutesChange,
            getClockNumberText: getMinutesClockNumberText,
            isDisabled: (value) => isTimeDisabled(value, 'minutes'),
            selectedId,
          }),
        };
      }

      case 'seconds': {
        const secondsValue = utils.getSeconds(dateOrMidnight);
        const handleSecondsChange = (value: number, isFinish?: PickerSelectionState) => {
          onChange(utils.setSeconds(dateOrMidnight, value), isFinish);
        };

        return {
          value: secondsValue,
          onChange: handleSecondsChange,
          children: getMinutesNumbers({
            utils,
            value: secondsValue,
            onChange: handleSecondsChange,
            getClockNumberText: getSecondsClockNumberText,
            isDisabled: (value) => isTimeDisabled(value, 'seconds'),
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
    date,
    ampm,
    getHoursClockNumberText,
    getMinutesClockNumberText,
    getSecondsClockNumberText,
    meridiemMode,
    onChange,
    dateOrMidnight,
    isTimeDisabled,
    selectedId,
  ]);

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  return (
    <React.Fragment>
      {showViewSwitcher && (
        <ClockPickerArrowSwitcher
          className={classes.arrowSwitcher}
          leftArrowButtonText={leftArrowButtonText}
          rightArrowButtonText={rightArrowButtonText}
          components={components}
          componentsProps={componentsProps}
          onLeftClick={openPreviousView}
          onRightClick={openNextView}
          isLeftDisabled={previousViewAvailable}
          isRightDisabled={nextViewAvailable}
          ownerState={ownerState}
        />
      )}

      <Clock<TDate>
        autoFocus={autoFocus}
        date={date}
        ampmInClock={ampmInClock}
        type={view}
        ampm={ampm}
        getClockLabelText={getClockLabelText}
        minutesStep={minutesStep}
        isTimeDisabled={isTimeDisabled}
        meridiemMode={meridiemMode}
        handleMeridiemChange={handleMeridiemChange}
        selectedId={selectedId}
        {...viewProps}
      />
    </React.Fragment>
  );
}) as ClockPickerComponent;

ClockPickerInternal.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * 12h/24h view for hour selection clock.
   * @default false
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
  /**
   * The components used for each slot.
   * Either a string to use a HTML element or a component.
   */
  components: PropTypes.shape({
    LeftArrowButton: PropTypes.elementType,
    LeftArrowIcon: PropTypes.elementType,
    RightArrowButton: PropTypes.elementType,
    RightArrowIcon: PropTypes.elementType,
  }),
  /**
   * The props used for each slot inside.
   */
  componentsProps: PropTypes.object,
  /**
   * Selected date @DateIOType.
   */
  date: PropTypes.any,
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,
  /**
   * Accessible text that helps user to understand which time and view is selected.
   * @default <TDate extends any>(
   *   view: ClockView,
   *   time: TDate | null,
   *   adapter: MuiPickersAdapter<TDate>,
   * ) =>
   *   `Select ${view}. ${
   *     time === null ? 'No time selected' : `Selected time is ${adapter.format(time, 'fullTime')}`
   *   }`
   */
  getClockLabelText: PropTypes.func,
  /**
   * Get clock number aria-text for hours.
   * @default (hours: string) => `${hours} hours`
   */
  getHoursClockNumberText: PropTypes.func,
  /**
   * Get clock number aria-text for minutes.
   * @default (minutes: string) => `${minutes} minutes`
   */
  getMinutesClockNumberText: PropTypes.func,
  /**
   * Get clock number aria-text for seconds.
   * @default (seconds: string) => `${seconds} seconds`
   */
  getSecondsClockNumberText: PropTypes.func,
  /**
   * Left arrow icon aria-label text.
   * @default 'open previous view'
   */
  leftArrowButtonText: PropTypes.string,
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
   * @ignore
   */
  nextViewAvailable: PropTypes.bool.isRequired,
  /**
   * On change callback @DateIOType.
   */
  onChange: PropTypes.func.isRequired,
  /**
   * @ignore
   */
  openNextView: PropTypes.func.isRequired,
  /**
   * @ignore
   */
  openPreviousView: PropTypes.func.isRequired,
  /**
   * @ignore
   */
  previousViewAvailable: PropTypes.bool.isRequired,
  /**
   * Right arrow icon aria-label text.
   * @default 'open next view'
   */
  rightArrowButtonText: PropTypes.string,
  /**
   * Dynamically check if time is disabled or not.
   * If returns `false` appropriate time point will ot be acceptable.
   */
  shouldDisableTime: PropTypes.func,
  /**
   * @ignore
   */
  showViewSwitcher: PropTypes.bool,
  /**
   * @ignore
   */
  view: PropTypes.oneOf(['hours', 'minutes', 'seconds']).isRequired,
} as any;
