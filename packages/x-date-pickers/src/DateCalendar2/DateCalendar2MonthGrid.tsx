import * as React from 'react';
import clsx from 'clsx';
import useSlotProps from '@mui/utils/useSlotProps';
import { Calendar } from '../internals/base/Calendar';
import { useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { useLoadingPanel } from './DateCalendar2.utils';
import {
  DateCalendar2MonthCell,
  DateCalendar2MonthCellSkeleton,
  DateCalendar2MonthGridRoot,
} from './DateCalendar2.parts';

function WrappedMonthCell(props: React.HTMLAttributes<HTMLButtonElement>) {
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

const DateCalendar2MonthGridLoadingPanel = React.forwardRef(
  function DateCalendar2MonthGridLoadingPanel(
    props: React.HTMLAttributes<HTMLDivElement>,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { className, ...other } = props;
    const { classes, labelId, monthsPerRow } = useDateCalendar2PrivateContext();

    return (
      <DateCalendar2MonthGridRoot
        aria-labelledby={labelId}
        className={clsx(className, classes.monthGridRoot)}
        data-cells-per-row={monthsPerRow}
        ref={ref}
        {...other}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <DateCalendar2MonthCellSkeleton
            key={index}
            className={classes.yearCellSkeleton}
            variant="rounded"
          />
        ))}
      </DateCalendar2MonthGridRoot>
    );
  },
);

export const DateCalendar2MonthGrid = React.forwardRef(function DateCalendar2MonthGrid(
  props: DateCalendarMonthGridProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const { classes, loading, labelId, monthsPerRow } = useDateCalendar2PrivateContext();
  const renderLoadingPanel = useLoadingPanel({
    view: 'month',
    defaultComponent: DateCalendar2MonthGridLoadingPanel,
  });

  if (loading) {
    return renderLoadingPanel({ ...props, ref });
  }

  return (
    <Calendar.MonthGrid
      aria-labelledby={labelId}
      className={clsx(className, classes.monthGridRoot)}
      cellsPerRow={monthsPerRow}
      ref={ref}
      render={<DateCalendar2MonthGridRoot />}
      {...other}
    >
      {({ months }) =>
        months.map((month) => (
          <Calendar.MonthCell
            key={month.toString()}
            render={<WrappedMonthCell />}
            value={month}
            format="MMM"
          />
        ))
      }
    </Calendar.MonthGrid>
  );
});

interface DateCalendarMonthGridProps extends React.HTMLAttributes<HTMLDivElement> {}
