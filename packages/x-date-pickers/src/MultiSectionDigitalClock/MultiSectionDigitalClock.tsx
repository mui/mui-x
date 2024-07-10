import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useRtl } from '@mui/system/RtlProvider';
import { styled, useThemeProps } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import composeClasses from '@mui/utils/composeClasses';
import { usePickersTranslations } from '../hooks/usePickersTranslations';
import { useUtils, useNow } from '../internals/hooks/useUtils';
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
import { PickerValidDate, TimeStepOptions, TimeView } from '../models';
import { TimeViewWithMeridiem } from '../internals/models';
import { useControlledValueWithTimezone } from '../internals/hooks/useValueWithTimezone';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { useClockReferenceDate } from '../internals/hooks/useClockReferenceDate';
import { formatMeridiem } from '../internals/utils/date-utils';

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

type MultiSectionDigitalClockComponent = (<TDate extends PickerValidDate>(
  props: MultiSectionDigitalClockProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [TimePicker](https://mui.com/x/react-date-pickers/time-picker/)
 * - [DigitalClock](https://mui.com/x/react-date-pickers/digital-clock/)
 *
 * API:
 *
 * - [MultiSectionDigitalClock API](https://mui.com/x/api/date-pickers/multi-section-digital-clock/)
 */
export const MultiSectionDigitalClock = React.forwardRef(function MultiSectionDigitalClock<
  TDate extends PickerValidDate,
>(inProps: MultiSectionDigitalClockProps<TDate>, ref: React.Ref<HTMLDivElement>) {
  const utils = useUtils<TDate>();
  const isRtl = useRtl();

  const props = useThemeProps({
    props: inProps,
    name: 'MuiMultiSectionDigitalClock',
  });

  const {
    ampm = utils.is12HourCycleInCurrentLocale(),
    timeSteps: inTimeSteps,
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
    onChange,
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
    timezone: timezoneProp,
    ...other
  } = props;

  const {
    value,
    handleValueChange: handleRawValueChange,
    timezone,
  } = useControlledValueWithTimezone({
    name: 'MultiSectionDigitalClock',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    onChange,
    valueManager: singleItemValueManager,
  });

  const translations = usePickersTranslations<TDate>();
  const now = useNow<TDate>(timezone);

  const timeSteps = React.useMemo<Required<TimeStepOptions>>(
    () => ({
      hours: 1,
      minutes: 5,
      seconds: 5,
      ...inTimeSteps,
    }),
    [inTimeSteps],
  );

  const valueOrReferenceDate = useClockReferenceDate({
    value,
    referenceDate: referenceDateProp,
    utils,
    props,
    timezone,
  });

  const handleValueChange = useEventCallback(
    (
      newValue: TDate | null,
      selectionState?: PickerSelectionState,
      selectedView?: TimeViewWithMeridiem,
    ) => handleRawValueChange(newValue, selectionState, selectedView),
  );

  const views = React.useMemo<readonly TimeViewWithMeridiem[]>(() => {
    if (!ampm || !inViews.includes('hours')) {
      return inViews;
    }
    return inViews.includes('meridiem') ? inViews : [...inViews, 'meridiem'];
  }, [ampm, inViews]);

  const { view, setValueAndGoToNextView, focusedView } = useViews<
    TDate | null,
    TimeViewWithMeridiem
  >({
    view: inView,
    views,
    openTo,
    onViewChange,
    onChange: handleValueChange,
    focusedView: inFocusedView,
    onFocusedViewChange,
  });

  const handleMeridiemValueChange = useEventCallback((newValue: TDate | null) => {
    setValueAndGoToNextView(newValue, 'finish', 'meridiem');
  });

  const { meridiemMode, handleMeridiemChange } = useMeridiemMode<TDate>(
    valueOrReferenceDate,
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

  const buildViewProps = React.useCallback(
    (viewToBuild: TimeViewWithMeridiem): MultiSectionDigitalClockViewProps<any> => {
      switch (viewToBuild) {
        case 'hours': {
          return {
            onChange: (hours) => {
              const valueWithMeridiem = convertValueToMeridiem(hours, meridiemMode, ampm);
              setValueAndGoToNextView(
                utils.setHours(valueOrReferenceDate, valueWithMeridiem),
                'finish',
                'hours',
              );
            },
            items: getHourSectionOptions({
              now,
              value,
              ampm,
              utils,
              isDisabled: (hours) => isTimeDisabled(hours, 'hours'),
              timeStep: timeSteps.hours,
              resolveAriaLabel: translations.hoursClockNumberText,
              valueOrReferenceDate,
            }),
          };
        }

        case 'minutes': {
          return {
            onChange: (minutes) => {
              setValueAndGoToNextView(
                utils.setMinutes(valueOrReferenceDate, minutes),
                'finish',
                'minutes',
              );
            },
            items: getTimeSectionOptions({
              value: utils.getMinutes(valueOrReferenceDate),
              utils,
              isDisabled: (minutes) => isTimeDisabled(minutes, 'minutes'),
              resolveLabel: (minutes) => utils.format(utils.setMinutes(now, minutes), 'minutes'),
              timeStep: timeSteps.minutes,
              hasValue: !!value,
              resolveAriaLabel: translations.minutesClockNumberText,
            }),
          };
        }

        case 'seconds': {
          return {
            onChange: (seconds) => {
              setValueAndGoToNextView(
                utils.setSeconds(valueOrReferenceDate, seconds),
                'finish',
                'seconds',
              );
            },
            items: getTimeSectionOptions({
              value: utils.getSeconds(valueOrReferenceDate),
              utils,
              isDisabled: (seconds) => isTimeDisabled(seconds, 'seconds'),
              resolveLabel: (seconds) => utils.format(utils.setSeconds(now, seconds), 'seconds'),
              timeStep: timeSteps.seconds,
              hasValue: !!value,
              resolveAriaLabel: translations.secondsClockNumberText,
            }),
          };
        }

        case 'meridiem': {
          const amLabel = formatMeridiem(utils, 'am');
          const pmLabel = formatMeridiem(utils, 'pm');
          return {
            onChange: handleMeridiemChange,
            items: [
              {
                value: 'am',
                label: amLabel,
                isSelected: () => !!value && meridiemMode === 'am',
                isFocused: () => !!valueOrReferenceDate && meridiemMode === 'am',
                ariaLabel: amLabel,
              },
              {
                value: 'pm',
                label: pmLabel,
                isSelected: () => !!value && meridiemMode === 'pm',
                isFocused: () => !!valueOrReferenceDate && meridiemMode === 'pm',
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
      translations.hoursClockNumberText,
      translations.minutesClockNumberText,
      translations.secondsClockNumberText,
      meridiemMode,
      setValueAndGoToNextView,
      valueOrReferenceDate,
      isTimeDisabled,
      handleMeridiemChange,
    ],
  );

  const viewsToRender = React.useMemo(() => {
    if (!isRtl) {
      return views;
    }
    const digitViews = views.filter((v) => v !== 'meridiem');
    const result: TimeViewWithMeridiem[] = digitViews.toReversed();
    if (views.includes('meridiem')) {
      result.push('meridiem');
    }
    return result;
  }, [isRtl, views]);

  const viewTimeOptions = React.useMemo(() => {
    return views.reduce(
      (result, currentView) => {
        return { ...result, [currentView]: buildViewProps(currentView) };
      },
      {} as Record<TimeViewWithMeridiem, MultiSectionDigitalClockViewProps<number>>,
    );
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
      {viewsToRender.map((timeView) => (
        <MultiSectionDigitalClockSection
          key={timeView}
          items={viewTimeOptions[timeView].items}
          onChange={viewTimeOptions[timeView].onChange}
          active={view === timeView}
          autoFocus={autoFocus ?? focusedView === timeView}
          disabled={disabled}
          readOnly={readOnly}
          slots={slots}
          slotProps={slotProps}
          skipDisabled={skipDisabled}
          aria-label={translations.selectViewText(timeView)}
        />
      ))}
    </MultiSectionDigitalClockRoot>
  );
}) as MultiSectionDigitalClockComponent;

MultiSectionDigitalClock.propTypes = {
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
  focusedView: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
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
  openTo: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']),
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
   * Available views.
   * @default ['hours', 'minutes']
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']).isRequired),
} as any;
