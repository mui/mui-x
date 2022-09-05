import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, useTheme } from '@mui/system';
import { styled, useThemeProps, Theme } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import '@mui/material/utils';
import {
  unstable_useControlled as useControlled,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { PickersYear } from './PickersYear';
import { useUtils, useNow, useDefaultDates } from '../internals/hooks/useUtils';
import { NonNullablePickerChangeHandler } from '../internals/hooks/useViews';
import { WrapperVariantContext } from '../internals/components/wrappers/WrapperVariantContext';
import { YearPickerClasses, getYearPickerUtilityClass } from './yearPickerClasses';
import { BaseDateValidationProps, YearValidationProps } from '../internals/hooks/validation/models';
import { DefaultizedProps } from '../internals/models/helpers';
import { parseNonNullablePickerDate } from '../internals/utils/date-utils';

const useUtilityClasses = (ownerState: any) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getYearPickerUtilityClass, classes);
};

function useYearPickerDefaultizedProps<TDate>(
  props: YearPickerProps<TDate>,
  name: string,
): DefaultizedProps<
  YearPickerProps<TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
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
    minDate: parseNonNullablePickerDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: parseNonNullablePickerDate(utils, themeProps.maxDate, defaultDates.maxDate),
  };
}

const YearPickerRoot = styled('div', {
  name: 'MuiYearPicker',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: YearPickerProps<any> }>({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflowY: 'auto',
  height: '100%',
  margin: '0 4px',
});

export interface YearPickerProps<TDate>
  extends YearValidationProps<TDate>,
    BaseDateValidationProps<TDate> {
  autoFocus?: boolean;
  /**
   * className applied to the root element.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<YearPickerClasses>;
  /** Date value for the YearPicker */
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
  onYearFocus?: (year: number) => void;
  hasFocus?: boolean;
  onFocusedViewChange?: (newHasFocus: boolean) => void;
}

type YearPickerComponent = (<TDate>(props: YearPickerProps<TDate>) => JSX.Element) & {
  propTypes?: any;
};

export const YearPicker = React.forwardRef(function YearPicker<TDate>(
  inProps: YearPickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const now = useNow<TDate>();
  const theme = useTheme();
  const utils = useUtils<TDate>();
  const wrapperVariant = React.useContext(WrapperVariantContext);

  const props = useYearPickerDefaultizedProps(inProps, 'MuiYearPicker');
  const {
    autoFocus,
    className,
    date,
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
    ...other
  } = props;

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const selectedDateOrToday = date ?? now;
  const todayYear = React.useMemo(() => utils.getYear(now), [utils, now]);
  const selectedYear = React.useMemo(() => {
    if (date != null) {
      return utils.getYear(date);
    }

    if (disableHighlightToday) {
      return null;
    }

    return utils.getYear(now);
  }, [now, date, utils, disableHighlightToday]);
  const [focusedYear, setFocusedYear] = React.useState(() => selectedYear || todayYear);

  const [internalHasFocus, setInternalHasFocus] = useControlled<boolean>({
    name: 'YearPicker',
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
      if (shouldDisableYear && shouldDisableYear(dateToValidate)) {
        return true;
      }
      return false;
    },
    [disableFuture, disablePast, maxDate, minDate, now, shouldDisableYear, utils],
  );

  const handleYearSelection = (event: React.MouseEvent, year: number) => {
    if (readOnly) {
      return;
    }

    const newDate = utils.setYear(selectedDateOrToday, year);
    onChange(newDate, 'finish');
  };

  const focusYear = React.useCallback(
    (year: number) => {
      if (!isYearDisabled(utils.setYear(selectedDateOrToday, year))) {
        setFocusedYear(year);
        changeHasFocus(true);
        onYearFocus?.(year);
      }
    },
    [isYearDisabled, utils, selectedDateOrToday, changeHasFocus, onYearFocus],
  );

  React.useEffect(() => {
    setFocusedYear((prevFocusedYear) =>
      selectedYear !== null && prevFocusedYear !== selectedYear ? selectedYear : prevFocusedYear,
    );
  }, [selectedYear]);

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent, year: number) => {
    const yearsInRow = wrapperVariant === 'desktop' ? 4 : 3;

    switch (event.key) {
      case 'ArrowUp':
        focusYear(year - yearsInRow);
        event.preventDefault();
        break;
      case 'ArrowDown':
        focusYear(year + yearsInRow);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        focusYear(year + (theme.direction === 'ltr' ? -1 : 1));
        event.preventDefault();
        break;
      case 'ArrowRight':
        focusYear(year + (theme.direction === 'ltr' ? 1 : -1));
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

  return (
    <YearPickerRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      {utils.getYearRange(minDate, maxDate).map((year) => {
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
            tabIndex={yearNumber === focusedYear ? 0 : -1}
            onFocus={handleYearFocus}
            onBlur={handleYearBlur}
            aria-current={todayYear === yearNumber ? 'date' : undefined}
          >
            {utils.format(year, 'year')}
          </PickersYear>
        );
      })}
    </YearPickerRoot>
  );
}) as YearPickerComponent;

YearPicker.propTypes = {
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
   * Date value for the YearPicker
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
  onYearFocus: PropTypes.func,
  /**
   * If `true` picker is readonly
   */
  readOnly: PropTypes.bool,
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view @DateIOType.
   * @template TDate
   * @param {TDate} year The year to test.
   * @returns {boolean} Returns `true` if the year should be disabled.
   */
  shouldDisableYear: PropTypes.func,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;
