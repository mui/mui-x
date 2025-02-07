'use client';
import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { alpha, styled, useThemeProps } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import composeClasses from '@mui/utils/composeClasses';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import useForkRef from '@mui/utils/useForkRef';
import { usePickerTranslations } from '../hooks/usePickerTranslations';
import { useUtils, useNow } from '../internals/hooks/useUtils';
import { createIsAfterIgnoreDatePart } from '../internals/utils/time-utils';
import { PickerViewRoot } from '../internals/components/PickerViewRoot';
import { DigitalClockClasses, getDigitalClockUtilityClass } from './digitalClockClasses';
import { DigitalClockOwnerState, DigitalClockProps } from './DigitalClock.types';
import { useViews } from '../internals/hooks/useViews';
import { PickerValidDate } from '../models';
import { DIGITAL_CLOCK_VIEW_HEIGHT } from '../internals/constants/dimensions';
import { useControlledValueWithTimezone } from '../internals/hooks/useValueWithTimezone';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { useClockReferenceDate } from '../internals/hooks/useClockReferenceDate';
import { getFocusedListItemIndex } from '../internals/utils/utils';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

const useUtilityClasses = (classes: Partial<DigitalClockClasses> | undefined) => {
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
})<{ ownerState: DigitalClockOwnerState }>({
  overflowY: 'auto',
  width: '100%',
  '@media (prefers-reduced-motion: no-preference)': {
    scrollBehavior: 'auto',
  },
  maxHeight: DIGITAL_CLOCK_VIEW_HEIGHT,
  variants: [
    {
      props: { hasDigitalClockAlreadyBeenRendered: true },
      style: {
        '@media (prefers-reduced-motion: no-preference)': {
          scrollBehavior: 'smooth',
        },
      },
    },
  ],
});

const DigitalClockList = styled(MenuList, {
  name: 'MuiDigitalClock',
  slot: 'List',
  overridesResolver: (props, styles) => styles.list,
})({
  padding: 0,
});

const DigitalClockItem = styled(MenuItem, {
  name: 'MuiDigitalClock',
  slot: 'Item',
  overridesResolver: (props, styles) => styles.item,
})(({ theme }) => ({
  padding: '8px 16px',
  margin: '2px 4px',
  '&:first-of-type': {
    marginTop: 4,
  },
  '&:hover': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
  },
  '&.Mui-selected': {
    backgroundColor: (theme.vars || theme).palette.primary.main,
    color: (theme.vars || theme).palette.primary.contrastText,
    '&:focus-visible, &:hover': {
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.focusOpacity})`
      : alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
  },
}));

type DigitalClockComponent = ((
  props: DigitalClockProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [TimePicker](https://mui.com/x/react-date-pickers/time-picker/)
 * - [DigitalClock](https://mui.com/x/react-date-pickers/digital-clock/)
 *
 * API:
 *
 * - [DigitalClock API](https://mui.com/x/api/date-pickers/digital-clock/)
 */
export const DigitalClock = React.forwardRef(function DigitalClock(
  inProps: DigitalClockProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const utils = useUtils();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(ref, containerRef);
  const listRef = React.useRef<HTMLUListElement>(null);

  const props = useThemeProps({
    props: inProps,
    name: 'MuiDigitalClock',
  });

  const {
    ampm = utils.is12HourCycleInCurrentLocale(),
    timeStep = 30,
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
    openTo,
    onViewChange,
    focusedView,
    onFocusedViewChange,
    className,
    classes: classesProp,
    disabled,
    readOnly,
    views = ['hours'],
    skipDisabled = false,
    timezone: timezoneProp,
    ...other
  } = props;

  const {
    value,
    handleValueChange: handleRawValueChange,
    timezone,
  } = useControlledValueWithTimezone({
    name: 'DigitalClock',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange,
    valueManager: singleItemValueManager,
  });

  const translations = usePickerTranslations();
  const now = useNow(timezone);

  const { ownerState: pickerOwnerState } = usePickerPrivateContext();
  const ownerState: DigitalClockOwnerState = {
    ...pickerOwnerState,
    hasDigitalClockAlreadyBeenRendered: !!containerRef.current,
  };

  const classes = useUtilityClasses(classesProp);

  const ClockItem = slots?.digitalClockItem ?? DigitalClockItem;
  const clockItemProps = useSlotProps({
    elementType: ClockItem,
    externalSlotProps: slotProps?.digitalClockItem,
    ownerState,
    className: classes.item,
  });

  const valueOrReferenceDate = useClockReferenceDate({
    value,
    referenceDate: referenceDateProp,
    utils,
    props,
    timezone,
  });

  const handleValueChange = useEventCallback((newValue: PickerValidDate | null) =>
    handleRawValueChange(newValue, 'finish', 'hours'),
  );

  const { setValueAndGoToNextView } = useViews({
    view: inView,
    views,
    openTo,
    onViewChange,
    onChange: handleValueChange,
    focusedView,
    onFocusedViewChange,
  });

  const handleItemSelect = useEventCallback((newValue: PickerValidDate | null) => {
    setValueAndGoToNextView(newValue, 'finish');
  });

  React.useEffect(() => {
    if (containerRef.current === null) {
      return;
    }
    const activeItem = containerRef.current.querySelector<HTMLElement>(
      '[role="listbox"] [role="option"][tabindex="0"], [role="listbox"] [role="option"][aria-selected="true"]',
    );

    if (!activeItem) {
      return;
    }
    const offsetTop = activeItem.offsetTop;
    if (autoFocus || !!focusedView) {
      activeItem.focus();
    }

    // Subtracting the 4px of extra margin intended for the first visible section item
    containerRef.current.scrollTop = offsetTop - 4;
  });

  const isTimeDisabled = React.useCallback(
    (valueToCheck: PickerValidDate) => {
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

        if (shouldDisableTime) {
          return !shouldDisableTime(valueToCheck, 'hours');
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
      shouldDisableTime,
    ],
  );

  const timeOptions = React.useMemo(() => {
    const result: PickerValidDate[] = [];
    const startOfDay = utils.startOfDay(valueOrReferenceDate);
    let nextTimeStepOption = startOfDay;
    while (utils.isSameDay(valueOrReferenceDate, nextTimeStepOption)) {
      result.push(nextTimeStepOption);
      nextTimeStepOption = utils.addMinutes(nextTimeStepOption, timeStep);
    }
    return result;
  }, [valueOrReferenceDate, timeStep, utils]);

  const focusedOptionIndex = timeOptions.findIndex((option) =>
    utils.isEqual(option, valueOrReferenceDate),
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'PageUp': {
        const newIndex = getFocusedListItemIndex(listRef.current!) - 5;
        const children = listRef.current!.children;
        const newFocusedIndex = Math.max(0, newIndex);

        const childToFocus = children[newFocusedIndex];
        if (childToFocus) {
          (childToFocus as HTMLElement).focus();
        }
        event.preventDefault();
        break;
      }
      case 'PageDown': {
        const newIndex = getFocusedListItemIndex(listRef.current!) + 5;
        const children = listRef.current!.children;
        const newFocusedIndex = Math.min(children.length - 1, newIndex);

        const childToFocus = children[newFocusedIndex];
        if (childToFocus) {
          (childToFocus as HTMLElement).focus();
        }
        event.preventDefault();
        break;
      }
      default:
    }
  };

  return (
    <DigitalClockRoot
      ref={handleRef}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      <DigitalClockList
        ref={listRef}
        role="listbox"
        aria-label={translations.timePickerToolbarTitle}
        className={classes.list}
        onKeyDown={handleKeyDown}
      >
        {timeOptions.map((option, index) => {
          if (skipDisabled && isTimeDisabled(option)) {
            return null;
          }
          const isSelected = utils.isEqual(option, value);
          const formattedValue = utils.format(option, ampm ? 'fullTime12h' : 'fullTime24h');
          const tabIndex =
            focusedOptionIndex === index || (focusedOptionIndex === -1 && index === 0) ? 0 : -1;
          return (
            <ClockItem
              key={`${option.valueOf()}-${formattedValue}`}
              onClick={() => !readOnly && handleItemSelect(option)}
              selected={isSelected}
              disabled={disabled || isTimeDisabled(option)}
              disableRipple={readOnly}
              role="option"
              // aria-readonly is not supported here and does not have any effect
              aria-disabled={readOnly}
              aria-selected={isSelected}
              tabIndex={tabIndex}
              {...clockItemProps}
            >
              {formattedValue}
            </ClockItem>
          );
        })}
      </DigitalClockList>
    </DigitalClockRoot>
  );
}) as DigitalClockComponent;

DigitalClock.propTypes = {
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
   * If `true`, the component is disabled.
   * When disabled, the value cannot be changed and no interaction is possible.
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
  focusedView: PropTypes.oneOf(['hours']),
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
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
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
  openTo: PropTypes.oneOf(['hours']),
  /**
   * If `true`, the component is read-only.
   * When read-only, the value cannot be changed but the user can interact with the interface.
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
   * @param {PickerValidDate} value The value to check.
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
   * The time steps between two time options.
   * For example, if `timeStep = 45`, then the available time options will be `[00:00, 00:45, 01:30, 02:15, 03:00, etc.]`.
   * @default 30
   */
  timeStep: PropTypes.number,
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
  view: PropTypes.oneOf(['hours']),
  /**
   * Available views.
   * @default ['hours']
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['hours'])),
} as any;
