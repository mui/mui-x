---
productId: x-date-pickers
title: React Calendar component
packageName: '@mui/x-date-pickers'
---

# Calendar

<p class="description">POC of a Calendar component using the Base UI DX.</p>

## Anatomy

### Days

```tsx
<Calendar.Root>
  <Calendar.DayGrid>
    <Calendar.DayGridHeader>
      {({ days }) => days.map((day) => <Calendar.DayGridHeaderCell value={day} />)}
    </Calendar.DayGridHeader>
    <Calendar.DayGridBody>
      {({ weeks }) =>
        weeks.map((week) => (
          <Calendar.DayGridRow value={week}>
            {({ days }) => days.map((day) => <Calendar.DayCell value={day} />)}
          </Calendar.DayGridRow>
        ))
      }
    </Calendar.DayGridBody>
  </Calendar.DayGrid>
</Calendar.Root>
```

### Months

```tsx
// Grid layout
<Calendar.Root>
  <Calendar.MonthGrid>
    {({ months }) => months.map((month) => <Calendar.MonthCell value={month} />)}
  </Calendar.MonthGrid>
</Calendar.Root>

// List layout
<Calendar.Root>
  <Calendar.MonthList>
    {({ months }) => months.map((month) => <Calendar.MonthCell value={month} />)}
  </Calendar.MonthList>
</Calendar.Root>
```

### Years

```tsx
// Grid layout
<Calendar.Root>
  <Calendar.YearGrid>
    {({ years }) => years.map((year) => <Calendar.YearCell value={year} />)}
  </Calendar.YearGrid>
</Calendar.Root>

// List layout
<Calendar.Root>
  <Calendar.YearList>
    {({ years }) => years.map((year) => <Calendar.YearCell value={year} />)}
  </Calendar.YearList>
</Calendar.Root>
```

### Navigation

```tsx
<Calendar.Root>
  <Calendar.SetVisibleYear />
  <Calendar.SetVisibleMonth />
</Calendar.Root>
```

## Day Calendar

### Single visible month

{{"demo": "DayCalendarDemo.js", "defaultCodeOpen": false}}

### Multiple visible months

1. Add the `offset` prop to each of the `<Calendar.DayGrid />`

   ```tsx
   <React.Fragment>
     <Calendar.DayGrid offset={0}>
       {/** Children for the 1st month **/}
     </Calendar.DayGrid>
     <Calendar.DayGrid offset={1}>
       {/** Children for the 2nd month **/}
     </Calendar.DayGrid>
   </React.Fragment>
   ```

2. Add the `monthPageSize` prop to the `<Calendar.Root />`

   ```tsx
   <Calendar.Root monthPageSize={2}>{children}</Calendar.Root>
   ```

   It will make sure that keyboard navigation and pressing `<Calendar.SetVisibleMonth />` switching month two by two.

{{"demo": "DayCalendarWithTwoMonthsDemo.js", "defaultCodeOpen": false}}

### With validation

For now, the validation behaviors are exactly the same as on `<DateCalendar />`:

```tsx
<Calendar.Root disablePast>{children}</Calendar.Root>
```

{{"demo": "DayCalendarWithValidationDemo.js", "defaultCodeOpen": false}}

### With fixed week number

```tsx
<Calendar.DayGridBody fixedWeekNumber={6}>{children}</Calendar.DayGridBody>
```

{{"demo": "DayCalendarWithFixedWeekNumberDemo.js", "defaultCodeOpen": false}}

### Recipe: With week number

1. Add a custom cell in `<Calendar.DayGridHeader />`

   ```tsx
   <Calendar.DayGridHeader>
     {({ days }) => (
       <React.Fragment>
         <span role="columnheader" aria-label="Week number">
           #
         </span>
         {/** Day header cells **/}
       </React.Fragment>
     )}
   </Calendar.DayGridHeader>
   ```

2. Add a custom cell in `<Calendar.DayGridRow />`

   ```tsx
   <Calendar.DayGridRow value={week}>
     {({ days }) => (
       <React.Fragment>
         <span role="rowheader" aria-label={`Week ${days[0].week()}`}>
           {days[0].week()}
         </span>
         {/** Day cells */}
       </React.Fragment>
     )}
   </Calendar.DayGridRow>
   ```

{{"demo": "DayCalendarWithWeekNumberDemo.js", "defaultCodeOpen": false}}

## Month Calendar

### Grid layout

{{"demo": "MonthCalendarDemo.js"}}

### List layout

{{"demo": "MonthCalendarWithListLayoutDemo.js", "defaultCodeOpen": false}}

### Custom cell format

```tsx
<Calendar.MonthCell value={month} format="MMM" />
```

:::success
This also works for the `<Calendar.DayCell />` and `<Calendar.YearCell />` components, but it's the `<Calendar.MonthCell />` that benefits from it the most.
:::

{{"demo": "MonthCalendarWithCustomCellFormatDemo.js", "defaultCodeOpen": false}}

### Multiple visible years

TODO

## Year Calendar

### Grid layout

{{"demo": "YearCalendarDemo.js"}}

### List layout

{{"demo": "YearCalendarWithListLayoutDemo.js", "defaultCodeOpen": false}}

### Recipe: Reversed order

```tsx
const getYears = ({ getDefaultItems }) => {
  return getDefaultItems().toReversed();
};

<Calendar.YearGrid cellsPerRow={2} getItems={getYearsInDecade}>
  {/** Year cells */}
</Calendar.YearGrid>;
```

:::success
Using the `getItems` prop instead of manually providing a list of `<Calendar.YearCell />` as children allows the `<Calendar.YearGrid />` to always have at least one cell with `tabIndex={0}` and to correctly scroll to the first item with `tabIndex={0}`
:::

{{"demo": "YearCalendarWithReversedOrderDemo.js", "defaultCodeOpen": false}}

### Recipe: Grouped by decade

```tsx
const getYearsInDecade = ({ visibleDate }) => {
  const reference = visibleDate.startOf('year');
  const decade = Math.floor(reference.year() / 10) * 10;
  return Array.from({ length: 10 }, (_, index) =>
    reference.set('year', decade + index),
  );
};

<Calendar.YearGrid cellsPerRow={2} getItems={getYearsInDecade}>
  {/** Year cells */}
</Calendar.YearGrid>;
```

:::success
Using the `getItems` prop instead of manually providing a list of `<Calendar.YearCell />` as children allows the `<Calendar.YearGrid />` to always have at least one cell with `tabIndex={0}` and to correctly scroll to the first item with `tabIndex={0}`
:::

{{"demo": "YearCalendarWithDecadeNavigationDemo.js", "defaultCodeOpen": false}}

## Full Date Calendar

### MD2-ish header

{{"demo": "DateCalendarMD2Demo.js", "defaultCodeOpen": false}}

### MD3-ish header

{{"demo": "DateCalendarDemo.js", "defaultCodeOpen": false}}

### Recipe: Material Design 2

This is a reproduction of the Date Calendar component, with the following simplification:

- The order of the views is not overridable
- Some props are not implemented (`reduceAnimations`, `disableDayMargin`, ...)

This shows how light the Material layer would be once we have the Base UI X primitives.

{{"demo": "DateCalendarWithMaterialDesignDemo.js", "defaultCodeOpen": false}}

### Recipe: Year accordion

:::warning
Work in progress
:::

{{"demo": "DateCalendarWithYearAccordionDemo.js", "defaultCodeOpen": false}}
