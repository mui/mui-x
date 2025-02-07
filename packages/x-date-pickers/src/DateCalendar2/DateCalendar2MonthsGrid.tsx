import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { Calendar } from '../internals/base/Calendar';
import { DIALOG_WIDTH } from '../internals/constants/dimensions';
import { useDateCalendar2Context } from './DateCalendar2Context';

const DateCalendar2MonthsGridRoot = styled(Calendar.MonthsGrid, {
  name: 'MuiDateCalendar2',
  slot: 'MonthsGridRoot',
  overridesResolver: (props, styles) => styles.monthsGridRoot,
})({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  rowGap: 16,
  columnGap: 24,
  padding: '8px 0',
  width: DIALOG_WIDTH,
  // avoid padding increasing width over defined
  boxSizing: 'border-box',
});

const DateCalendar2MonthsCell = styled(Calendar.MonthsCell, {
  name: 'MuiDateCalendar2',
  slot: 'MonthsCell',
  overridesResolver: (props, styles) => styles.monthsCell,
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
      ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`
      : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
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

export function DateCalendar2MonthsGrid(props: DateCalendarMonthsGridProps) {
  const { classes } = useDateCalendar2Context();

  return (
    <DateCalendar2MonthsGridRoot {...props} className={classes.monthsGridRoot}>
      {({ months }) =>
        months.map((month) => (
          <DateCalendar2MonthsCell
            value={month}
            className={classes.monthsCell}
            key={month.toString()}
          />
        ))
      }
    </DateCalendar2MonthsGridRoot>
  );
}

interface DateCalendarMonthsGridProps extends Pick<Calendar.MonthsGrid.Props, 'cellsPerRow'> {}
