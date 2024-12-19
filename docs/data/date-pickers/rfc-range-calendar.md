---
productId: x-date-pickers
title: DX - RangeCalendar
---

# Range Calendar

<p class="description">This page describes how people can use date range views with Material UI and how they can build custom date range views.</p>

:::success
Almost all the components of `RangeCalendar.*` are the same as their `Calendar.*` counterpart.
:::

## Usage with only days

### Without Material UI

The user can use the `<RangeCalendar.DaysGrid />`, `<RangeCalendar.DaysGridHeader />`, `<RangeCalendar.DaysGridHeaderCell />`, `<RangeCalendar.DaysGridBody />`, `<RangeCalendar.DaysWeekRow />` and `<RangeCalendar.DaysCell />` components to create a grid of days:

```tsx
import { RangeCalendar } from '@base-ui-components/react-x-date-pickers-pro/range-calendar';

<RangeCalendar.Root value={value} onChange={setValue}>
  <div>
    <RangeCalendar.GoToMonth target="previous">◀</Calendar.GoToMonth>
    <RangeCalendar.FormattedValue format="MMMM YYYY" />
    <RangeCalendar.GoToMonth target="next">▶</Calendar.GoToMonth>
  </div>
  <RangeCalendar.DaysGrid>
    <RangeCalendar.DaysGridHeader>
      {({ days }) =>
        days.map((day) => (
          <RangeCalendar.DaysGridHeaderCell value={day} key={day.toString()} />
        ))
      }
    </RangeCalendar.DaysGridHeader>
    <RangeCalendar.DaysGridBody>
      {({ weeks }) =>
        weeks.map((week) => (
          <RangeCalendar.DaysWeekRow value={week}>
            {({ days }) =>
              days.map((day) => (
                <RangeCalendar.DaysCell value={day} key={day.toString()} />
              ))
            }
          </RangeCalendar.DaysWeekRow>
        ))
      }
    </RangeCalendar.DaysGridBody>
  </RangeCalendar.DaysGrid>
</RangeCalendar.Root>;
```

### With Material UI

:::success
No DX change here compared to today
:::

The user can use the `<DateRangeCalendar />`:

```tsx
import { DateRangeCalendar } from '@mui/x-date-pickers/DateCalendar';

<DateRangeCalendar value={value} onChange={setValue} />;
```
