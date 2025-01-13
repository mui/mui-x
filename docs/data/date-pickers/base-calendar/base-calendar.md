---
productId: x-date-pickers
title: React Calendar component
packageName: '@mui/x-date-pickers'
---

# Date Calendar

<p class="description">POC of a Calendar component using the Base UI DX.</p>

## Day Calendar

### Single visible month

{{"demo": "DayCalendarDemo.js", "defaultCodeOpen": false}}

### Multiple visible months

1. Add the `offset` prop to each of the `<Calendar.DaysGrid />`

   ```tsx
   <React.Fragment>
     <Calendar.DaysGrid offset={0}>
       {/** Children for the 1st month **/}
     </Calendar.DaysGrid>
     <Calendar.DaysGrid offset={1}>
       {/** Children for the 2nd month **/}
     </Calendar.DaysGrid>
   </React.Fragment>
   ```

2. Add the `monthPageSize` prop to the `<Calendar.Root />`

   ```tsx
   <Calendar.Root monthPageSize={2}>{children}</Calendar.Root>
   ```

   It will make sure that keyboard navigation and pressing `<Calendar.SetVisibleMonth />` switching month two by two.

{{"demo": "DayCalendarWithTwoMonthsDemo.js", "defaultCodeOpen": false}}

### With validation

```tsx
<Calendar.Root disablePast>{children}</Calendar.Root>
```

{{"demo": "DayCalendarWithValidationDemo.js", "defaultCodeOpen": false}}

### With fixed week number

```tsx
<Calendar.DaysGrid fixedWeekNumber={6}>{children}</Calendar.DaysGrid>
```

{{"demo": "DayCalendarWithFixedWeekNumberDemo.js", "defaultCodeOpen": false}}

### Recipe: With week number

1. Add a custom cell in `<Calendar.DaysGridHeader />`

   ```tsx
   <Calendar.DaysGridHeader>
     {({ days }) => (
       <React.Fragment>
         <span role="columnheader" aria-label="Week number">
           #
         </span>
         {/** Day header cells **/}
       </React.Fragment>
     )}
   </Calendar.DaysGridHeader>
   ```

2. Add a custom cell in `<Calendar.DaysWeekRow />`

   ```tsx
   <Calendar.DaysWeekRow value={week}>
     {({ days }) => (
       <React.Fragment>
         <span role="rowheader" aria-label={`Week ${days[0].week()}`}>
           {days[0].week()}
         </span>
         {/** Day cells */}
       </React.Fragment>
     )}
   </Calendar.DaysWeekRow>
   ```

{{"demo": "DayCalendarWithWeekNumberDemo.js", "defaultCodeOpen": false}}

## Month Calendar

### Grid layout

{{"demo": "MonthCalendarDemo.js"}}

### List layout

{{"demo": "MonthCalendarWithListLayoutDemo.js", "defaultCodeOpen": false}}

### Custom cell format

```tsx
<Calendar.MonthsCell value={month} format="MMM" />
```

:::success
This also works for the `<Calendar.DaysCell />` and `<Calendar.YearsCell />` components, but it's the `<Calendar.MonthsCell />` that benefits from it the most.
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

<Calendar.YearsGrid cellsPerRow={2} getItems={getYearsInDecade}>
  {/** Year cells */}
</Calendar.YearsGrid>;
```

:::success
Using the `getItems` prop instead of manually providing a list of `<Calendar.YearsCell />` as children allows the `<Calendar.YearsGrid />` to always have at least one cell with `tabIndex={0}` and to correctly scroll to the first item with `tabIndex={0}`
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

<Calendar.YearsGrid cellsPerRow={2} getItems={getYearsInDecade}>
  {/** Year cells */}
</Calendar.YearsGrid>;
```

:::success
Using the `getItems` prop instead of manually providing a list of `<Calendar.YearsCell />` as children allows the `<Calendar.YearsGrid />` to always have at least one cell with `tabIndex={0}` and to correctly scroll to the first item with `tabIndex={0}`
:::

{{"demo": "YearCalendarWithDecadeNavigationDemo.js", "defaultCodeOpen": false}}

## Full Date Calendar

### MD2-ish layout

{{"demo": "DateCalendarMD2Demo.js", "defaultCodeOpen": false}}

### MD3-ish layout

{{"demo": "DateCalendarDemo.js", "defaultCodeOpen": false}}

## Day Range Calendar

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

### Recipe: Booking UI

The following demo shows a more advanced use case with lazy-loaded validation data:

{{"demo": "DayRangeCalendarAirbnbRecipe.js", "defaultCodeOpen": false}}

## Date Range Calendar

{{"demo": "DateRangeCalendarDemo.js", "defaultCodeOpen": false}}
