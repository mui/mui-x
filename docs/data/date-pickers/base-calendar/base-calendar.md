---
productId: x-date-pickers
title: React Calendar component
packageName: '@mui/x-date-pickers'
---

# Date Calendar

<p class="description">POC of a Calendar component using the Base UI DX.</p>

## Day Calendar

### Single visible month

{{"demo": "DayCalendarDemo.js"}}

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

{{"demo": "DayCalendarTwoMonthsDemo.js"}}

### With validation

{{"demo": "DayCalendarWithValidationDemo.js"}}

### With week number

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

{{"demo": "DayCalendarWithWeekNumberDemo.js"}}

### With fixed week number

```tsx
<Calendar.DaysGrid fixedWeekNumber={6}>{children}</Calendar.DaysGrid>
```

{{"demo": "DayCalendarWithFixedWeekNumberDemo.js"}}

## Month Calendar

### Grid layout

{{"demo": "MonthCalendarDemo.js"}}

### List layout

{{"demo": "MonthCalendarWithListLayoutDemo.js"}}

### Custom cell format

```tsx
<Calendar.MonthsCell value={month} format="MMM" />
```

:::success
This also works for the `<Calendar.DaysCell />` and `<Calendar.YearsCell />` components, but it's the `<Calendar.MonthsCell />` that benefits from it the most.
:::

{{"demo": "MonthCalendarWithCustomCellFormatDemo.js"}}

### Multiple visible years

TODO

## Year Calendar

### Grid layout

{{"demo": "YearCalendarDemo.js"}}

### List layout

{{"demo": "YearCalendarWithListLayoutDemo.js"}}

### Grouped by decade

{{"demo": "YearCalendarWithDecadeNavigationDemo.js"}}

## Full Date Calendar

### MD2-ish layout

{{"demo": "DateCalendarMD2Demo.js"}}

### MD3-ish layout

{{"demo": "DateCalendarDemo.js"}}

## Day Range Calendar

### Single visible month

{{"demo": "DayRangeCalendarDemo.js"}}

### Multiple visible months

{{"demo": "DayRangeCalendarWithTwoMonthsDemo.js"}}

## Date Range Calendar

{{"demo": "DateRangeCalendarDemo.js"}}
