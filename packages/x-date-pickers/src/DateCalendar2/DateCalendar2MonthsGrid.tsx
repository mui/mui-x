import * as React from 'react';
import clsx from 'clsx';
import { alpha, styled } from '@mui/material/styles';
import useSlotProps from '@mui/utils/useSlotProps';
import { Calendar } from '../internals/base/Calendar';
import { DIALOG_WIDTH } from '../internals/constants/dimensions';
import { useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { useLoadingPanel } from './DateCalendar2.utils';

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

const DateCalendar2MonthsCell = styled('button', {
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

function WrappedMonthsButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  const { ownerState } = usePickerPrivateContext();
  const { classes, slots, slotProps } = useDateCalendar2PrivateContext();

  const MonthsButton = slots?.monthButton ?? DateCalendar2MonthsCell;
  const monthsButtonProps = useSlotProps({
    elementType: MonthsButton,
    externalSlotProps: slotProps?.monthButton,
    externalForwardedProps: props,
    className: classes.monthsCell,
    ownerState,
  });

  return <DateCalendar2MonthsCell {...monthsButtonProps} />;
}

export const DateCalendar2MonthsGrid = React.forwardRef(function DateCalendar2MonthsGrid(
  props: DateCalendarMonthsGridProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const { classes, loading } = useDateCalendar2PrivateContext();
  const renderLoadingPanel = useLoadingPanel({ view: 'month' });

  if (loading) {
    return renderLoadingPanel();
  }

  return (
    <DateCalendar2MonthsGridRoot
      className={clsx(className, classes.monthsGridRoot)}
      ref={ref}
      {...other}
    >
      {({ months }) =>
        months.map((month) => (
          <Calendar.MonthsCell
            key={month.toString()}
            render={<WrappedMonthsButton />}
            value={month}
            format="MMM"
          />
        ))
      }
    </DateCalendar2MonthsGridRoot>
  );
});

interface DateCalendarMonthsGridProps
  extends Pick<Calendar.MonthsGrid.Props, 'cellsPerRow'>,
    React.HTMLAttributes<HTMLDivElement> {}
