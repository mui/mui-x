'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useRtl } from '@mui/system/RtlProvider';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  unstable_useControlled as useControlled,
  unstable_composeClasses as composeClasses,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { DefaultizedProps } from '@mui/x-internals/types';
import { PickersMonth } from './PickersMonth';
import { useUtils, useNow, useDefaultDates } from '../internals/hooks/useUtils';
import { getMonthCalendarUtilityClass, MonthCalendarClasses } from './monthCalendarClasses';
import { applyDefaultDate, getMonthsInYear } from '../internals/utils/date-utils';
import { MonthCalendarProps } from './MonthCalendar.types';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { SECTION_TYPE_GRANULARITY } from '../internals/utils/getDefaultReferenceDate';
import { useControlledValueWithTimezone } from '../internals/hooks/useValueWithTimezone';
import { DIALOG_WIDTH } from '../internals/constants/dimensions';
import { PickerOwnerState, PickerValidDate } from '../models';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';

const useUtilityClasses = (classes: Partial<MonthCalendarClasses> | undefined) => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getMonthCalendarUtilityClass, classes);
};

export function useMonthCalendarDefaultizedProps(
  props: MonthCalendarProps,
  name: string,
): DefaultizedProps<MonthCalendarProps, 'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'> {
  const utils = useUtils();
  const defaultDates = useDefaultDates();
  const themeProps = useThemeProps({
    props,
    name,
  });

  return {
    disableFuture: false,
    disablePast: false,
    ...themeProps,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
  };
}

const MonthCalendarRoot = styled('div', {
  name: 'MuiMonthCalendar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: PickerOwnerState }>({
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'stretch',
  padding: '0 4px',
  width: DIALOG_WIDTH,
  // avoid padding increasing width over defined
  boxSizing: 'border-box',
});

type MonthCalendarComponent = ((
  props: MonthCalendarProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

/**
 * Demos:
 *
 * - [DateCalendar](https://mui.com/x/react-date-pickers/date-calendar/)
 *
 * API:
 *
 * - [MonthCalendar API](https://mui.com/x/api/date-pickers/month-calendar/)
 */
export const MonthCalendar = React.forwardRef(function MonthCalendar(
  inProps: MonthCalendarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useMonthCalendarDefaultizedProps(inProps, 'MuiMonthCalendar');
  const {
    className,
    classes: classesProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    disabled,
    disableFuture,
    disablePast,
    maxDate,
    minDate,
    onChange,
    shouldDisableMonth,
    readOnly,
    disableHighlightToday,
    autoFocus = false,
    onMonthFocus,
    hasFocus,
    onFocusedViewChange,
    monthsPerRow = 3,
    timezone: timezoneProp,
    gridLabelId,
    slots,
    slotProps,
    ...other
  } = props;

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'MonthCalendar',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    onChange,
    valueManager: singleItemValueManager,
  });

  const now = useNow(timezone);
  const isRtl = useRtl();
  const utils = useUtils();
  const { ownerState } = usePickerPrivateContext();

  const referenceDate = React.useMemo(
    () =>
      singleItemValueManager.getInitialReferenceValue({
        value,
        utils,
        props,
        timezone,
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.month,
      }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const classes = useUtilityClasses(classesProp);

  const todayMonth = React.useMemo(() => utils.getMonth(now), [utils, now]);

  const selectedMonth = React.useMemo(() => {
    if (value != null) {
      return utils.getMonth(value);
    }

    return null;
  }, [value, utils]);
  const [focusedMonth, setFocusedMonth] = React.useState(
    () => selectedMonth || utils.getMonth(referenceDate),
  );

  const [internalHasFocus, setInternalHasFocus] = useControlled({
    name: 'MonthCalendar',
    state: 'hasFocus',
    controlled: hasFocus,
    default: autoFocus ?? false,
  });

  const changeHasFocus = useEventCallback((newHasFocus: boolean) => {
    setInternalHasFocus(newHasFocus);

    if (onFocusedViewChange) {
      onFocusedViewChange(newHasFocus);
    }
  });

  const isMonthDisabled = React.useCallback(
    (dateToValidate: PickerValidDate) => {
      const firstEnabledMonth = utils.startOfMonth(
        disablePast && utils.isAfter(now, minDate) ? now : minDate,
      );

      const lastEnabledMonth = utils.startOfMonth(
        disableFuture && utils.isBefore(now, maxDate) ? now : maxDate,
      );

      const monthToValidate = utils.startOfMonth(dateToValidate);

      if (utils.isBefore(monthToValidate, firstEnabledMonth)) {
        return true;
      }

      if (utils.isAfter(monthToValidate, lastEnabledMonth)) {
        return true;
      }

      if (!shouldDisableMonth) {
        return false;
      }

      return shouldDisableMonth(monthToValidate);
    },
    [disableFuture, disablePast, maxDate, minDate, now, shouldDisableMonth, utils],
  );

  const handleMonthSelection = useEventCallback((event: React.MouseEvent, month: number) => {
    if (readOnly) {
      return;
    }

    const newDate = utils.setMonth(value ?? referenceDate, month);
    handleValueChange(newDate);
  });

  const focusMonth = useEventCallback((month: number) => {
    if (!isMonthDisabled(utils.setMonth(value ?? referenceDate, month))) {
      setFocusedMonth(month);
      changeHasFocus(true);
      if (onMonthFocus) {
        onMonthFocus(month);
      }
    }
  });

  React.useEffect(() => {
    setFocusedMonth((prevFocusedMonth) =>
      selectedMonth !== null && prevFocusedMonth !== selectedMonth
        ? selectedMonth
        : prevFocusedMonth,
    );
  }, [selectedMonth]);

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent, month: number) => {
    const monthsInYear = 12;
    const monthsInRow = 3;

    switch (event.key) {
      case 'ArrowUp':
        focusMonth((monthsInYear + month - monthsInRow) % monthsInYear);
        event.preventDefault();
        break;
      case 'ArrowDown':
        focusMonth((monthsInYear + month + monthsInRow) % monthsInYear);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        focusMonth((monthsInYear + month + (isRtl ? 1 : -1)) % monthsInYear);

        event.preventDefault();
        break;
      case 'ArrowRight':
        focusMonth((monthsInYear + month + (isRtl ? -1 : 1)) % monthsInYear);

        event.preventDefault();
        break;
      default:
        break;
    }
  });

  const handleMonthFocus = useEventCallback((event: React.FocusEvent, month: number) => {
    focusMonth(month);
  });

  const handleMonthBlur = useEventCallback((event: React.FocusEvent, month: number) => {
    if (focusedMonth === month) {
      changeHasFocus(false);
    }
  });

  return (
    <MonthCalendarRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      role="radiogroup"
      aria-labelledby={gridLabelId}
      {...other}
    >
      {getMonthsInYear(utils, value ?? referenceDate).map((month) => {
        const monthNumber = utils.getMonth(month);
        const monthText = utils.format(month, 'monthShort');
        const monthLabel = utils.format(month, 'month');
        const isSelected = monthNumber === selectedMonth;
        const isDisabled = disabled || isMonthDisabled(month);

        return (
          <PickersMonth
            key={monthText}
            selected={isSelected}
            value={monthNumber}
            onClick={handleMonthSelection}
            onKeyDown={handleKeyDown}
            autoFocus={internalHasFocus && monthNumber === focusedMonth}
            disabled={isDisabled}
            tabIndex={monthNumber === focusedMonth && !isDisabled ? 0 : -1}
            onFocus={handleMonthFocus}
            onBlur={handleMonthBlur}
            aria-current={todayMonth === monthNumber ? 'date' : undefined}
            aria-label={monthLabel}
            monthsPerRow={monthsPerRow}
            slots={slots}
            slotProps={slotProps}
          >
            {monthText}
          </PickersMonth>
        );
      })}
    </MonthCalendarRoot>
  );
}) as MonthCalendarComponent;

MonthCalendar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
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
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */
  disablePast: PropTypes.bool,
  gridLabelId: PropTypes.string,
  hasFocus: PropTypes.bool,
  /**
   * Maximal selectable date.
   * @default 2099-12-31
   */
  maxDate: PropTypes.object,
  /**
   * Minimal selectable date.
   * @default 1900-01-01
   */
  minDate: PropTypes.object,
  /**
   * Months rendered per row.
   * @default 3
   */
  monthsPerRow: PropTypes.oneOf([3, 4]),
  /**
   * Callback fired when the value changes.
   * @param {PickerValidDate} value The new value.
   */
  onChange: PropTypes.func,
  onFocusedViewChange: PropTypes.func,
  onMonthFocus: PropTypes.func,
  /**
   * If `true`, the component is read-only.
   * When read-only, the value cannot be changed but the user can interact with the interface.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid month using the validation props, except callbacks such as `shouldDisableMonth`.
   */
  referenceDate: PropTypes.object,
  /**
   * Disable specific month.
   * @param {PickerValidDate} month The month to test.
   * @returns {boolean} If `true`, the month will be disabled.
   */
  shouldDisableMonth: PropTypes.func,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
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
} as any;
