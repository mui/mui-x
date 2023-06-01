import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme } from '@mui/system';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  unstable_useControlled as useControlled,
  unstable_composeClasses as composeClasses,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { PickersMonth } from './PickersMonth';
import { useUtils, useNow, useDefaultDates } from '../internals/hooks/useUtils';
import { getMonthCalendarUtilityClass } from './monthCalendarClasses';
import { applyDefaultDate, getMonthsInYear } from '../internals/utils/date-utils';
import { DefaultizedProps } from '../internals/models/helpers';
import { MonthCalendarProps } from './MonthCalendar.types';

const useUtilityClasses = (ownerState: MonthCalendarProps<any>) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getMonthCalendarUtilityClass, classes);
};

export function useMonthCalendarDefaultizedProps<TDate>(
  props: MonthCalendarProps<TDate>,
  name: string,
): DefaultizedProps<
  MonthCalendarProps<TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
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
})<{ ownerState: MonthCalendarProps<any> }>({
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'stretch',
  padding: '0 4px',
  width: 320,
});

type MonthCalendarComponent = (<TDate>(
  props: MonthCalendarProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const MonthCalendar = React.forwardRef(function MonthCalendar<TDate>(
  inProps: MonthCalendarProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const now = useNow<TDate>();
  const theme = useTheme();
  const utils = useUtils<TDate>();

  const props = useMonthCalendarDefaultizedProps(inProps, 'MuiMonthCalendar');

  const {
    className,
    value: valueProp,
    defaultValue,
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
    ...other
  } = props;

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const [value, setValue] = useControlled({
    name: 'MonthCalendar',
    state: 'value',
    controlled: valueProp,
    default: defaultValue ?? null,
  });

  const todayMonth = React.useMemo(() => utils.getMonth(now), [utils, now]);

  const selectedDateOrStartOfMonth = React.useMemo(
    () => value ?? utils.startOfMonth(now),
    [now, utils, value],
  );

  const selectedMonth = React.useMemo(() => {
    if (value != null) {
      return utils.getMonth(value);
    }

    if (disableHighlightToday) {
      return null;
    }

    return utils.getMonth(now);
  }, [now, value, utils, disableHighlightToday]);
  const [focusedMonth, setFocusedMonth] = React.useState(() => selectedMonth || todayMonth);

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
    (month: TDate) => {
      const firstEnabledMonth = utils.startOfMonth(
        disablePast && utils.isAfter(now, minDate) ? now : minDate,
      );

      const lastEnabledMonth = utils.startOfMonth(
        disableFuture && utils.isBefore(now, maxDate) ? now : maxDate,
      );

      if (utils.isBefore(month, firstEnabledMonth)) {
        return true;
      }

      if (utils.isAfter(month, lastEnabledMonth)) {
        return true;
      }

      if (!shouldDisableMonth) {
        return false;
      }

      return shouldDisableMonth(month);
    },
    [disableFuture, disablePast, maxDate, minDate, now, shouldDisableMonth, utils],
  );

  const handleMonthSelection = useEventCallback((event: React.MouseEvent, month: number) => {
    if (readOnly) {
      return;
    }

    const newDate = utils.setMonth(selectedDateOrStartOfMonth, month);
    setValue(newDate);
    onChange?.(newDate);
  });

  const focusMonth = useEventCallback((month: number) => {
    if (!isMonthDisabled(utils.setMonth(selectedDateOrStartOfMonth, month))) {
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
        focusMonth((monthsInYear + month + (theme.direction === 'ltr' ? -1 : 1)) % monthsInYear);

        event.preventDefault();
        break;
      case 'ArrowRight':
        focusMonth((monthsInYear + month + (theme.direction === 'ltr' ? 1 : -1)) % monthsInYear);

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
      {...other}
    >
      {getMonthsInYear(utils, selectedDateOrStartOfMonth).map((month) => {
        const monthNumber = utils.getMonth(month);
        const monthText = utils.format(month, 'monthShort');
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
            tabIndex={monthNumber === focusedMonth ? 0 : -1}
            onFocus={handleMonthFocus}
            onBlur={handleMonthBlur}
            aria-current={todayMonth === monthNumber ? 'date' : undefined}
            monthsPerRow={monthsPerRow}
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
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  autoFocus: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * className applied to the root element.
   */
  className: PropTypes.string,
  /**
   * The default selected value.
   * Used when the component is not controlled.
   */
  defaultValue: PropTypes.any,
  /**
   * If `true` picker is disabled
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
  hasFocus: PropTypes.bool,
  /**
   * Maximal selectable date.
   */
  maxDate: PropTypes.any,
  /**
   * Minimal selectable date.
   */
  minDate: PropTypes.any,
  /**
   * Months rendered per row.
   * @default 3
   */
  monthsPerRow: PropTypes.oneOf([3, 4]),
  /**
   * Callback fired when the value changes.
   * @template TDate
   * @param {TDate | null} value The new value.
   */
  onChange: PropTypes.func,
  onFocusedViewChange: PropTypes.func,
  onMonthFocus: PropTypes.func,
  /**
   * If `true` picker is readonly
   */
  readOnly: PropTypes.bool,
  /**
   * Disable specific month.
   * @template TDate
   * @param {TDate} month The month to test.
   * @returns {boolean} If `true`, the month will be disabled.
   */
  shouldDisableMonth: PropTypes.func,
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
} as any;
