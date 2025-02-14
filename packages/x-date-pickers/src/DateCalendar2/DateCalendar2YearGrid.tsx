import * as React from 'react';
import clsx from 'clsx';
import { alpha, styled } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import { Calendar } from '../internals/base/Calendar';
import { DIALOG_WIDTH, MAX_CALENDAR_HEIGHT } from '../internals/constants/dimensions';
import { useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { useLoadingPanel } from './DateCalendar2.utils';

const DateCalendar2YearGridRoot = styled(Calendar.YearGrid, {
  name: 'MuiDateCalendar2',
  slot: 'YearGridRoot',
  overridesResolver: (props, styles) => styles.yearGridRoot,
})({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  rowGap: 12,
  columnGap: 24,
  padding: '6px 0',
  overflowY: 'auto',
  height: '100%',
  width: DIALOG_WIDTH,
  maxHeight: MAX_CALENDAR_HEIGHT,
  // avoid padding increasing width over defined
  boxSizing: 'border-box',
  position: 'relative',
});

const DateCalendar2YearCell = styled('button', {
  name: 'MuiDateCalendar2',
  slot: 'YearCell',
  overridesResolver: (props, styles) => styles.yearCell,
})(({ theme }) => ({
  color: 'unset',
  backgroundColor: 'transparent',
  border: 0,
  outline: 0,
  ...theme.typography.subtitle1,
  height: 36,
  width: 72,
  borderRadius: 18,
  cursor: 'pointer',
  '&:focus': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.focusOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.focusOpacity),
  },
  '&:hover': {
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
  },
  '&:disabled': {
    cursor: 'auto',
    pointerEvents: 'none',
  },
  '&[data-disabled]': {
    color: (theme.vars || theme).palette.text.secondary,
  },
  '&[data-selected]': {
    color: (theme.vars || theme).palette.primary.contrastText,
    backgroundColor: (theme.vars || theme).palette.primary.main,
    '&:focus, &:hover': {
      backgroundColor: (theme.vars || theme).palette.primary.dark,
    },
  },
}));

function WrappedYearsButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  const { ownerState } = usePickerPrivateContext();
  const { classes, slots, slotProps } = useDateCalendar2PrivateContext();

  const YearCell = slots?.yearButton ?? DateCalendar2YearCell;
  const yearCellProps = useSlotProps({
    elementType: YearCell,
    externalSlotProps: slotProps?.yearCell,
    externalForwardedProps: props,
    className: classes.yearCell,
    ownerState,
  });

  return <DateCalendar2YearCell {...yearCellProps} />;
}

export const DateCalendar2YearGrid = React.forwardRef(function DateCalendar2YearGrid(
  props: DateCalendarYearGridProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { yearsOrder, className, ...other } = props;
  const { classes, loading } = useDateCalendar2PrivateContext();
  const renderLoadingPanel = useLoadingPanel({ view: 'year' });

  const getItems = React.useMemo<Calendar.YearGrid.Props['getItems']>(() => {
    if (yearsOrder === 'asc') {
      return undefined;
    }

    return ({ getDefaultItems }) => {
      return getDefaultItems().toReversed();
    };
  }, [yearsOrder]);

  if (loading) {
    return renderLoadingPanel();
  }

  return (
    <DateCalendar2YearGridRoot
      getItems={getItems}
      className={clsx(className, classes.yearGridRoot)}
      ref={ref}
      {...other}
    >
      {({ years }) =>
        years.map((year) => (
          <Calendar.YearCell render={<WrappedYearsButton />} value={year} key={year.toString()} />
        ))
      }
    </DateCalendar2YearGridRoot>
  );
});

interface DateCalendarYearGridProps
  extends Pick<Calendar.YearGrid.Props, 'cellsPerRow'>,
    React.HTMLAttributes<HTMLDivElement> {
  yearsOrder: 'asc' | 'desc';
}
