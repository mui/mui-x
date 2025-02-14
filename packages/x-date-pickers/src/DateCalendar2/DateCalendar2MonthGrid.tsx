import * as React from 'react';
import clsx from 'clsx';
import { alpha, styled } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import { Calendar } from '../internals/base/Calendar';
import { DIALOG_WIDTH } from '../internals/constants/dimensions';
import { useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { useLoadingPanel } from './DateCalendar2.utils';

const DateCalendar2MonthGridRoot = styled(Calendar.MonthGrid, {
  name: 'MuiDateCalendar2',
  slot: 'MonthGridRoot',
  overridesResolver: (props, styles) => styles.monthGridRoot,
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

const DateCalendar2MonthCell = styled('button', {
  name: 'MuiDateCalendar2',
  slot: 'MonthCell',
  overridesResolver: (props, styles) => styles.monthCell,
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

function WrappedMonthsButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  const { ownerState } = usePickerPrivateContext();
  const { classes, slots, slotProps } = useDateCalendar2PrivateContext();

  const MonthCell = slots?.monthButton ?? DateCalendar2MonthCell;
  const monthCellProps = useSlotProps({
    elementType: MonthCell,
    externalSlotProps: slotProps?.monthCell,
    externalForwardedProps: props,
    className: classes.monthCell,
    ownerState,
  });

  return <DateCalendar2MonthCell {...monthCellProps} />;
}

export const DateCalendar2MonthGrid = React.forwardRef(function DateCalendar2MonthGrid(
  props: DateCalendarMonthGridProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const { classes, loading } = useDateCalendar2PrivateContext();
  const renderLoadingPanel = useLoadingPanel({ view: 'month' });

  if (loading) {
    return renderLoadingPanel();
  }

  return (
    <DateCalendar2MonthGridRoot
      className={clsx(className, classes.monthGridRoot)}
      ref={ref}
      {...other}
    >
      {({ months }) =>
        months.map((month) => (
          <Calendar.MonthCell
            key={month.toString()}
            render={<WrappedMonthsButton />}
            value={month}
            format="MMM"
          />
        ))
      }
    </DateCalendar2MonthGridRoot>
  );
});

interface DateCalendarMonthGridProps
  extends Pick<Calendar.MonthGrid.Props, 'cellsPerRow'>,
    React.HTMLAttributes<HTMLDivElement> {}
