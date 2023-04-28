import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import composeClasses from '@mui/utils/composeClasses';
import useControlled from '@mui/utils/useControlled';
import { useUtils, useNow, useLocaleText } from '../internals/hooks/useUtils';
import { convertValueToMeridiem, createIsAfterIgnoreDatePart } from '../internals/utils/time-utils';
import { useViews } from '../internals/hooks/useViews';
import type { PickerSelectionState } from '../internals/hooks/usePicker';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { getMultiSectionDigitalClockUtilityClass } from './multiSectionDigitalClockClasses';
import { MultiSectionDigitalClockSection } from './MultiSectionDigitalClockSection';
import {
  MultiSectionDigitalClockProps,
  MultiSectionDigitalClockViewProps,
} from './MultiSectionDigitalClock.types';
import { getHourSectionOptions, getTimeSectionOptions } from './MultiSectionDigitalClock.utils';
import { TimeStepOptions, TimeView } from '../models';
import { TimeViewWithMeridiem } from '../internals/models';

const useUtilityClasses = (ownerState: MultiSectionDigitalClockProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getMultiSectionDigitalClockUtilityClass, classes);
};

const MultiSectionDigitalClockRoot = styled(PickerViewRoot, {
  name: 'MuiMultiSectionDigitalClock',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: MultiSectionDigitalClockProps<any> }>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

type MultiSectionDigitalClockComponent = (<TDate>(
  props: MultiSectionDigitalClockProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const MultiSectionDigitalClock = React.forwardRef(function MultiSectionDigitalClock<
  TDate extends unknown,
>(inProps: MultiSectionDigitalClockProps<TDate>, ref: React.Ref<HTMLDivElement>) {
  const now = useNow<TDate>();
  const utils = useUtils<TDate>();
  const localeText = useLocaleText<TDate>();

  const props = useThemeProps({
    props: inProps,
    name: 'MuiMultiSectionDigitalClock',
  });

  const {
    ampm = utils.is12HourCycleInCurrentLocale(),
    timeSteps: inTimeSteps,
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
    views: inViews = ['hours', 'minutes'],
    openTo,
    onViewChange,
    focusedView: inFocusedView,
    onFocusedViewChange,
    className,
    disabled,
    readOnly,
    skipDisabled = false,
    ...other
  } = props;
  const timeSteps = React.useMemo<Required<TimeStepOptions>>(
    () => ({
      hours: 1,
      minutes: 5,
      seconds: 5,
      ...inTimeSteps,
    }),
    [inTimeSteps],
  );

  const [value, setValue] = useControlled({
    name: 'MultiSectionDigitalClock',
    state: 'value',
    controlled: valueProp,
    default: defaultValue ?? null,
  });

  const handleValueChange = useEventCallback(
    (
      newValue: TDate | null,
      selectionState?: PickerSelectionState,
      selectedView?: TimeViewWithMeridiem,
    ) => {
      setValue(newValue);
      onChange?.(newValue, selectionState, selectedView);
    },
  );

  const views = React.useMemo<readonly TimeViewWithMeridiem[]>(() => {
    if (!ampm || !inViews.includes('hours')) {
      return inViews;
    }
    return inViews.includes('meridiem') ? inViews : [...inViews, 'meridiem'];
  }, [ampm, inViews]);

  const { view, setValueAndGoToView, focusedView } = useViews<TDate | null, TimeViewWithMeridiem>({
    view: inView,
    views,
    openTo,
    onViewChange,
    onChange: handleValueChange,
    focusedView: inFocusedView,
    onFocusedViewChange,
  });

  const selectedTimeOrMidnight = React.useMemo(
    () => value || utils.setSeconds(utils.setMinutes(utils.setHours(now, 0), 0), 0),
    [value, now, utils],
  );

  const handleMeridiemValueChange = useEventCallback((newValue: TDate | null) => {
    setValueAndGoToView(newValue, null, 'meridiem');
  });

  const { meridiemMode, handleMeridiemChange } = useMeridiemMode<TDate>(
    selectedTimeOrMidnight,
    ampm,
    handleMeridiemValueChange,
    'finish',
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

  const handleSectionChange = useEventCallback(
    (sectionView: TimeViewWithMeridiem, newValue: TDate | null) => {
      const viewIndex = views.indexOf(sectionView);
      const nextView = views[viewIndex + 1];
      setValueAndGoToView(newValue, nextView, sectionView);
    },
  );

  const buildViewProps = React.useCallback(
    (viewToBuild: TimeViewWithMeridiem): MultiSectionDigitalClockViewProps<any> => {
      switch (viewToBuild) {
        case 'hours': {
          return {
            onChange: (hours) => {
              const valueWithMeridiem = convertValueToMeridiem(hours, meridiemMode, ampm);
              handleSectionChange(
                'hours',
                utils.setHours(selectedTimeOrMidnight, valueWithMeridiem),
              );
            },
            items: getHourSectionOptions({
              now,
              value,
              ampm,
              utils,
              isDisabled: (hours) => disabled || isTimeDisabled(hours, 'hours'),
              timeStep: timeSteps.hours,
              resolveAriaLabel: localeText.hoursClockNumberText,
            }),
          };
        }

        case 'minutes': {
          return {
            onChange: (minutes) => {
              handleSectionChange('minutes', utils.setMinutes(selectedTimeOrMidnight, minutes));
            },
            items: getTimeSectionOptions({
              value: utils.getMinutes(selectedTimeOrMidnight),
              isDisabled: (minutes) => disabled || isTimeDisabled(minutes, 'minutes'),
              resolveLabel: (minutes) => utils.format(utils.setMinutes(now, minutes), 'minutes'),
              timeStep: timeSteps.minutes,
              hasValue: !!value,
              resolveAriaLabel: localeText.minutesClockNumberText,
            }),
          };
        }

        case 'seconds': {
          return {
            onChange: (seconds) => {
              handleSectionChange('seconds', utils.setSeconds(selectedTimeOrMidnight, seconds));
            },
            items: getTimeSectionOptions({
              value: utils.getSeconds(selectedTimeOrMidnight),
              isDisabled: (seconds) => disabled || isTimeDisabled(seconds, 'seconds'),
              resolveLabel: (seconds) => utils.format(utils.setSeconds(now, seconds), 'seconds'),
              timeStep: timeSteps.seconds,
              hasValue: !!value,
              resolveAriaLabel: localeText.secondsClockNumberText,
            }),
          };
        }

        case 'meridiem': {
          const amLabel = utils.getMeridiemText('am');
          const pmLabel = utils.getMeridiemText('pm');
          return {
            onChange: handleMeridiemChange,
            items: [
              {
                value: 'am',
                label: amLabel,
                isSelected: () => !!value && meridiemMode === 'am',
                ariaLabel: amLabel,
              },
              {
                value: 'pm',
                label: pmLabel,
                isSelected: () => !!value && meridiemMode === 'pm',
                ariaLabel: pmLabel,
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown view: ${viewToBuild} found.`);
      }
    },
    [
      now,
      value,
      ampm,
      utils,
      timeSteps.hours,
      timeSteps.minutes,
      timeSteps.seconds,
      localeText.hoursClockNumberText,
      localeText.minutesClockNumberText,
      localeText.secondsClockNumberText,
      meridiemMode,
      handleSectionChange,
      selectedTimeOrMidnight,
      disabled,
      isTimeDisabled,
      handleMeridiemChange,
    ],
  );

  const viewTimeOptions = React.useMemo(() => {
    return views.reduce((result, currentView) => {
      return { ...result, [currentView]: buildViewProps(currentView) };
    }, {} as Record<TimeViewWithMeridiem, MultiSectionDigitalClockViewProps<number>>);
  }, [views, buildViewProps]);

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  return (
    <MultiSectionDigitalClockRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      role="group"
      {...other}
    >
      {Object.entries(viewTimeOptions).map(([timeView, viewOptions]) => (
        <MultiSectionDigitalClockSection
          key={timeView}
          items={viewOptions.items}
          onChange={viewOptions.onChange}
          active={view === timeView}
          autoFocus={autoFocus ?? focusedView === timeView}
          disabled={disabled}
          readOnly={readOnly}
          slots={slots ?? components}
          slotProps={slotProps ?? componentsProps}
          skipDisabled={skipDisabled}
          aria-label={localeText.selectViewText(timeView as TimeViewWithMeridiem)}
        />
      ))}
    </MultiSectionDigitalClockRoot>
  );
}) as MultiSectionDigitalClockComponent;

MultiSectionDigitalClock.propTypes = {
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
  focusedView: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
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
  openTo: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
  /**
   * If `true`, the picker views and text field are read-only.
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
   * @template TDate
   * @param {TDate} value The value to check.
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
   * The time steps between two time unit options.
   * For example, if `timeStep.minutes = 8`, then the available minute options will be `[0, 8, 16, 24, 32, 40, 48, 56]`.
   * @default{ hours: 1, minutes: 5, seconds: 5 }
   */
  timeSteps: PropTypes.shape({
    hours: PropTypes.number,
    minutes: PropTypes.number,
    seconds: PropTypes.number,
  }),
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value: PropTypes.any,
  /**
   * The visible view.
   * Used when the component view is controlled.
   * Must be a valid option from `views` list.
   */
  view: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']).isRequired),
} as any;
