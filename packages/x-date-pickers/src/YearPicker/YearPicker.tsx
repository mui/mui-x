import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme, styled, useThemeProps, Theme } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { SxProps } from '@mui/system';
import { PickersYear } from './PickersYear';
import { useUtils, useNow, useDefaultDates } from '../internals/hooks/useUtils';
import { NonNullablePickerChangeHandler } from '../internals/hooks/useViews';
import { PickerSelectionState } from '../internals/hooks/usePickerState';
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
  className?: string;
  classes?: YearPickerClasses;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  date: TDate | null;
  disabled?: boolean;
  onChange: NonNullablePickerChangeHandler<TDate>;
  onFocusedDayChange?: (day: TDate) => void;
  readOnly?: boolean;
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday?: boolean;
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
    sx,
  } = props;

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const selectedDateOrToday = date ?? now;
  const currentYear = React.useMemo(() => {
    if (date != null) {
      return utils.getYear(date);
    }

    if (disableHighlightToday) {
      return null;
    }

    return utils.getYear(now);
  }, [now, date, utils, disableHighlightToday]);

  const wrapperVariant = React.useContext(WrapperVariantContext);
  const selectedYearRef = React.useRef<HTMLButtonElement>(null);
  const [focusedYear, setFocusedYear] = React.useState<number | null>(currentYear);

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

  const handleYearSelection = (
    event: React.SyntheticEvent,
    year: number,
    isFinish: PickerSelectionState = 'finish',
  ) => {
    if (readOnly) {
      return;
    }

    const newDate = utils.setYear(selectedDateOrToday, year);

    onChange(newDate, isFinish);
  };

  const focusYear = React.useCallback(
    (year: number) => {
      if (!isYearDisabled(utils.setYear(selectedDateOrToday, year))) {
        setFocusedYear(year);
      }
    },
    [selectedDateOrToday, isYearDisabled, utils],
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

  const nowYear = utils.getYear(now);

  return (
    <YearPickerRoot
      ref={ref}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      sx={sx}
    >
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
            disabled={disabled || isYearDisabled(year)}
            aria-current={nowYear === yearNumber ? 'date' : undefined}
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
  /**
   * Maximal selectable date. @DateIOType
   */
  maxDate: PropTypes.any,
  /**
   * Minimal selectable date. @DateIOType
   */
  minDate: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onFocusedDayChange: PropTypes.func,
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
