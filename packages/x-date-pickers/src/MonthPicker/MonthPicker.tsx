import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, useTheme } from '@mui/system';
import { styled, useThemeProps, Theme } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  useControlled,
  useEventCallback,
} from '@mui/material';
import { PickersMonth } from './PickersMonth';
import { useUtils, useNow, useDefaultDates } from '../internals/hooks/useUtils';
import { NonNullablePickerChangeHandler } from '../internals/hooks/useViews';
import { MonthPickerClasses, getMonthPickerUtilityClass } from './monthPickerClasses';
import {
  BaseDateValidationProps,
  MonthValidationProps,
} from '../internals/hooks/validation/models';
import { parseNonNullablePickerDate } from '../internals/utils/date-utils';
import { DefaultizedProps } from '../internals/models/helpers';

export interface MonthPickerProps<TDate>
  extends MonthValidationProps<TDate>,
    BaseDateValidationProps<TDate> {
  /**
   * className applied to the root element.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<MonthPickerClasses>;
  /** Date value for the MonthPicker */
  date: TDate | null;
  /** If `true` picker is disabled */
  disabled?: boolean;
  /** Callback fired on date change. */
  onChange: NonNullablePickerChangeHandler<TDate>;
  /** If `true` picker is readonly */
  readOnly?: boolean;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday?: boolean;
  autoFocus?: boolean;
  onMonthFocus?: (month: number) => void;
  hasFocus?: boolean;
  onFocusedViewChange?: (newHasFocus: boolean) => void;
}

const useUtilityClasses = (ownerState: MonthPickerProps<any>) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getMonthPickerUtilityClass, classes);
};

export function useMonthPickerDefaultizedProps<TDate>(
  props: MonthPickerProps<TDate>,
  name: string,
): DefaultizedProps<
  MonthPickerProps<TDate>,
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
    minDate: parseNonNullablePickerDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: parseNonNullablePickerDate(utils, themeProps.maxDate, defaultDates.maxDate),
  };
}

const MonthPickerRoot = styled('div', {
  name: 'MuiMonthPicker',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: MonthPickerProps<any> }>({
  width: 310,
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'stretch',
  margin: '0 4px',
});

type MonthPickerComponent = (<TDate>(
  props: MonthPickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

export const MonthPicker = React.forwardRef(function MonthPicker<TDate>(
  inProps: MonthPickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const utils = useUtils<TDate>();
  const now = useNow<TDate>();
  const props = useMonthPickerDefaultizedProps(inProps, 'MuiMonthPicker');

  const {
    className,
    date,
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
    ...other
  } = props;
  const ownerState = props;
  const classes = useUtilityClasses(ownerState);
  const theme = useTheme();
  const selectedDateOrToday = date ?? now;
  const selectedMonth = React.useMemo(() => {
    if (date != null) {
      return utils.getMonth(date);
    }

    if (disableHighlightToday) {
      return null;
    }

    return utils.getMonth(now);
  }, [now, date, utils, disableHighlightToday]);
  const [focusedMonth, setFocusedMonth] = React.useState<number>(
    () => selectedMonth || utils.getMonth(now),
  );

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

  const onMonthSelect = (month: number) => {
    if (readOnly) {
      return;
    }

    const newDate = utils.setMonth(selectedDateOrToday, month);
    onChange(newDate, 'finish');
  };

  const [internalHasFocus, setInternalHasFocus] = useControlled<boolean>({
    name: 'MonthPicker',
    state: 'hasFocus',
    controlled: hasFocus,
    default: autoFocus,
  });

  const changeHasFocus = React.useCallback(
    (newHasFocus: boolean) => {
      setInternalHasFocus(newHasFocus);

      if (onFocusedViewChange) {
        onFocusedViewChange(newHasFocus);
      }
    },
    [setInternalHasFocus, onFocusedViewChange],
  );

  const focusMonth = React.useCallback(
    (month: number) => {
      if (!isMonthDisabled(utils.setMonth(selectedDateOrToday, month))) {
        setFocusedMonth(month);
        changeHasFocus(true);
        if (onMonthFocus) {
          onMonthFocus(month);
        }
      }
    },
    [selectedDateOrToday, isMonthDisabled, utils, onMonthFocus, changeHasFocus],
  );

  React.useEffect(() => {
    setFocusedMonth((prevFocusedMonth) =>
      selectedMonth !== null && prevFocusedMonth !== selectedMonth
        ? selectedMonth
        : prevFocusedMonth,
    );
  }, [selectedMonth]);

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    const monthsInYear = 12;
    const monthsInRow = 3;

    switch (event.key) {
      case 'ArrowUp':
        focusMonth((monthsInYear + focusedMonth - monthsInRow) % monthsInYear);
        event.preventDefault();
        break;
      case 'ArrowDown':
        focusMonth((monthsInYear + focusedMonth + monthsInRow) % monthsInYear);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        focusMonth(
          (monthsInYear + focusedMonth + (theme.direction === 'ltr' ? -1 : 1)) % monthsInYear,
        );

        event.preventDefault();
        break;
      case 'ArrowRight':
        focusMonth(
          (monthsInYear + focusedMonth + (theme.direction === 'ltr' ? 1 : -1)) % monthsInYear,
        );

        event.preventDefault();
        break;
      default:
        break;
    }
  });

  const handleMonthFocus = React.useCallback(
    (event: React.FocusEvent, month: number) => {
      focusMonth(month);
    },
    [focusMonth],
  );

  const handleMonthBlur = React.useCallback(() => {
    changeHasFocus(false);
  }, [changeHasFocus]);

  const currentMonthNumber = utils.getMonth(now);

  return (
    <MonthPickerRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      onKeyDown={handleKeyDown}
      {...other}
    >
      {utils.getMonthArray(selectedDateOrToday).map((month) => {
        const monthNumber = utils.getMonth(month);
        const monthText = utils.format(month, 'monthShort');
        const isDisabled = disabled || isMonthDisabled(month);

        return (
          <PickersMonth
            key={monthText}
            value={monthNumber}
            selected={monthNumber === selectedMonth}
            tabIndex={monthNumber === focusedMonth && !isDisabled ? 0 : -1}
            hasFocus={internalHasFocus && monthNumber === focusedMonth}
            onSelect={onMonthSelect}
            onFocus={handleMonthFocus}
            onBlur={handleMonthBlur}
            disabled={isDisabled}
            aria-current={currentMonthNumber === monthNumber ? 'date' : undefined}
          >
            {monthText}
          </PickersMonth>
        );
      })}
    </MonthPickerRoot>
  );
}) as MonthPickerComponent;

MonthPicker.propTypes = {
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
   * Date value for the MonthPicker
   */
  date: PropTypes.any,
  /**
   * If `true` picker is disabled
   */
  disabled: PropTypes.bool,
  /**
   * If `true` future days are disabled.
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * If `true` past days are disabled.
   * @default false
   */
  disablePast: PropTypes.bool,
  hasFocus: PropTypes.bool,
  /**
   * Maximal selectable date. @DateIOType
   */
  maxDate: PropTypes.any,
  /**
   * Minimal selectable date. @DateIOType
   */
  minDate: PropTypes.any,
  /**
   * Callback fired on date change.
   */
  onChange: PropTypes.func.isRequired,
  onFocusedViewChange: PropTypes.func,
  onMonthFocus: PropTypes.func,
  /**
   * If `true` picker is readonly
   */
  readOnly: PropTypes.bool,
  /**
   * Disable specific months dynamically.
   * Works like `shouldDisableDate` but for month selection view @DateIOType.
   * @template TDate
   * @param {TDate} month The month to check.
   * @returns {boolean} If `true` the month will be disabled.
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
} as any;
