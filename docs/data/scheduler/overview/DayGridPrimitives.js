import * as React from 'react';
import { DateTime } from 'luxon';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { useWeekList } from '@mui/x-scheduler/primitives/use-week-list';
import { useDayList } from '@mui/x-scheduler/primitives/use-day-list';
import classes from './DayGridPrimitives.module.css';

export default function DayGridPrimitives() {
  const getWeekList = useWeekList();
  const getDayList = useDayList();

  const weeks = React.useMemo(
    () =>
      getWeekList({
        date: DateTime.now().startOf('month'),
        amount: 'end-of-month',
      }).map((week) => getDayList({ date: week, amount: 7 })),
    [getWeekList],
  );

  return (
    <div className={classes.Container}>
      <DayGrid.Root className={classes.Root}>
        <tbody>
          {weeks.map((week) => (
            <DayGrid.Row key={week[0].toString()} className={classes.Row}>
              {week.map((day) => (
                <DayGrid.Cell key={day.toString()} className={classes.Cell}>
                  <span className={classes.CellLabel}>{day.toFormat('dd')}</span>
                </DayGrid.Cell>
              ))}
            </DayGrid.Row>
          ))}
        </tbody>
      </DayGrid.Root>
    </div>
  );
}
