import * as React from 'react';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line no-restricted-imports
import { Calendar } from '@mui/x-date-pickers/internals/base/Calendar';
// eslint-disable-next-line no-restricted-imports
import { Clock } from '@mui/x-date-pickers/internals/base/Clock';
import calendarStyles from '../base-calendar/calendar.module.css';
import clockStyles from '../base-clock/clock.module.css';

function CalendarView(props: Calendar.Root.Props) {
  return (
    <Calendar.Root className={calendarStyles.Root} {...props}>
      {({ visibleDate }) => (
        <React.Fragment>
          <header className={calendarStyles.Header}>
            <Calendar.SetVisibleMonth
              target="previous"
              className={calendarStyles.SetVisibleMonth}
            >
              ◀
            </Calendar.SetVisibleMonth>
            <span>{visibleDate.format('MMMM YYYY')}</span>
            <Calendar.SetVisibleMonth
              target="next"
              className={calendarStyles.SetVisibleMonth}
            >
              ▶
            </Calendar.SetVisibleMonth>
          </header>
          <Calendar.DayGrid className={calendarStyles.DayGrid}>
            <Calendar.DayGridHeader className={calendarStyles.DayGridHeader}>
              {({ days }) =>
                days.map((day) => (
                  <Calendar.DayGridHeaderCell
                    value={day}
                    key={day.toString()}
                    className={calendarStyles.DayGridHeaderCell}
                  />
                ))
              }
            </Calendar.DayGridHeader>
            <Calendar.DayGridBody className={calendarStyles.DayGridBody}>
              {({ weeks }) =>
                weeks.map((week) => (
                  <Calendar.DayGridRow
                    value={week}
                    key={week.toString()}
                    className={calendarStyles.DayGridRow}
                  >
                    {({ days }) =>
                      days.map((day) => (
                        <Calendar.DayCell
                          value={day}
                          key={day.toString()}
                          className={calendarStyles.DayCell}
                        />
                      ))
                    }
                  </Calendar.DayGridRow>
                ))
              }
            </Calendar.DayGridBody>
          </Calendar.DayGrid>
        </React.Fragment>
      )}
    </Calendar.Root>
  );
}

function ClockView(props: Clock.Root.Props) {
  return (
    <Clock.Root className={clockStyles.Root} {...props}>
      <Clock.Hour24List render={<OptionList />}>
        {({ items }) =>
          items.map((item) => (
            <Clock.Cell
              key={item.toString()}
              value={item}
              className={clockStyles.Option}
            />
          ))
        }
      </Clock.Hour24List>
      <Clock.MinuteList render={<OptionList />}>
        {({ items }) =>
          items.map((item) => (
            <Clock.Cell
              key={item.toString()}
              value={item}
              className={clockStyles.Option}
            />
          ))
        }
      </Clock.MinuteList>
      <Clock.SecondList render={<OptionList />}>
        {({ items }) =>
          items.map((item) => (
            <Clock.Cell
              key={item.toString()}
              value={item}
              className={clockStyles.Option}
            />
          ))
        }
      </Clock.SecondList>
    </Clock.Root>
  );
}

function OptionList(props: React.HTMLAttributes<HTMLDivElement>) {
  const { children, ...other } = props;

  return (
    <div className={clockStyles.OptionListWrapper} {...other}>
      <div className={clockStyles.OptionListContent}>{children}</div>
    </div>
  );
}

function CalendarAndClockView() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <React.Fragment>
      <CalendarView value={value} onValueChange={setValue} />
      <ClockView value={value} onValueChange={setValue} />
    </React.Fragment>
  );
}

export default function DateTime() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CalendarAndClockView />
    </LocalizationProvider>
  );
}
