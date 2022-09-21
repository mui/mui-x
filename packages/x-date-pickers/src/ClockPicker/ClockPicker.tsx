import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/material/utils';
import { styled, Theme, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { SxProps } from '@mui/system';
import { Clock, ClockProps } from './Clock';
import { useUtils, useNow, useLocaleText } from '../internals/hooks/useUtils';
import { buildDeprecatedPropsWarning } from '../internals/utils/warning';
import { getHourNumbers, getMinutesNumbers } from './ClockNumbers';
import {
  PickersArrowSwitcher,
  PickersArrowSwitcherSlotsComponent,
  PickersArrowSwitcherSlotsComponentsProps,
} from '../internals/components/PickersArrowSwitcher';
import { convertValueToMeridiem, createIsAfterIgnoreDatePart } from '../internals/utils/time-utils';
import { PickerOnChangeFn, useViews } from '../internals/hooks/useViews';
import { PickerSelectionState } from '../internals/hooks/usePickerState';
import { ExportedTimeValidationProps } from '../internals/hooks/validation/useTimeValidation';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { ClockPickerView, MuiPickersAdapter } from '../internals/models';
import { getClockPickerUtilityClass, ClockPickerClasses } from './clockPickerClasses';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';

const useUtilityClasses = (ownerState: ClockPickerProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    arrowSwitcher: ['arrowSwitcher'],
  };

  return composeClasses(slots, getClockPickerUtilityClass, classes);
};

export interface ExportedClockPickerProps<TDate> extends ExportedTimeValidationProps<TDate> {
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
  /**
   * Accessible text that helps user to understand which time and view is selected.
   * @template TDate
   * @param {ClockPickerView} view The current view rendered.
   * @param {TDate | null} time The current time.
   * @param {MuiPickersAdapter<TDate>} adapter The current date adapter.
   * @returns {string} The clock label.
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
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

export interface ClockPickerSlotsComponent extends PickersArrowSwitcherSlotsComponent {}

export interface ClockPickerSlotsComponentsProps extends PickersArrowSwitcherSlotsComponentsProps {}

export interface ClockPickerProps<TDate> extends ExportedClockPickerProps<TDate> {
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
  classes?: Partial<ClockPickerClasses>;
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<ClockPickerSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<ClockPickerSlotsComponentsProps>;
  /**
   * Selected date @DateIOType.
   */
  value: TDate | null;
  /**
   * Get clock number aria-text for hours.
   * @param {string} hours The hours to format.
   * @returns {string} the formatted hours text.
   * @default (hours: string) => `${hours} hours`
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  getHoursClockNumberText?: (hours: string) => string;
  /**
   * Get clock number aria-text for minutes.
   * @param {string} minutes The minutes to format.
   * @returns {string} the formatted minutes text.
   * @default (minutes: string) => `${minutes} minutes`
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  getMinutesClockNumberText?: (minutes: string) => string;
  /**
   * Get clock number aria-text for seconds.
   * @param {string} seconds The seconds to format.
   * @returns {string} the formatted seconds text.
   * @default (seconds: string) => `${seconds} seconds`
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  getSecondsClockNumberText?: (seconds: string) => string;
  /**
   * On change callback @DateIOType.
   */
  onChange: PickerOnChangeFn<TDate>;
  showViewSwitcher?: boolean;
  /**
   * Controlled open view.
   */
  view?: ClockPickerView;
  /**
   * Views for calendar picker.
   * @default ['hours', 'minutes']
   */
  views?: readonly ClockPickerView[];
  /**
   * Callback fired on view change.
   * @param {ClockPickerView} view The new view.
   */
  onViewChange?: (view: ClockPickerView) => void;
  /**
   * Initially open view.
   * @default 'hours'
   */
  openTo?: ClockPickerView;
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

const ClockPickerRoot = styled(PickerViewRoot, {
  name: 'MuiClockPicker',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: ClockPickerProps<any> }>({
  display: 'flex',
  flexDirection: 'column',
});

const ClockPickerArrowSwitcher = styled(PickersArrowSwitcher, {
  name: 'MuiClockPicker',
  slot: 'ArrowSwitcher',
  overridesResolver: (props, styles) => styles.arrowSwitcher,
})<{ ownerState: ClockPickerProps<any> }>({
  position: 'absolute',
  right: 12,
  top: 15,
});

type ClockPickerComponent = (<TDate>(
  props: ClockPickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

const deprecatedPropsWarning = buildDeprecatedPropsWarning(
  'Props for translation are deprecated. See https://mui.com/x/react-date-pickers/localization for more information.',
);

/**
 *
 * API:
 *
 * - [ClockPicker API](https://mui.com/x/api/date-pickers/clock-picker/)
 */
export const ClockPicker = React.forwardRef(function ClockPicker<TDate extends unknown>(
  inProps: ClockPickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
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
    value,
    disableIgnoringDatePartForTimeValidation,
    getClockLabelText: getClockLabelTextProp,
    getHoursClockNumberText: getHoursClockNumberTextProp,
    getMinutesClockNumberText: getMinutesClockNumberTextProp,
    getSecondsClockNumberText: getSecondsClockNumberTextProp,
    maxTime,
    minTime,
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

  deprecatedPropsWarning({
    getClockLabelText: getClockLabelTextProp,
    getHoursClockNumberText: getHoursClockNumberTextProp,
    getMinutesClockNumberText: getMinutesClockNumberTextProp,
    getSecondsClockNumberText: getSecondsClockNumberTextProp,
  });

  const localeText = useLocaleText();

  const getClockLabelText = getClockLabelTextProp ?? localeText.clockLabelText;
  const getHoursClockNumberText = getHoursClockNumberTextProp ?? localeText.hoursClockNumberText;
  const getMinutesClockNumberText =
    getMinutesClockNumberTextProp ?? localeText.minutesClockNumberText;
  const getSecondsClockNumberText =
    getSecondsClockNumberTextProp ?? localeText.secondsClockNumberText;

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
    (rawValue: number, viewType: ClockPickerView) => {
      const isAfter = createIsAfterIgnoreDatePart(disableIgnoringDatePartForTimeValidation, utils);

      const containsValidTime = ({ start, end }: { start: TDate; end: TDate }) => {
        if (minTime && isAfter(minTime, end)) {
          return false;
        }

        if (maxTime && isAfter(start, maxTime)) {
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
            getClockNumberText: getHoursClockNumberText,
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
            getClockNumberText: getMinutesClockNumberText,
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
            getClockNumberText: getSecondsClockNumberText,
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
    getHoursClockNumberText,
    getMinutesClockNumberText,
    getSecondsClockNumberText,
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
    <ClockPickerRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      sx={sx}
    >
      {showViewSwitcher && (
        <ClockPickerArrowSwitcher
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
        getClockLabelText={getClockLabelText}
        minutesStep={minutesStep}
        isTimeDisabled={isTimeDisabled}
        meridiemMode={meridiemMode}
        handleMeridiemChange={handleMeridiemChange}
        selectedId={selectedId}
        disabled={disabled}
        readOnly={readOnly}
        {...viewProps}
      />
    </ClockPickerRoot>
  );
}) as ClockPickerComponent;

ClockPicker.propTypes = {
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
   * Do not ignore date part when validating min/max time.
   * @default false
   */
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,
  /**
   * Accessible text that helps user to understand which time and view is selected.
   * @template TDate
   * @param {ClockPickerView} view The current view rendered.
   * @param {TDate | null} time The current time.
   * @param {MuiPickersAdapter<TDate>} adapter The current date adapter.
   * @returns {string} The clock label.
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
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
   * @param {string} hours The hours to format.
   * @returns {string} the formatted hours text.
   * @default (hours: string) => `${hours} hours`
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  getHoursClockNumberText: PropTypes.func,
  /**
   * Get clock number aria-text for minutes.
   * @param {string} minutes The minutes to format.
   * @returns {string} the formatted minutes text.
   * @default (minutes: string) => `${minutes} minutes`
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  getMinutesClockNumberText: PropTypes.func,
  /**
   * Get clock number aria-text for seconds.
   * @param {string} seconds The seconds to format.
   * @returns {string} the formatted seconds text.
   * @default (seconds: string) => `${seconds} seconds`
   * @deprecated Use the `localeText` prop of `LocalizationProvider` instead, see https://mui.com/x/react-date-pickers/localization
   */
  getSecondsClockNumberText: PropTypes.func,
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
   * On change callback @DateIOType.
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Callback fired on view change.
   * @param {ClockPickerView} view The new view.
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
   * Dynamically check if time is disabled or not.
   * If returns `false` appropriate time point will ot be acceptable.
   * @param {number} timeValue The value to check.
   * @param {ClockPickerView} view The view of the timeValue.
   * @returns {boolean} Returns `true` if the time should be disabled
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
