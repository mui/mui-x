import * as React from 'react';
import clsx from 'clsx';
import useSlotProps from '@mui/utils/useSlotProps';
import { Calendar } from '../internals/base/Calendar';
import { useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { useLoadingPanel } from './DateCalendar2.utils';
import { DateCalendar2YearCell, DateCalendar2YearGridRoot } from './DateCalendar2.parts';

function WrappedYearCell(props: React.HTMLAttributes<HTMLButtonElement>) {
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
    return renderLoadingPanel({ className, ...other, ref });
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
          <Calendar.YearCell render={<WrappedYearCell />} value={year} key={year.toString()} />
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
