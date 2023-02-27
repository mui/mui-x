import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import composeClasses from '@mui/utils/composeClasses';
import useControlled from '@mui/utils/useControlled';
import { useUtils, useNow } from '../internals/hooks/useUtils';
import {
  convertValueToMeridiem,
  createIsAfterIgnoreDatePart,
  MeridiemEnum,
} from '../internals/utils/time-utils';
import { useViews } from '../internals/hooks/useViews';
import type { PickerSelectionState } from '../internals/hooks/usePicker';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { TimeView, ClockTimeView } from '../internals/models';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { getDesktopTimeClockUtilityClass } from './desktopTimeClockClasses';
import { DesktopTimeClockSection } from './DesktopTimeClockSection';
import { DesktopTimeClockProps, DesktopTimeClockSectionViewProps } from './DesktopTimeClock.types';
import { getHourSectionOptions, getTimeSectionOptions } from './desktopTimeClock.utils';

const useUtilityClasses = (ownerState: DesktopTimeClockProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getDesktopTimeClockUtilityClass, classes);
};

const DesktopTimeClockRoot = styled(PickerViewRoot, {
  name: 'MuiDesktopTimeClock',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: DesktopTimeClockProps<any> }>({
  display: 'flex',
  flexDirection: 'row',
});

type DesktopTimeClockComponent = (<TDate>(
  props: DesktopTimeClockProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const DesktopTimeClock = React.forwardRef(function DesktopTimeClock<TDate extends unknown>(
  inProps: DesktopTimeClockProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const now = useNow<TDate>();
  const utils = useUtils<TDate>();

  const props = useThemeProps({
    props: inProps,
    name: 'MuiDesktopTimeClock',
  });

  const {
    ampm = utils.is12HourCycleInCurrentLocale(),
    timeStep = 5,
    autoFocus,
    components,
    componentsProps,
    slots,
    slotProps,
    value: valueProp,
    disableIgnoringDatePartForTimeValidation = false,
    maxTime,
    minTime,
    disableFuture,
    disablePast,
    minutesStep = 1,
    shouldDisableClock,
    shouldDisableTime,
    onChange,
    defaultValue,
    view: inView,
    views = ['hours', 'minutes'],
    openTo,
    onViewChange,
    className,
    disabled,
    readOnly,
    ...other
  } = props;

  const [value, setValue] = useControlled({
    name: 'DesktopTimeClock',
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

  const { view, setFinalValue, setValueAndGoToNextView } = useViews<TDate | null, ClockTimeView>({
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

  const buildViewProps = React.useCallback(
    (viewToBuild: ClockTimeView): DesktopTimeClockSectionViewProps<number> => {
      const lastView = views[views.length - 1];
      switch (viewToBuild) {
        case 'hours': {
          const handleHoursChange = (hours: number | MeridiemEnum) => {
            if (typeof hours !== 'number') {
              return;
            }
            const valueWithMeridiem = convertValueToMeridiem(hours, meridiemMode, ampm);
            setValueAndGoToNextView(
              utils.setHours(selectedTimeOrMidnight, valueWithMeridiem),
              'finish',
            );
          };
          return {
            onChange: handleHoursChange,
            items: getHourSectionOptions({
              now,
              value,
              ampm,
              utils,
              isDisabled: (hours) => disabled || isTimeDisabled(hours, 'hours'),
            }),
          };
        }

        case 'minutes': {
          const minutesValue = utils.getMinutes(selectedTimeOrMidnight);
          const handleMinutesChange = (minutes: number | MeridiemEnum) => {
            if (typeof minutes !== 'number') {
              return;
            }
            if (utils.isValid(value) && lastView === 'minutes') {
              setFinalValue(utils.setMinutes(selectedTimeOrMidnight, minutes));
            } else {
              setValueAndGoToNextView(utils.setMinutes(selectedTimeOrMidnight, minutes), 'finish');
            }
          };

          return {
            onChange: handleMinutesChange,
            items: getTimeSectionOptions({
              value: minutesValue,
              isDisabled: (minutes) => disabled || isTimeDisabled(minutes, 'minutes'),
              resolveLabel: (minutes) => utils.format(utils.setMinutes(now, minutes), 'minutes'),
              timeStep,
              hasValue: !!value,
            }),
          };
        }

        case 'seconds': {
          const secondsValue = utils.getSeconds(selectedTimeOrMidnight);
          const handleSecondsChange = (seconds: number | MeridiemEnum) => {
            if (typeof seconds !== 'number') {
              return;
            }
            if (utils.isValid(value) && lastView === 'seconds') {
              setFinalValue(utils.setSeconds(selectedTimeOrMidnight, seconds));
            } else {
              setValueAndGoToNextView(utils.setSeconds(selectedTimeOrMidnight, seconds), 'finish');
            }
          };

          return {
            onChange: handleSecondsChange,
            items: getTimeSectionOptions({
              value: secondsValue,
              isDisabled: (seconds) => disabled || isTimeDisabled(seconds, 'seconds'),
              resolveLabel: (seconds) => utils.format(utils.setSeconds(now, seconds), 'seconds'),
              timeStep,
            }),
          };
        }

        default:
          throw new Error(`Unknown view: ${viewToBuild} found.`);
      }
    },
    [
      views,
      now,
      value,
      ampm,
      utils,
      meridiemMode,
      setValueAndGoToNextView,
      selectedTimeOrMidnight,
      disabled,
      isTimeDisabled,
      timeStep,
      setFinalValue,
    ],
  );

  const viewTimeOptions = React.useMemo(() => {
    return views.reduce((result, currentView) => {
      return { ...result, [currentView]: buildViewProps(currentView) };
    }, {} as Record<ClockTimeView, DesktopTimeClockSectionViewProps<number>>);
  }, [views, buildViewProps]);

  const meridiemOptions = React.useMemo<DesktopTimeClockSectionViewProps<MeridiemEnum>>(
    () => ({
      onChange: handleMeridiemChange,
      items: [
        { value: 'am', label: 'AM', isSelected: () => meridiemMode === 'am' },
        { value: 'pm', label: 'PM', isSelected: () => meridiemMode === 'pm' },
      ],
    }),
    [handleMeridiemChange, meridiemMode],
  );

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  return (
    <DesktopTimeClockRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      {Object.entries(viewTimeOptions).map(([timeView, viewOptions]) => (
        <DesktopTimeClockSection
          key={timeView}
          items={viewOptions.items}
          onChange={viewOptions.onChange}
          autoFocus={autoFocus ?? view === timeView}
          disabled={disabled}
          readOnly={readOnly}
        />
      ))}
      {ampm && (
        <DesktopTimeClockSection
          key="meridiem"
          items={meridiemOptions.items}
          onChange={meridiemOptions.onChange}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}
    </DesktopTimeClockRoot>
  );
}) as DesktopTimeClockComponent;

DesktopTimeClock.propTypes = {
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
   * @deprecated Please use `slots`.
   */
  components: PropTypes.object,
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
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
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overrideable component slots.
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
