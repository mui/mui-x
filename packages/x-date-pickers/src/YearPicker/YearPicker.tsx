import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme, styled, useThemeProps as useThemProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import clsx from 'clsx';
import { PickersYear } from './PickersYear';
import { useUtils, useNow } from '../internals/hooks/useUtils';
import { PickerOnChangeFn } from '../internals/hooks/useViews';
import { findClosestEnabledDate } from '../internals/utils/date-utils';
import { PickerSelectionState } from '../internals/hooks/usePickerState';
import { WrapperVariantContext } from '../internals/components/wrappers/WrapperVariantContext';
import { YearPickerClasses, getYearPickerUtilityClass } from './yearPickerClasses';

export interface ExportedYearPickerProps<TDate> {
  /**
   * Callback firing on year change @DateIOType.
   * @param {TDate} year The new year.
   */
  onYearChange?: (year: TDate) => void;
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view @DateIOType.
   * @param {TDate} year The year to test.
   * @returns {boolean} Return `true` if the year should be disabled.
   */
  shouldDisableYear?: (year: TDate) => boolean;
}

const useUtilityClasses = (ownerState: any) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getYearPickerUtilityClass, classes);
};

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

export interface YearPickerProps<TDate> extends ExportedYearPickerProps<TDate> {
  autoFocus?: boolean;
  className?: string;
  classes?: YearPickerClasses;

  date: TDate | null;
  disabled?: boolean;
  disableFuture?: boolean | null;
  disablePast?: boolean | null;
  isDateDisabled: (day: TDate) => boolean;
  minDate: TDate;
  maxDate: TDate;
  onChange: PickerOnChangeFn<TDate>;
  onFocusedDayChange?: (day: TDate) => void;
  readOnly?: boolean;
}

type YearPickerComponent = (<TDate>(props: YearPickerProps<TDate>) => JSX.Element) & {
  propTypes?: any;
};

export const YearPicker = React.forwardRef(function YearPicker<TDate>(
  inProps: YearPickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemProps({ props: inProps, name: 'MuiYearPicker' });
  const {
    autoFocus,
    className,
    date,
    disabled,
    disableFuture,
    disablePast,
    isDateDisabled,
    maxDate,
    minDate,
    onChange,
    onFocusedDayChange,
    onYearChange,
    readOnly,
    shouldDisableYear,
  } = props;

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const now = useNow<TDate>();
  const theme = useTheme();
  const utils = useUtils<TDate>();

  const selectedDate = date || now;
  const currentYear = utils.getYear(selectedDate);
  const wrapperVariant = React.useContext(WrapperVariantContext);
  const selectedYearRef = React.useRef<HTMLButtonElement>(null);
  const [focusedYear, setFocusedYear] = React.useState<number | null>(currentYear);

  const handleYearSelection = (
    event: React.SyntheticEvent,
    year: number,
    isFinish: PickerSelectionState = 'finish',
  ) => {
    if (readOnly) {
      return;
    }

    const submitDate = (newDate: TDate) => {
      onChange(newDate, isFinish);

      if (onFocusedDayChange) {
        onFocusedDayChange(newDate || now);
      }

      if (onYearChange) {
        onYearChange(newDate);
      }
    };

    const newDate = utils.setYear(selectedDate, year);
    if (isDateDisabled(newDate)) {
      const closestEnabledDate = findClosestEnabledDate({
        utils,
        date: newDate,
        minDate,
        maxDate,
        disablePast: Boolean(disablePast),
        disableFuture: Boolean(disableFuture),
        shouldDisableDate: isDateDisabled,
      });

      submitDate(closestEnabledDate || now);
    } else {
      submitDate(newDate);
    }
  };

  const focusYear = React.useCallback(
    (year: number) => {
      if (!isDateDisabled(utils.setYear(selectedDate, year))) {
        setFocusedYear(year);
      }
    },
    [selectedDate, isDateDisabled, utils],
  );

  const yearsInRow = wrapperVariant === 'desktop' ? 4 : 3;

  const handleKeyDown = (event: React.KeyboardEvent, year: number) => {
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
  };

  return (
    <YearPickerRoot ref={ref} className={clsx(classes.root, className)} ownerState={ownerState}>
      {utils.getYearRange(minDate, maxDate).map((year) => {
        const yearNumber = utils.getYear(year);
        const selected = yearNumber === currentYear;

        return (
          <PickersYear
            key={utils.format(year, 'year')}
            selected={selected}
            value={yearNumber}
            onClick={handleYearSelection}
            onKeyDown={handleKeyDown}
            autoFocus={autoFocus && yearNumber === focusedYear}
            ref={selected ? selectedYearRef : undefined}
            disabled={
              disabled ||
              (disablePast && utils.isBeforeYear(year, now)) ||
              (disableFuture && utils.isAfterYear(year, now)) ||
              (shouldDisableYear && shouldDisableYear(year))
            }
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
  classes: PropTypes.object,
  className: PropTypes.string,
  date: PropTypes.any,
  disabled: PropTypes.bool,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  isDateDisabled: PropTypes.func.isRequired,
  maxDate: PropTypes.any.isRequired,
  minDate: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocusedDayChange: PropTypes.func,
  /**
   * Callback firing on year change @DateIOType.
   * @param {TDate} year The new year.
   */
  onYearChange: PropTypes.func,
  readOnly: PropTypes.bool,
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view @DateIOType.
   * @param {TDate} year The year to test.
   * @returns {boolean} Return `true` if the year should be disabled.
   */
  shouldDisableYear: PropTypes.func,
} as any;
