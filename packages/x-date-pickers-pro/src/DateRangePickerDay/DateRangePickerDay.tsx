import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useLicenseVerifier } from '@mui/x-license-pro';
import { alpha, styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useUtils } from '@mui/x-date-pickers/internals';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import {
  DateRangePickerDayClasses,
  getDateRangePickerDayUtilityClass,
  dateRangePickerDayClasses,
} from './dateRangePickerDayClasses';
import { getReleaseInfo } from '../internal/utils/releaseInfo';

const releaseInfo = getReleaseInfo();

export interface DateRangePickerDayProps<TDate>
  extends Omit<PickersDayProps<TDate>, 'classes' | 'onBlur' | 'onFocus' | 'onKeyDown'> {
  /**
   * Set to `true` if the `day` is in a highlighted date range.
   */
  isHighlighting: boolean;
  /**
   * Set to `true` if the `day` is the end of a highlighted date range.
   */
  isEndOfHighlighting: boolean;
  /**
   * Set to `true` if the `day` is the start of a highlighted date range.
   */
  isStartOfHighlighting: boolean;
  /**
   * Set to `true` if the `day` is in a preview date range.
   */
  isPreviewing: boolean;
  /**
   * Set to `true` if the `day` is the start of a previewing date range.
   */
  isEndOfPreviewing: boolean;
  /**
   * Set to `true` if the `day` is the end of a previewing date range.
   */
  isStartOfPreviewing: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateRangePickerDayClasses>;
  /**
   * Indicates if the day should be visually selected.
   */
  isVisuallySelected?: boolean;
}

type OwnerState = DateRangePickerDayProps<any> & { isEndOfMonth: boolean; isStartOfMonth: boolean };

const useUtilityClasses = (ownerState: OwnerState) => {
  const {
    isHighlighting,
    outsideCurrentMonth,
    isStartOfHighlighting,
    isStartOfMonth,
    isEndOfHighlighting,
    isEndOfMonth,
    isPreviewing,
    isStartOfPreviewing,
    isEndOfPreviewing,
    selected,
    classes,
  } = ownerState;

  const slots = {
    root: [
      'root',
      isHighlighting && !outsideCurrentMonth && 'rangeIntervalDayHighlight',
      (isStartOfHighlighting || isStartOfMonth) && 'rangeIntervalDayHighlightStart',
      (isEndOfHighlighting || isEndOfMonth) && 'rangeIntervalDayHighlightEnd',
    ],
    rangeIntervalPreview: [
      'rangeIntervalPreview',
      isPreviewing && !outsideCurrentMonth && 'rangeIntervalDayPreview',
      (isStartOfPreviewing || isStartOfMonth) && 'rangeIntervalDayPreviewStart',
      (isEndOfPreviewing || isEndOfMonth) && 'rangeIntervalDayPreviewEnd',
    ],
    day: [
      'day',
      !selected && 'notSelectedDate',
      !isHighlighting && 'dayOutsideRangeInterval',
      !selected && isHighlighting && 'dayInsideRangeInterval',
    ],
  };

  return composeClasses(slots, getDateRangePickerDayUtilityClass, classes);
};

const endBorderStyle = {
  borderTopRightRadius: '50%',
  borderBottomRightRadius: '50%',
};

const startBorderStyle = {
  borderTopLeftRadius: '50%',
  borderBottomLeftRadius: '50%',
};

const DateRangePickerDayRoot = styled('div', {
  name: 'MuiDateRangePickerDay',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    {
      [`&.${dateRangePickerDayClasses.rangeIntervalDayHighlight}`]:
        styles.rangeIntervalDayHighlight,
    },
    {
      [`&.${dateRangePickerDayClasses.rangeIntervalDayHighlightStart}`]:
        styles.rangeIntervalDayHighlightStart,
    },
    {
      [`&.${dateRangePickerDayClasses.rangeIntervalDayHighlightEnd}`]:
        styles.rangeIntervalDayHighlightEnd,
    },
    styles.root,
  ],
})<{ ownerState: OwnerState }>(({ theme, ownerState }) => ({
  [`&:first-of-type .${dateRangePickerDayClasses.rangeIntervalDayPreview}`]: {
    ...startBorderStyle,
    borderLeftColor: (theme.vars || theme).palette.divider,
  },
  [`&:last-of-type .${dateRangePickerDayClasses.rangeIntervalDayPreview}`]: {
    ...endBorderStyle,
    borderRightColor: (theme.vars || theme).palette.divider,
  },
  ...(ownerState.isHighlighting &&
    !ownerState.outsideCurrentMonth && {
      borderRadius: 0,
      color: (theme.vars || theme).palette.primary.contrastText,
      backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.primary.lightChannel} / 0.6)`
        : alpha(theme.palette.primary.light, 0.6),
      '&:first-of-type': startBorderStyle,
      '&:last-of-type': endBorderStyle,
    }),
  ...((ownerState.isStartOfHighlighting || ownerState.isStartOfMonth) && {
    ...startBorderStyle,
    paddingLeft: 0,
  }),
  ...((ownerState.isEndOfHighlighting || ownerState.isEndOfMonth) && {
    ...endBorderStyle,
    paddingRight: 0,
  }),
}));

DateRangePickerDayRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  ownerState: PropTypes.object.isRequired,
} as any;

const DateRangePickerDayRangeIntervalPreview = styled('div', {
  name: 'MuiDateRangePickerDay',
  slot: 'RangeIntervalPreview',
  overridesResolver: (_, styles) => [
    { [`&.${dateRangePickerDayClasses.rangeIntervalDayPreview}`]: styles.rangeIntervalDayPreview },
    {
      [`&.${dateRangePickerDayClasses.rangeIntervalDayPreviewStart}`]:
        styles.rangeIntervalDayPreviewStart,
    },
    {
      [`&.${dateRangePickerDayClasses.rangeIntervalDayPreviewEnd}`]:
        styles.rangeIntervalDayPreviewEnd,
    },
    styles.rangeIntervalPreview,
  ],
})<{ ownerState: OwnerState }>(({ theme, ownerState }) => ({
  // replace default day component margin with transparent border to avoid jumping on preview
  border: '2px solid transparent',
  ...(ownerState.isPreviewing &&
    !ownerState.outsideCurrentMonth && {
      borderRadius: 0,
      border: `2px dashed ${(theme.vars || theme).palette.divider}`,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      ...((ownerState.isStartOfPreviewing || ownerState.isStartOfMonth) && {
        borderLeftColor: (theme.vars || theme).palette.divider,
        ...startBorderStyle,
      }),
      ...((ownerState.isEndOfPreviewing || ownerState.isEndOfMonth) && {
        borderRightColor: (theme.vars || theme).palette.divider,
        ...endBorderStyle,
      }),
    }),
}));

DateRangePickerDayRangeIntervalPreview.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  ownerState: PropTypes.object.isRequired,
} as any;

const DateRangePickerDayDay = styled(PickersDay, {
  name: 'MuiDateRangePickerDay',
  slot: 'Day',
  overridesResolver: (_, styles) => [
    { [`&.${dateRangePickerDayClasses.dayInsideRangeInterval}`]: styles.dayInsideRangeInterval },
    { [`&.${dateRangePickerDayClasses.dayOutsideRangeInterval}`]: styles.dayOutsideRangeInterval },
    { [`&.${dateRangePickerDayClasses.notSelectedDate}`]: styles.notSelectedDate },
    styles.day,
  ],
})<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  // Required to overlap preview border
  transform: 'scale(1.1)',
  '& > *': {
    transform: 'scale(0.9)',
  },
  ...(!ownerState.selected && {
    backgroundColor: 'transparent',
  }),
  ...(!ownerState.selected &&
    ownerState.isHighlighting && {
      color: theme.palette.getContrastText(alpha(theme.palette.primary.light, 0.6)),
    }),
  ...(ownerState.draggable && {
    cursor: 'grab',
  }),
  ...(ownerState.draggable && {
    touchAction: 'none',
  }),
})) as unknown as <TDate>(
  props: PickersDayProps<TDate> & { ownerState: OwnerState },
) => JSX.Element;

type DateRangePickerDayComponent = <TDate>(
  props: DateRangePickerDayProps<TDate> & React.RefAttributes<HTMLButtonElement>,
) => JSX.Element;

const DateRangePickerDayRaw = React.forwardRef(function DateRangePickerDay<TDate>(
  inProps: DateRangePickerDayProps<TDate>,
  ref: React.Ref<HTMLButtonElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateRangePickerDay' });
  const {
    className,
    day,
    outsideCurrentMonth,
    isEndOfHighlighting,
    isEndOfPreviewing,
    isHighlighting,
    isPreviewing,
    isStartOfHighlighting,
    isStartOfPreviewing,
    selected = false,
    isVisuallySelected,
    sx,
    draggable,
    ...other
  } = props;

  useLicenseVerifier('x-date-pickers-pro', releaseInfo);
  const utils = useUtils<TDate>();

  const isEndOfMonth = utils.isSameDay(day, utils.endOfMonth(day));
  const isStartOfMonth = utils.isSameDay(day, utils.startOfMonth(day));

  const shouldRenderHighlight = isHighlighting && !outsideCurrentMonth;
  const shouldRenderPreview = isPreviewing && !outsideCurrentMonth;

  const ownerState = {
    ...props,
    selected,
    isStartOfMonth,
    isEndOfMonth,
    draggable,
  };

  const classes = useUtilityClasses(ownerState);

  return (
    <DateRangePickerDayRoot
      data-mui-test={shouldRenderHighlight ? 'DateRangeHighlight' : undefined}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      sx={sx}
    >
      <DateRangePickerDayRangeIntervalPreview
        data-mui-test={shouldRenderPreview ? 'DateRangePreview' : undefined}
        className={classes.rangeIntervalPreview}
        ownerState={ownerState}
      >
        <DateRangePickerDayDay<TDate>
          {...other}
          ref={ref}
          disableMargin
          day={day}
          selected={isVisuallySelected}
          outsideCurrentMonth={outsideCurrentMonth}
          data-mui-test="DateRangePickerDay"
          className={classes.day}
          ownerState={ownerState}
          draggable={draggable}
        />
      </DateRangePickerDayRangeIntervalPreview>
    </DateRangePickerDayRoot>
  );
});

DateRangePickerDayRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The date to show.
   */
  day: PropTypes.any.isRequired,
  /**
   * If `true`, renders as disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * If `true`, days are rendering without margin. Useful for displaying linked range of days.
   * @default false
   */
  disableMargin: PropTypes.bool,
  isAnimating: PropTypes.bool,
  /**
   * Set to `true` if the `day` is the end of a highlighted date range.
   */
  isEndOfHighlighting: PropTypes.bool.isRequired,
  /**
   * Set to `true` if the `day` is the start of a previewing date range.
   */
  isEndOfPreviewing: PropTypes.bool.isRequired,
  /**
   * Set to `true` if the `day` is in a highlighted date range.
   */
  isHighlighting: PropTypes.bool.isRequired,
  /**
   * Set to `true` if the `day` is in a preview date range.
   */
  isPreviewing: PropTypes.bool.isRequired,
  /**
   * Set to `true` if the `day` is the start of a highlighted date range.
   */
  isStartOfHighlighting: PropTypes.bool.isRequired,
  /**
   * Set to `true` if the `day` is the end of a previewing date range.
   */
  isStartOfPreviewing: PropTypes.bool.isRequired,
  /**
   * Indicates if the day should be visually selected.
   */
  isVisuallySelected: PropTypes.bool,
  onDaySelect: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func,
  /**
   * If `true`, day is outside of month and will be hidden.
   */
  outsideCurrentMonth: PropTypes.bool.isRequired,
  /**
   * If `true`, renders as selected.
   * @default false
   */
  selected: PropTypes.bool,
  /**
   * If `true`, days that have `outsideCurrentMonth={true}` are displayed.
   * @default false
   */
  showDaysOutsideCurrentMonth: PropTypes.bool,
  /**
   * If `true`, renders as today date.
   * @default false
   */
  today: PropTypes.bool,
} as any;

/**
 *
 * Demos:
 *
 * - [Date Range Picker](https://mui.com/x/react-date-pickers/date-range-picker/)
 *
 * API:
 *
 * - [DateRangePickerDay API](https://mui.com/x/api/date-pickers/date-range-picker-day/)
 */
export const DateRangePickerDay = React.memo(DateRangePickerDayRaw) as DateRangePickerDayComponent;
