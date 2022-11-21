import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled, Theme, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses, unstable_useId as useId } from '@mui/utils';
import { SxProps } from '@mui/system';
import { Clock, ClockProps } from './Clock';
import { useUtils, useNow, useLocaleText } from '../internals/hooks/useUtils';
import { getHourNumbers, getMinutesNumbers } from './ClockNumbers';
import {
  PickersArrowSwitcher,
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
} from '../internals/components/PickersArrowSwitcher';
import { convertValueToMeridiem, createIsAfterIgnoreDatePart } from '../internals/utils/time-utils';
import { PickerOnChangeFn, useViews } from '../internals/hooks/useViews';
import { PickerSelectionState } from '../internals/hooks/usePickerState';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { TimeView } from '../internals/models';
import { getTimeClockUtilityClass, TimeClockClasses } from './timeClockClasses';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { BaseTimeValidationProps, TimeValidationProps } from '../internals/hooks/validation/models';

const useUtilityClasses = (ownerState: TimeClockProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    arrowSwitcher: ['arrowSwitcher'],
  };

  return composeClasses(slots, getTimeClockUtilityClass, classes);
};

export interface ExportedTimeClockProps<TDate>
  extends TimeValidationProps<TDate>,
    BaseTimeValidationProps {
  /**
   * 12h/24h view for hour selection clock.
   * @default false
   */
  ampm?: boolean;
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default false
   */
  ampmInClock?: boolean;
}

export interface TimeClockSlotsComponent extends PickersArrowSwitcherSlotsComponent {}

export interface TimeClockSlotsComponentsProps extends PickersArrowSwitcherSlotsComponentsProps {}

export interface TimeClockProps<TDate> extends ExportedTimeClockProps<TDate> {
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Set to `true` if focus should be moved to clock picker.
   */
  autoFocus?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TimeClockClasses>;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: TimeClockSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: TimeClockSlotsComponentsProps;
  /**
   * Selected date @DateIOType.
   */
  value: TDate | null;
  /**
   * On change callback @DateIOType.
   */
  onChange: PickerOnChangeFn<TDate>;
  showViewSwitcher?: boolean;
  /**
   * Controlled open view.
   */
  view?: TimeView;
  /**
   * Views for calendar picker.
   * @default ['hours', 'minutes']
   */
  views?: readonly TimeView[];
  /**
   * Callback fired on view change.
   * @param {TimeView} view The new view.
   */
  onViewChange?: (view: TimeView) => void;
  /**
   * Initially open view.
   * @default 'hours'
   */
  openTo?: TimeView;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Make picker read only.
   * @default false
   */
  readOnly?: boolean;
}

const TimeClockRoot = styled(PickerViewRoot, {
  name: 'MuiTimeClock',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: TimeClockProps<any> }>({
  display: 'flex',
  flexDirection: 'column',
});

const TimeCLockArrowSwitcher = styled(PickersArrowSwitcher, {
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

// TODO v6: Drop showViewSwitcher once the legacy pickers are removed
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
  const props = useThemeProps({
    props: inProps,
    name: 'MuiTimeClock',
  });

  const {
    ampm = false,
    ampmInClock = false,
    autoFocus,
    components,
    componentsProps,
    value,
    disableIgnoringDatePartForTimeValidation = false,
    maxTime,
    minTime,
    disableFuture,
    disablePast,
    minutesStep = 1,
    shouldDisableTime,
    showViewSwitcher,
    onChange,
    view,
    views = ['hours', 'minutes'],
    openTo,
    onViewChange,
    className,
    sx,
    disabled,
    readOnly,
  } = props;

  const localeText = useLocaleText();

  const { openView, setOpenView, nextView, previousView, handleChangeAndOpenNext } = useViews({
    view,
    views,
    openTo,
    onViewChange,
    onChange,
  });

  const now = useNow<TDate>();
  const utils = useUtils<TDate>();

  const selectedTimeOrMidnight = React.useMemo(
    () => value || utils.setSeconds(utils.setMinutes(utils.setHours(now, 0), 0), 0),
    [value, now, utils],
  );

  const { meridiemMode, handleMeridiemChange } = useMeridiemMode<TDate>(
    selectedTimeOrMidnight,
    ampm,
    handleChangeAndOpenNext,
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
          return !shouldDisableTime(timeValue, viewType);
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
    switch (openView) {
      case 'hours': {
        const handleHoursChange = (hourValue: number, isFinish?: PickerSelectionState) => {
          const valueWithMeridiem = convertValueToMeridiem(hourValue, meridiemMode, ampm);
          handleChangeAndOpenNext(
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
          handleChangeAndOpenNext(utils.setMinutes(selectedTimeOrMidnight, minuteValue), isFinish);
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
          handleChangeAndOpenNext(utils.setSeconds(selectedTimeOrMidnight, secondValue), isFinish);
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
    openView,
    utils,
    value,
    ampm,
    localeText.hoursClockNumberText,
    localeText.minutesClockNumberText,
    localeText.secondsClockNumberText,
    meridiemMode,
    handleChangeAndOpenNext,
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
      {showViewSwitcher && (
        <TimeCLockArrowSwitcher
          className={classes.arrowSwitcher}
          components={components}
          componentsProps={componentsProps}
          onGoToPrevious={() => setOpenView(previousView)}
          isPreviousDisabled={!previousView}
          previousLabel={localeText.openPreviousView}
          onGoToNext={() => setOpenView(nextView)}
          isNextDisabled={!nextView}
          nextLabel={localeText.openNextView}
          ownerState={ownerState}
        />
      )}

      <Clock<TDate>
        autoFocus={autoFocus}
        ampmInClock={ampmInClock}
        value={value}
        type={openView}
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
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true` disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,
  /**
   * If `true` disable values after the current date for date components, time for time components and both for date time components.
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
   * On change callback @DateIOType.
   */
  onChange: PropTypes.func.isRequired,
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
   * Disable specific time.
   * @param {number} timeValue The value to check.
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
   * Selected date @DateIOType.
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
