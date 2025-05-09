---
productId: x-date-pickers
title: React Calendar component
packageName: '@mui/x-date-pickers'
---

# Range Calendar

<p class="description">POC of a Range Calendar component using the Base UI DX.</p>

## Anatomy

### Days

```tsx
<RangeCalendar.Root>
  <RangeCalendar.DayGrid>
    <RangeCalendar.DayGridHeader>
      {({ days }) =>
        days.map((day) => <RangeCalendar.DayGridHeaderCell value={day} />)
      }
    </RangeCalendar.DayGridHeader>
    <RangeCalendar.DayGridBody>
      {({ weeks }) =>
        weeks.map((week) => (
          <RangeCalendar.DayGridRow value={week}>
            {({ days }) => days.map((day) => <RangeCalendar.DayCell value={day} />)}
          </RangeCalendar.DayGridRow>
        ))
      }
    </RangeCalendar.DayGridBody>
  </RangeCalendar.DayGrid>
</RangeCalendar.Root>
```

### Months

```tsx
// Grid layout
<RangeCalendar.Root>
  <RangeCalendar.MonthGrid>
    {({ months }) => months.map((month) => <RangeCalendar.MonthCell value={month} />)}
  </RangeCalendar.MonthGrid>
</RangeCalendar.Root>

// List layout
<RangeCalendar.Root>
  <RangeCalendar.MonthList>
    {({ months }) => months.map((month) => <RangeCalendar.MonthCell value={month} />)}
  </RangeCalendar.MonthList>
</RangeCalendar.Root>
```

### Years

```tsx
// Grid layout
<RangeCalendar.Root>
  <RangeCalendar.YearGrid>
    {({ years }) => years.map((year) => <RangeCalendar.YearCell value={year} />)}
  </RangeCalendar.YearGrid>
</RangeCalendar.Root>

// List layout
<RangeCalendar.Root>
  <RangeCalendar.YearList>
    {({ years }) => years.map((year) => <RangeCalendar.YearCell value={year} />)}
  </RangeCalendar.YearList>
</RangeCalendar.Root>
```

### Navigation

```tsx
<RangeCalendar.Root>
  <RangeCalendar.SetVisibleYear />
  <RangeCalendar.SetVisibleMonth />
</RangeCalendar.Root>
```

## Day Range Calendar

:::warning
Work in progress, the drag and drop doesn't work well when swapping start and end date.
:::

### Single visible month

{{"demo": "DayRangeCalendarDemo.js", "defaultCodeOpen": false}}

### Multiple visible months

:::success
Diff compared to the current `<DateRangeCalendar />`: change in the <kbd>Tab</kbd> sequence.

On the demo below:

1. Previous month button
2. Next month button
3. Start date button
4. End date button

On the existing Date Range Calendar:

1. Previous month button
2. Start date button
3. Next month button
4. End date button

It's due to the DOM structure and the user can easily reproduce the old behavior, but I found the new one more coherent.
:::

{{"demo": "DayRangeCalendarWithTwoMonthsDemo.js", "defaultCodeOpen": false}}

### Disable preview

```tsx
<RangeCalendar.Root disableHoverPreview>{children}</RangeCalendar.Root>
```

{{"demo": "DayRangeCalendarWithoutPreviewDemo.js", "defaultCodeOpen": false}}

### Recipe: Booking UI

The following demo shows a more advanced use case with lazy-loaded validation data:

{{"demo": "DayRangeCalendarAirbnbRecipe.js", "defaultCodeOpen": false}}

## Month Range Calendar

:::warning
Work in progress, this is probably quite buggy
:::

### Single visible year

{{"demo": "MonthRangeCalendarDemo.js", "defaultCodeOpen": false}}

### Multiple visible years

TODO

## Year Range Calendar

:::warning
Work in progress, this is probably quite buggy
:::

### Single visible year

{{"demo": "YearRangeCalendarDemo.js", "defaultCodeOpen": false}}

## Date Range Calendar

{{"demo": "DateRangeCalendarDemo.js", "defaultCodeOpen": false}}
