import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import composeClasses from '@mui/utils/composeClasses';
import useControlled from '@mui/utils/useControlled';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import useForkRef from '@mui/utils/useForkRef';
import { useUtils, useNow } from '../internals/hooks/useUtils';
import { createIsAfterIgnoreDatePart } from '../internals/utils/time-utils';
import type { PickerSelectionState } from '../internals/hooks/usePicker';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { getDigitalClockUtilityClass } from './digitalClockClasses';
import { DigitalClockProps } from './DigitalClock.types';

const useUtilityClasses = (ownerState: DigitalClockProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    list: ['list'],
    item: ['item'],
  };

  return composeClasses(slots, getDigitalClockUtilityClass, classes);
};

const DigitalClockRoot = styled(PickerViewRoot, {
  name: 'MuiDigitalClock',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: DigitalClockProps<any> }>({
  overflowY: 'auto',
});

const DigitalClockList = styled(MenuList, {
  name: 'MuiDigitalClock',
  slot: 'List',
  overridesResolver: (props, styles) => styles.list,
})({});

const DigitalClockItem = styled(MenuItem, {
  name: 'MuiDigitalClock',
  slot: 'Item',
  overridesResolver: (props, styles) => styles.item,
})({});

type DigitalClockComponent = (<TDate>(
  props: DigitalClockProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const DigitalClock = React.forwardRef(function DigitalClock<TDate extends unknown>(
  inProps: DigitalClockProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const now = useNow<TDate>();
  const utils = useUtils<TDate>();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(ref, containerRef);

  const props = useThemeProps({
    props: inProps,
    name: 'MuiDigitalClock',
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
    openTo,
    onViewChange,
    className,
    disabled,
    readOnly,
    views,
    ...other
  } = props;

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const [value, setValue] = useControlled({
    name: 'DigitalClock',
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

  React.useEffect(() => {
    if (containerRef.current === null) {
      return;
    }
    const selectedItem = containerRef.current.querySelector<HTMLElement>('ul [tabindex="0"]');
    if (!selectedItem) {
      return;
    }
    // make sure the selected item is focused (possibly instead of the wrapper - MenuList)
    selectedItem.focus();
    // Taken from useScroll in x-data-grid, but vertically centered
    const offsetHeight = selectedItem.offsetHeight;
    const offsetTop = selectedItem.offsetTop;

    const clientHeight = containerRef.current.clientHeight;
    const scrollTop = containerRef.current.scrollTop;

    const elementBottom = offsetTop + offsetHeight;

    if (offsetHeight > clientHeight || offsetTop < scrollTop) {
      // item already visible
      return;
    }

    containerRef.current.scrollTop = elementBottom - clientHeight / 2 - offsetHeight / 2;
  }, [ref]);

  const selectedTimeOrMidnight = React.useMemo(
    () => value || utils.setSeconds(utils.setMinutes(utils.setHours(now, 0), 0), 0),
    [value, now, utils],
  );

  const isTimeDisabled = React.useCallback(
    (valueToCheck: TDate) => {
      const isAfter = createIsAfterIgnoreDatePart(disableIgnoringDatePartForTimeValidation, utils);

      const containsValidTime = () => {
        if (minTime && isAfter(minTime, valueToCheck)) {
          return false;
        }

        if (maxTime && isAfter(valueToCheck, maxTime)) {
          return false;
        }

        if (disableFuture && isAfter(valueToCheck, now)) {
          return false;
        }

        if (disablePast && isAfter(now, valueToCheck)) {
          return false;
        }

        return true;
      };

      const isValidValue = () => {
        if (utils.getMinutes(valueToCheck) % minutesStep !== 0) {
          return false;
        }

        if (shouldDisableClock?.(utils.toJsDate(valueToCheck).getTime(), 'digital')) {
          return false;
        }

        if (shouldDisableTime) {
          return !shouldDisableTime(valueToCheck, 'digital');
        }

        return true;
      };

      return !containsValidTime() || !isValidValue();
    },
    [
      disableIgnoringDatePartForTimeValidation,
      utils,
      minTime,
      maxTime,
      disableFuture,
      now,
      disablePast,
      minutesStep,
      shouldDisableClock,
      shouldDisableTime,
    ],
  );

  const timeOptions = React.useMemo(() => {
    const startOfDay = utils.startOfDay(selectedTimeOrMidnight);
    return [
      startOfDay,
      ...Array.from({ length: (24 * 60) / timeStep - 1 }, (_, index) =>
        utils.addMinutes(startOfDay, timeStep * (index + 1)),
      ),
      utils.endOfDay(selectedTimeOrMidnight),
    ];
  }, [selectedTimeOrMidnight, timeStep, utils]);

  return (
    <DigitalClockRoot
      ref={handleRef}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <DigitalClockList autoFocus={autoFocus}>
        {timeOptions.map((option) => (
          <DigitalClockItem
            aria-readonly={readOnly}
            key={utils.toISO(option)}
            onClick={() => !readOnly && handleValueChange(option, 'finish')}
            selected={utils.isEqual(option, value)}
            disabled={disabled || isTimeDisabled(option)}
            disableRipple={readOnly}
          >
            {utils.format(option, ampm ? 'fullTime12h' : 'fullTime24h')}
          </DigitalClockItem>
        ))}
      </DigitalClockList>
    </DigitalClockRoot>
  );
}) as DigitalClockComponent;

DigitalClock.propTypes = {
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
