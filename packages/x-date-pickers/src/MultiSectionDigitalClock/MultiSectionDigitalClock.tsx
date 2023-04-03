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
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { getMultiSectionDigitalClockUtilityClass } from './multiSectionDigitalClockClasses';
import { MultiSectionDigitalClockSection } from './MultiSectionDigitalClockSection';
import {
  MultiSectionDigitalClockProps,
  MultiSectionDigitalClockViewProps,
} from './MultiSectionDigitalClock.types';
import { getHourSectionOptions, getTimeSectionOptions } from './MultiSectionDigitalClock.utils';
import { TimeView } from '../models';

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
})<{ ownerState: MultiSectionDigitalClockProps<any> }>({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  padding: '4px 0',
});

type MultiSectionDigitalClockComponent = (<TDate>(
  props: MultiSectionDigitalClockProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const MultiSectionDigitalClock = React.forwardRef(function MultiSectionDigitalClock<
  TDate extends unknown,
>(inProps: MultiSectionDigitalClockProps<TDate>, ref: React.Ref<HTMLDivElement>) {
  const now = useNow<TDate>();
  const utils = useUtils<TDate>();

  const props = useThemeProps({
    props: inProps,
    name: 'MuiMultiSectionDigitalClock',
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
    focusedView,
    onFocusedViewChange,
    className,
    disabled,
    readOnly,
    ...other
  } = props;

  const [value, setValue] = useControlled({
    name: 'MultiSectionDigitalClock',
    state: 'value',
    controlled: valueProp,
    default: defaultValue ?? null,
  });
  const [focusMeridiem, setFocusMeridiem] = React.useState(false);

  const handleValueChange = useEventCallback(
    (newValue: TDate | null, selectionState?: PickerSelectionState) => {
      setValue(newValue);
      onChange?.(newValue, selectionState);
    },
  );

  const { view, setValueAndGoToNextView, setValueAndGoToView } = useViews<TDate | null, TimeView>({
    view: inView,
    views,
    openTo,
    onViewChange,
    onChange: handleValueChange,
    focusedView,
    onFocusedViewChange,
  });

  const selectedTimeOrMidnight = React.useMemo(
    () => value || utils.setSeconds(utils.setMinutes(utils.setHours(now, 0), 0), 0),
    [value, now, utils],
  );

  const { meridiemMode, handleMeridiemChange } = useMeridiemMode<TDate>(
    selectedTimeOrMidnight,
    ampm,
    setValueAndGoToNextView,
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

  const handleSectionChange = useEventCallback((sectionView: TimeView, newValue: TDate | null) => {
    const viewIndex = views.indexOf(sectionView);
    const nextView = views[viewIndex + 1];
    const isNextViewMeridiem = !nextView && ampm;
    setValueAndGoToView(newValue, nextView);
    setFocusMeridiem(isNextViewMeridiem);
  });

  const buildViewProps = React.useCallback(
    (viewToBuild: TimeView): MultiSectionDigitalClockViewProps<number> => {
      switch (viewToBuild) {
        case 'hours': {
          const handleHoursChange = (hours) => {
            if (typeof hours !== 'number') {
              return;
            }
            const valueWithMeridiem = convertValueToMeridiem(hours, meridiemMode, ampm);
            handleSectionChange('hours', utils.setHours(selectedTimeOrMidnight, valueWithMeridiem));
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
          const handleMinutesChange = (minutes) => {
            if (typeof minutes !== 'number') {
              return;
            }
            handleSectionChange('minutes', utils.setMinutes(selectedTimeOrMidnight, minutes));
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
          const handleSecondsChange = (seconds) => {
            if (typeof seconds !== 'number') {
              return;
            }
            handleSectionChange('seconds', utils.setSeconds(selectedTimeOrMidnight, seconds));
          };

          return {
            onChange: handleSecondsChange,
            items: getTimeSectionOptions({
              value: secondsValue,
              isDisabled: (seconds) => disabled || isTimeDisabled(seconds, 'seconds'),
              resolveLabel: (seconds) => utils.format(utils.setSeconds(now, seconds), 'seconds'),
              timeStep,
              hasValue: !!value,
            }),
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
      meridiemMode,
      handleSectionChange,
      selectedTimeOrMidnight,
      disabled,
      isTimeDisabled,
      timeStep,
    ],
  );

  const viewTimeOptions = React.useMemo(() => {
    return views.reduce((result, currentView) => {
      return { ...result, [currentView]: buildViewProps(currentView) };
    }, {} as Record<TimeView, MultiSectionDigitalClockViewProps<number>>);
  }, [views, buildViewProps]);

  const meridiemOptions = React.useMemo<MultiSectionDigitalClockViewProps<MeridiemEnum>>(
    () => ({
      onChange: handleMeridiemChange,
      items: [
        {
          value: 'am',
          label: utils.getMeridiemText('am'),
          isSelected: () => !!value && meridiemMode === 'am',
        },
        {
          value: 'pm',
          label: utils.getMeridiemText('pm'),
          isSelected: () => !!value && meridiemMode === 'pm',
        },
      ],
    }),
    [handleMeridiemChange, meridiemMode, utils, value],
  );

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  return (
    <MultiSectionDigitalClockRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      {Object.entries(viewTimeOptions).map(([timeView, viewOptions]) => (
        <MultiSectionDigitalClockSection
          key={timeView}
          items={viewOptions.items}
          onChange={viewOptions.onChange}
          active={view === timeView}
          autoFocus={autoFocus ?? focusedView === view}
          disabled={disabled}
          readOnly={readOnly}
        />
      ))}
      {ampm && (
        <MultiSectionDigitalClockSection
          key="meridiem"
          items={meridiemOptions.items}
          onChange={meridiemOptions.onChange}
          disabled={disabled}
          active={!focusedView}
          autoFocus={autoFocus ? !focusedView : false}
          readOnly={readOnly}
          shouldFocus={focusMeridiem}
        />
      )}
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
