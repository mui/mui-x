import * as React from 'react';
import clsx from 'clsx';
import useSlotProps from '@mui/utils/useSlotProps';
import { Calendar } from '../internals/base/Calendar';
import { useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { useLoadingPanel } from './DateCalendar2.utils';
import { DateCalendar2MonthCell, DateCalendar2MonthGridRoot } from './DateCalendar2.parts';

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

export const DateCalendar2MonthGrid = React.forwardRef(function DateCalendar2MonthGrid(
  props: DateCalendarMonthGridProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const { classes, loading } = useDateCalendar2PrivateContext();
  const renderLoadingPanel = useLoadingPanel({ view: 'month' });

  if (loading) {
    return renderLoadingPanel({ ...props, ref });
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
            render={<WrappedMonthCell />}
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
