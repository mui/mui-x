import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useRtl } from '@mui/system/RtlProvider';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  unstable_useForkRef as useForkRef,
  unstable_composeClasses as composeClasses,
  unstable_useControlled as useControlled,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { PickersYear } from './PickersYear';
import { useUtils, useNow, useDefaultDates } from '../internals/hooks/useUtils';
import { getYearCalendarUtilityClass } from './yearCalendarClasses';
import { DefaultizedProps } from '../internals/models/helpers';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { YearCalendarProps } from './YearCalendar.types';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { SECTION_TYPE_GRANULARITY } from '../internals/utils/getDefaultReferenceDate';
import { useControlledValueWithTimezone } from '../internals/hooks/useValueWithTimezone';
import { DIALOG_WIDTH, MAX_CALENDAR_HEIGHT } from '../internals/constants/dimensions';
import { PickerValidDate } from '../models';

const useUtilityClasses = (ownerState: YearCalendarProps<any>) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getYearCalendarUtilityClass, classes);
};

function useYearCalendarDefaultizedProps<TDate extends PickerValidDate>(
  props: YearCalendarProps<TDate>,
  name: string,
): DefaultizedProps<
  YearCalendarProps<TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast' | 'yearsPerRow'
> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  return {
    disablePast: false,
    disableFuture: false,
    ...themeProps,
    yearsPerRow: themeProps.yearsPerRow ?? 3,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
  };
}

const YearCalendarRoot = styled('div', {
  name: 'MuiYearCalendar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: YearCalendarProps<any> }>({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflowY: 'auto',
  height: '100%',
  padding: '0 4px',
  width: DIALOG_WIDTH,
  maxHeight: MAX_CALENDAR_HEIGHT,
  // avoid padding increasing width over defined
  boxSizing: 'border-box',
  position: 'relative',
});

type YearCalendarComponent = (<TDate extends PickerValidDate>(
  props: YearCalendarProps<TDate>,
) => React.JSX.Element) & {
  propTypes?: any;
};

/**
 * Demos:
 *
 * - [DateCalendar](https://mui.com/x/react-date-pickers/date-calendar/)
 *
 * API:
 *
 * - [YearCalendar API](https://mui.com/x/api/date-pickers/year-calendar/)
 */
export const YearCalendar = React.forwardRef(function YearCalendar<TDate extends PickerValidDate>(
  inProps: YearCalendarProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useYearCalendarDefaultizedProps(inProps, 'MuiYearCalendar');
  const {
    autoFocus,
    className,
    value: valueProp,
    defaultValue,
    referenceDate: referenceDateProp,
    disabled,
    disableFuture,
    disablePast,
    maxDate,
    minDate,
    onChange,
    readOnly,
    shouldDisableYear,
    disableHighlightToday,
    onYearFocus,
    hasFocus,
    onFocusedViewChange,
    yearsPerRow,
    timezone: timezoneProp,
    gridLabelId,
    slots,
    slotProps,
    ...other
  } = props;

  const { value, handleValueChange, timezone } = useControlledValueWithTimezone({
    name: 'YearCalendar',
    timezone: timezoneProp,
    value: valueProp,
    defaultValue,
    onChange: onChange as (value: TDate | null) => void,
    valueManager: singleItemValueManager,
  });

  const now = useNow<TDate>(timezone);
  const isRtl = useRtl();
  const utils = useUtils<TDate>();

  const referenceDate = React.useMemo(
    () =>
      singleItemValueManager.getInitialReferenceValue({
        value,
        utils,
        props,
        timezone,
        referenceDate: referenceDateProp,
        granularity: SECTION_TYPE_GRANULARITY.year,
      }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const todayYear = React.useMemo(() => utils.getYear(now), [utils, now]);
  const selectedYear = React.useMemo(() => {
    if (value != null) {
      return utils.getYear(value);
    }
    return null;
  }, [value, utils]);

  const [focusedYear, setFocusedYear] = React.useState(
    () => selectedYear || utils.getYear(referenceDate),
  );

  const [internalHasFocus, setInternalHasFocus] = useControlled({
    name: 'YearCalendar',
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

  const isYearDisabled = React.useCallback(
    (dateToValidate: TDate) => {
      if (disablePast && utils.isBeforeYear(dateToValidate, now)) {
        return true;
      }
      if (disableFuture && utils.isAfterYear(dateToValidate, now)) {
        return true;
      }
      if (minDate && utils.isBeforeYear(dateToValidate, minDate)) {
        return true;
      }
      if (maxDate && utils.isAfterYear(dateToValidate, maxDate)) {
        return true;
      }

      if (!shouldDisableYear) {
        return false;
      }

      const yearToValidate = utils.startOfYear(dateToValidate);
      return shouldDisableYear(yearToValidate);
    },
    [disableFuture, disablePast, maxDate, minDate, now, shouldDisableYear, utils],
  );

  const handleYearSelection = useEventCallback((event: React.MouseEvent, year: number) => {
    if (readOnly) {
      return;
    }

    const newDate = utils.setYear(value ?? referenceDate, year);
    handleValueChange(newDate);
  });

  const focusYear = useEventCallback((year: number) => {
    if (!isYearDisabled(utils.setYear(value ?? referenceDate, year))) {
      setFocusedYear(year);
      changeHasFocus(true);
      onYearFocus?.(year);
    }
  });

  React.useEffect(() => {
    setFocusedYear((prevFocusedYear) =>
      selectedYear !== null && prevFocusedYear !== selectedYear ? selectedYear : prevFocusedYear,
    );
  }, [selectedYear]);

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent, year: number) => {
    switch (event.key) {
      case 'ArrowUp':
        focusYear(year - yearsPerRow);
        event.preventDefault();
        break;
      case 'ArrowDown':
        focusYear(year + yearsPerRow);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        focusYear(year + (isRtl ? 1 : -1));
        event.preventDefault();
        break;
      case 'ArrowRight':
        focusYear(year + (isRtl ? -1 : 1));
        event.preventDefault();
        break;
      default:
        break;
    }
  });

  const handleYearFocus = useEventCallback((event: React.FocusEvent, year: number) => {
    focusYear(year);
  });

  const handleYearBlur = useEventCallback((event: React.FocusEvent, year: number) => {
    if (focusedYear === year) {
      changeHasFocus(false);
    }
  });

  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(ref, scrollerRef);
  React.useEffect(() => {
    if (autoFocus || scrollerRef.current === null) {
      return;
    }
    const tabbableButton = scrollerRef.current.querySelector<HTMLElement>('[tabindex="0"]');
    if (!tabbableButton) {
      return;
    }

    // Taken from useScroll in x-data-grid, but vertically centered
    const offsetHeight = tabbableButton.offsetHeight;
    const offsetTop = tabbableButton.offsetTop;

    const clientHeight = scrollerRef.current.clientHeight;
    const scrollTop = scrollerRef.current.scrollTop;

    const elementBottom = offsetTop + offsetHeight;

    if (offsetHeight > clientHeight || offsetTop < scrollTop) {
      // Button already visible
      return;
    }

    scrollerRef.current.scrollTop = elementBottom - clientHeight / 2 - offsetHeight / 2;
  }, [autoFocus]);

  return (
    <YearCalendarRoot
      ref={handleRef}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      role="radiogroup"
      aria-labelledby={gridLabelId}
      {...other}
    >
      {utils.getYearRange([minDate, maxDate]).map((year) => {
        const yearNumber = utils.getYear(year);
        const isSelected = yearNumber === selectedYear;
        const isDisabled = disabled || isYearDisabled(year);

        return (
          <PickersYear
            key={utils.format(year, 'year')}
            selected={isSelected}
            value={yearNumber}
            onClick={handleYearSelection}
            onKeyDown={handleKeyDown}
            autoFocus={internalHasFocus && yearNumber === focusedYear}
            disabled={isDisabled}
            tabIndex={yearNumber === focusedYear && !isDisabled ? 0 : -1}
            onFocus={handleYearFocus}
            onBlur={handleYearBlur}
            aria-current={todayYear === yearNumber ? 'date' : undefined}
            yearsPerRow={yearsPerRow}
            slots={slots}
            slotProps={slotProps}
          >
            {utils.format(year, 'year')}
          </PickersYear>
        );
      })}
    </YearCalendarRoot>
  );
}) as YearCalendarComponent;

YearCalendar.propTypes = {
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
   * Callback fired when the value changes.
   * @template TDate
   * @param {TDate} value The new value.
   */
  onChange: PropTypes.func,
  onFocusedViewChange: PropTypes.func,
  onYearFocus: PropTypes.func,
  /**
   * If `true` picker is readonly
   */
  readOnly: PropTypes.bool,
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid year using the validation props, except callbacks such as `shouldDisableYear`.
   */
  referenceDate: PropTypes.object,
  /**
   * Disable specific year.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} If `true`, the year will be disabled.
   */
  shouldDisableYear: PropTypes.func,
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
  /**
   * Years rendered per row.
   * @default 3
   */
  yearsPerRow: PropTypes.oneOf([3, 4]),
} as any;
