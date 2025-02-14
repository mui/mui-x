import * as React from 'react';
import clsx from 'clsx';
import useSlotProps from '@mui/utils/useSlotProps';
import { Calendar } from '../internals/base/Calendar';
import { useDateCalendar2PrivateContext } from './DateCalendar2Context';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { useLoadingPanel } from './DateCalendar2.utils';
import {
  DateCalendar2YearCell,
  DateCalendar2YearCellSkeleton,
  DateCalendar2YearGridRoot,
} from './DateCalendar2.parts';

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

const DateCalendar2YearGridLoadingPanel = React.forwardRef(
  function DateCalendar2YearGridLoadingPanel(
    props: React.HTMLAttributes<HTMLDivElement>,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) {
    const { className, ...other } = props;
    const { classes, labelId, yearsPerRow } = useDateCalendar2PrivateContext();

    return (
      <DateCalendar2YearGridRoot
        aria-labelledby={labelId}
        className={clsx(className, classes.yearGridRoot)}
        data-cells-per-row={yearsPerRow}
        ref={ref}
        {...other}
      >
        {Array.from({ length: 24 }, (_, index) => (
          <DateCalendar2YearCellSkeleton
            key={index}
            className={classes.yearCellSkeleton}
            variant="rounded"
          />
        ))}
      </DateCalendar2YearGridRoot>
    );
  },
);

export const DateCalendar2YearGrid = React.forwardRef(function DateCalendar2YearGrid(
  props: DateCalendarYearGridProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { yearsOrder, className, ...other } = props;
  const { classes, loading, labelId, yearsPerRow } = useDateCalendar2PrivateContext();
  const renderLoadingPanel = useLoadingPanel({
    view: 'year',
    defaultComponent: DateCalendar2YearGridLoadingPanel,
  });

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
    <Calendar.YearGrid
      getItems={getItems}
      aria-labelledby={labelId}
      className={clsx(className, classes.yearGridRoot)}
      cellsPerRow={yearsPerRow}
      render={<DateCalendar2YearGridRoot />}
      ref={ref}
      {...other}
    >
      {({ years }) =>
        years.map((year) => (
          <Calendar.YearCell render={<WrappedYearCell />} value={year} key={year.toString()} />
        ))
      }
    </Calendar.YearGrid>
  );
});

interface DateCalendarYearGridProps extends React.HTMLAttributes<HTMLDivElement> {
  yearsOrder: 'asc' | 'desc';
}
