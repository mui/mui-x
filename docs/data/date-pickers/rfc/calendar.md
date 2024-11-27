---
productId: x-date-pickers
title: DX - Calendar
---

# Calendar

<p class="description">This page describes how people can use date views with Material UI and how they can build custom date views.</p>

:::success
This page extends the initial proposal made in [#15598](https://github.com/mui/mui-x/issues/15598)
:::

## Usage with only days

### With Material UI

:::success
No DX change here compared to today
:::

The user can use the `<DateCalendar />` and limit the views:

```tsx
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

<DateCalendar views={['day']} value={value} onChange={setValue} />;
```

### Without Material UI

The user can use the `Calendar.Days.*` components to create a grid of days and the `Calendar.Header.*` to create a header to navigate across the months:

```tsx
import { Calendar } from '@base-ui/x-date-pickers/Calendar';

<Calendar.Root value={value} onChange={setValue}>
  <Calendar.Header.Root>
    <Calendar.GoToMonth target="previous">◀</Calendar.GoToMonth>
    <Calendar.Header.Label />
    <Calendar.GoToMonth target="next">▶</Calendar.GoToMonth>
  </Calendar.Header.Root>
  <Calendar.Days.Root>
    <Calendar.Days.Header>
      {({ days }) => days.map((day) => <Calendar.Days.Label value={day} />)}
    </Calendar.Days.Header>
    <Calendar.Days.Content>
      {({ weeks }) =>
        weeks.map((week) => (
          <Calendar.Days.WeekRow value={week}>
            {({ days }) => days.map((day) => <Calendar.Days.Cell value={day} />)}
          </Calendar.Days.WeekRow>
        ))
      }
    </Calendar.Days.Content>
  </Calendar.Days.Root>
</Calendar.Root>;
```

## Usage with only months

### With Material UI

:::success
No DX change here compared to today
:::

The user can use the `<MonthCalendar />` component:

```tsx
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';

<MonthCalendar value={value} onChange={setValue}>
```

:::success
The big limitation here is that the `<MonthCalendar />` component does not have a header to navigate through the years.
Once the `Calendar.*` unstyled component is ready, the `<MonthCalendar />` should probably be reworked to improve this (or removed in favor of always using `<DateCalendar />`).
:::

### Without Material UI

The user can use the `Calendar.Months.*` components to create a grid of months and the `Calendar.Header.*` to create a header to navigate across the years:

```tsx
import { Calendar } from '@base-ui/x-date-pickers/Calendar';

<Calendar.Root value={value} onChange={setValue}>
  <Calendar.Header.Root>
    <Calendar.GoToYear target="previous">◀</Calendar.GoToYear>
    <Calendar.Header.Label format="YYYY" />
    <Calendar.GoToYear target="next">▶</Calendar.GoToYear>
  </Calendar.Header.Root>
  <Calendar.Months.Root>
    {({ months }) =>
      months.map((month) => <Calendar.Months.Cell value={monthValue} />)
    }
  </Calendar.Months.Root>
</Calendar.Root>;
```

## Usage with only years

### With Material UI

:::success
No DX change here compared to today
:::

The user can use the `<YearCalendar />` component:

```tsx
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';

<YearCalendar value={value} onChange={setValue}>
```

:::success
The big limitation here is that the `<YearCalendar />` component does not have a header to navigate through the years.
Once the `Calendar.*` unstyled component is ready, the `<YearCalendar />` should probably be reworked to improve this (or removed in favor of always using `<DateCalendar />`).
:::

### Without Material UI

The user can use the `Calendar.Years.*` components to create a grid of years:

```tsx
import { Calendar } from '@base-ui/x-date-pickers/Calendar';

<Calendar.Root value={value} onChange={setValue}>
  <Calendar.Years.Root>
    {({ years }) => years.map((year) => <Calendar.Years.Cell value={yearValue} />)}
  </Calendar.Years.Root>
</Calendar.Root>;
```

## Day + month + years

### With Material UI

:::success
No DX change here compared to today
:::

The user can use the `<DateCalendar />` component and add the month view:

```tsx
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

<DateCalendar value={value} onChange={setValue}>
```

:::success
When MD3 is supported, the default views of `<DateCalendar />` should probably be `['year', 'month', 'day']`
:::

### Without Material UI

```tsx
<Calendar.Root value={value} onChange={setValue}>
  <Calendar.Header.Root>
    {({ view }) => (
      <React.Fragment>
        <div>
          <Calendar.GoToMonth target="previous">◀</Calendar.GoToMonth>
          <Calendar.SetView
            target={view === 'year' ? 'day' : 'year'}
            disabled={view === 'month'}
          >
            <Calendar.Header.Label format="YYYY" />
          </Calendar.SetView>
          <Calendar.GoToMonth target="next">▶</Calendar.GoToMonth>
        </div>
        <div>
          <Calendar.GoToYear target="previous">◀</Calendar.GoToYear>
          <Calendar.SetView
            target={view === 'month' ? 'day' : 'month'}
            disabled={view === 'year'}
          >
            <Calendar.Header.Label format="YYYY" />
          </Calendar.SetView>
          <Calendar.GoToYear target="next">▶</Calendar.GoToYear>
        </div>
      </React.Fragment>
    )}
  </Calendar.Header.Root>
  <Calendar.MatchView match="day">
    <Calendar.Days.Root>
      <Calendar.Days.Header>
        {({ days }) => days.map((day) => <Calendar.Days.Label value={day} />)}
      </Calendar.Days.Header>
      <Calendar.Days.Content>
        {({ weeks }) =>
          weeks.map((week) => (
            <Calendar.Days.WeekRow value={week}>
              {({ days }) => days.map((day) => <Calendar.Days.Cell value={day} />)}
            </Calendar.Days.WeekRow>
          ))
        }
      </Calendar.Days.Content>
    </Calendar.Days.Root>
  </Calendar.MatchView>
  <Calendar.MatchView match="month">
    <Calendar.Months.Root>
      {({ months }) =>
        months.map((month) => <Calendar.Months.Cell value={monthValue} />)
      }
    </Calendar.Months.Root>
  </Calendar.MatchView>
  <Calendar.MatchView match="year">
    <Calendar.Years.Root>
      {({ years }) => years.map((year) => <Calendar.Years.Cell value={yearValue} />)}
    </Calendar.Years.Root>
  </Calendar.MatchView>
</Calendar.Root>
```

:::success
The header above tries to replicate the behavior of a MD3 Date Picker.
Today's `<DateCalendar />` header would look as follow:

```tsx
<Calendar.Header.Root>
  {({ view }) => (
    <React.Fragment>
      <Calendar.SetView target={view === 'year' ? 'month' : 'year'}>
        <Calendar.Header.Label /> {view === 'year' ? '▲' : '▼'}
      </Calendar.SetView>
      <Calendar.MatchView match="day">
        <div>
          <Calendar.GoToMonth target="previous">◀</Calendar.GoToMonth>
          <Calendar.GoToMonth target="next">▶</Calendar.GoToMonth>
        </div>
      </Calendar.MatchView>
    </React.Fragment>
  )}
</Calendar.Header.Root>
```

But the current behavior is not great, once the user is on the `year` view, there is no way to go back to the `day` view without picking a value.
:::

## Display week number

### With Material UI

:::success
No DX change here compared to today
:::

The user can use the `<DateCalendar />` with the `displayWeekNumber` prop:

```tsx
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

<DateCalendar displayWeekNumber views={['day']} value={value} onChange={setValue} />;
```

### Without Material UI

The user can use the `<Calendar.Days.WeekNumberHeaderCell />` and `<Calendar.Days.WeekNumberCell />` components to add a column to the grid:

```tsx
<Calendar.Days.Root>
  <Calendar.Days.Header>
    {({ days }) => (
      <React.Fragment>
        <Calendar.Days.WeekNumberHeaderCell>#</Calendar.Days.WeekNumberHeaderCell>
        {days.map((day) => (
          <Calendar.Days.Label value={day} />
        ))}
      </React.Fragment>
    )}
  </Calendar.Days.Header>
  <Calendar.Days.Content>
    {({ weeks }) =>
      weeks.map((week) => (
        <Calendar.Days.WeekRow value={week}>
          {({ days }) => (
            <React.Fragment>
              <Calendar.Days.WeekNumberCell />
              {days.map((day) => (
                <Calendar.Days.Cell value={day} />
              ))}
            </React.Fragment>
          )}
        </Calendar.Days.WeekRow>
      ))
    }
  </Calendar.Days.Content>
</Calendar.Days.Root>
```

## Override part of the UI

### With Material UI

Users can use slots to override part of the UI in self-contained components:

```tsx
<DateCalendar slots={{ calendarHeader: CustomCalendarHeader }} />
```

:::success
The concept of slots does not fit this use case very well, but the exploration of a better DX to override part of the UI in self-contained component is outside the scope of this documentation, so this RFC uses the tools currently available.
:::

The `<CustomCalendarHeader />` component can be built in a few different ways:

1. From scratch:

   This is mostly viable for components that don't interact a lot with the picker state. For example, if someone wants to build a custom header for their calendar that just displays the current month, they could do it from scratch:

   ```tsx
   import { useCalendarContext } from '@base-ui/x-date-pickers/Calendar';

   function CustomCalendarHeader() {
     const { currentMonth } = useCalendarContext();

     return <div>{currentMonth.format('MMMM YYYY')}</div>;
   }
   ```

   This is not the recommended way, but nothing prevents it.

   :::success
   The `calendarHeader` slot does not receive `currentMonth` as a prop but instead access it using `useCalendarContext()`.
   That way, this components can be composed more freely, it now only has to be mounted inside `<Calendar.Root />`.
   :::

2. Using the `Calendar.*` primitives exposed by `@base-ui/x-date-pickers/Calendar`:

   If the user wants to totally own the styling of this part of the UI (because he wants to build something really different from Material UI), he can use `Calendar.*` only for this part of the UI while still using `@mui/x-date-pickers` for everything he doesn't want to deeply customize:

   ```tsx
   import { Calendar } from '@base-ui/x-date-pickers/Calendar';

   function CustomCalendarHeader() {
     return (
       <Calendar.Header.Root>
         <Calendar.Header.Label format="MMMM YYYY" />
       </Calendar.Header.Root>
     );
   }
   ```

3. Using the `PickerCalendarHeader*` components exposed by `@mui/x-date-pickers/PickerCalendarHeader`:

   ```tsx
   import {
     PickersCalendarHeaderRoot,
     PickersCalendarHeaderLabel,
   } from '@mui/x-date-pickers/PickersCalendarHeader';

   function CustomCalendarHeader() {
     return (
       <PickersCalendarHeaderRoot>
         <PickerCalendarHeaderLabelContainer>
           <PickersCalendarHeaderLabel format="MMMM YYYY" />
         </PickerCalendarHeaderLabelContainer>
       </PickersCalendarHeaderRoot>
     );
   }
   ```

   :::success
   The components like `<PickersCalendarHeaderRoot />` would be built on top of their `@base-ui/x-date-pickers/Calendar` counterparts and would be used to build `<PickersCalendarHeader />`. The packages expose several version but they don't have logic duplication.
   Internally, the code would look something like that:

   ```tsx
   import { Calendar } from '@base-ui/x-date-pickers/Calendar';

   export const PickerCalendarHeaderRoot = styled(Calendar.Header.Root)({
     display: 'flex',
     alignItems: 'center',
     marginTop: 12,
     marginBottom: 4,
     paddingLeft: 24,
     paddingRight: 12,
   });

   export const PickerCalendarHeaderLabel = styled(Calendar.Header.Label)({
     /** ... */
   });

   // This component is purely presentational and not present in `@base-ui/x-date-pickers/Calendar'.
   export const PickerCalendarHeaderLabelContainer = styled('div')({
     /** ... */
   });

   export const PickerCalendarHeader = (props) => {
     const { format, ...other } = props;
     return (
       <PickerCalendarHeaderRoot {...other}>
         <PickerCalendarHeaderLabelContainer>
           <PickerCalendarHeaderLabel format={format} />
         </PickerCalendarHeaderLabelContainer>
       </PickerCalendarHeaderRoot>WeekNumberCell
   };
   ```

   :::

   :::success
   This one is unclear.
   Maybe those composable but styled components should only be exposed for parts of the UI where the Material UI implementation has some complexity and people want to be able to use composition to customize it without going fully unstyled for this part of the UI.

   And if those composable but styled components are something worth doing, then they need to have a coherent export strategy.
   Should it be:

   1. `<PickersCalendarHeaderRoot />` like it would be today
   2. `<Calendar.Header.Root />` to match the exports from `@base-ui/x-date-pickers`
   3. Something else?

   :::

## Anatomy of `Calendar.*`

### `Calendar.Root`

Top level component that wraps the other components.

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- **Value props**: `value`, `defaultValue`, `referenceDate`, `onChange`, `onError` and `timezone`.

  Same typing and behavior as today.

- **Validation props**: `maxDate`, `minDate`, `disableFuture`, `disablePast`, `shouldDisableDate`, `shouldDisableMonth`, `shouldDisableYear`.

  Same typing and behavior as today.

- **Form props**: `disabled`, `readOnly`.

  Same typing and behavior as today.

- `autoFocus`: `boolean`

### `Calendar.MatchView`

Utility component to conditionally render some components based on the current view.
Doesn't render a DOM node (it does not have a `render` prop either).

```tsx
<Calendar.MatchView match="day">
  Only rendered when the view is "day"
</Calendar.MatchView>

<Calendar.MatchView match={["day", "month"]}>
  Only rendered when the view is "day" or "month"
</Calendar.MatchView>
```

#### Props

- `match`: `TView | readonly TView[]` - **required**.

- `children`: `React.ReactNode`

### `Calendar.GoToMonth`

Renders a button to go to the previous or the next month.
It does not modify the value it only navigates to the target month.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonElement>`

- `target`: `'previous' | 'next'`

:::success
TODO: Clarify the behavior when multiple calendars are rendered at once.
:::

### `Calendar.GoToYear`

Renders a button to go to the previous or the next month.
It does not modify the value it only navigates to the target year.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonElement>`

- `target`: `'previous' | 'next'`

:::success
TODO: Clarify the behavior when multiple calendars are rendered at once.
:::

### `Calendar.SetView`

Renders a button to set the current visible view.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonElement>`

- `target`: `TView`

### `Calendar.Header.Root`

Top level component for the `Calendar.Header.*` components.

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

### `Calendar.Header.Label`

Renders the header label for the current value based on the provided format.

#### Props

- Extends `React.HTMLAttributes<HTMLSpanElement>`

- `format`: `string`, default: `${utils.formats.month} ${utils.formats.year}`

### `Calendar.Days.Root`

Top level component for the `Calendar.Days.*` components.

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `fixedWeekNumber`: `number`

### `Calendar.Days.Header`

Renders the header of the day grid.

It expects a function as its children, which has the list of days as a parameter:

```tsx
<Calendar.Days.Header>
  {({ days }) => days.map((day) => <Calendar.Days.HeaderCell value={day} />)}
</Calendar.Days.Header>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { days: PickerValidDate[] }) => React.ReactNode`

### `Calendar.Days.HeaderCell`

Renders the header of a day in the week.

#### Props

- Extends `React.HTMLAttributes<HTMLSpanElement>`

- `value`: `PickerValidDate` - **required**.

### `Calendar.Days.WeekNumberHeaderCell`

Renders the header of the week number column.

#### Props

- Extends `React.HTMLAttributes<HTMLSpanElement>`

### `Calendar.Days.Content`

Renders the content all the days in a month (it is the DOM element that should contain all the weeks).

It expects a function as its children, which has the list of weeks to render as a parameter:

```tsx
<Calendar.Days.Content>
  {({ weeks }) => weeks.map((week) => <Calendar.Days.WeekRow value={week} />)}
</Calendar.Days.Content>
```

:::success
Maybe it should be named `<Calendar.Days.Grid />`.
:::

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { weeks: PickerValidDate[] }) => React.ReactNode`

### `Calendar.Days.WeekRow`

Renders the content all the days in a week.

It expects a function as its children, which has the list of days to render and the week number as a parameter:

```tsx
<Calendar.Days.WeekRow>
  {({ days }) => days.map((day) => <Calendar.Days.Cell value={day} />)}
</Calendar.Days.WeekRow>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `value`: `{ value: PickerValidDate }` - **required**

- `children`: `(params: { days: PickerValidDate[], week: PickerValidDate }) => React.ReactNode`

### `Calendar.Days.Cell`

Renders the cell for a single day.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonElement>`

- `value`: `PickerValidDate` - **required**

### `Calendar.Days.WeekNumberCell`

Renders the number of the current week.

- Extends `React.HTMLAttributes<HTMLParagraphElement>`

### `Calendar.Months.Root`

Top level component for the `Calendar.Months.*` components.

It expects a function as its children, which has the list of the months as a parameter:

```tsx
<Calendar.Months.Root>
  {({ months }) => months.map((month) => <Calendar.Months.Cell value={month} />)}
</Calendar.Months.Root>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { months: PickerValidDate[] }) => React.ReactNode`

- `monthsOrder`: `'asc' | 'desc'`, default: `'asc'`.

- `monthsPerRow`: `number`, default: `1`

  :::success
  The `monthsOrder` and `monthsPerRow` prop is needed to have a working keyboard navigation.
  But it's not a great DX, especially if the user wants to vary the amount of items per row based on the viewport width.

  The navigation behavior should looks something like this:

  - if `monthsPerRow === 1`:

    - <kbd class="key">ArrowLeft</kbd> do nothing
    - <kbd class="key">ArrowRight</kbd> do nothing
    - <kbd class="key">ArrowTop</kbd> go to the month rendered above
    - <kbd class="key">ArrowBottom</kbd> go to month rendered below

  - if `monthsPerRow > 1`:
    - <kbd class="key">ArrowLeft</kbd> go the month rendered on the left, and if none should go to the outer-right month of the line rendered above
    - <kbd class="key">ArrowRight</kbd> go the month rendered on the right, and if none should go to the outer-left month of the line rendered below
    - <kbd class="key">ArrowTop</kbd> go to the month rendered above
    - <kbd class="key">ArrowBottom</kbd> go to month rendered below

  And with no assumption on the layout, this seems to be a real challenge to achieve.
  The MVP could probably not contain any keyboard navigation.
  :::

### `Calendar.Months.Cell`

Renders the cell for a single month.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonElement>`

- `value`: `PickerValidDate` - **required**.

### `Calendar.Years.Root`

Top level component for the `Calendar.Years.*` components.

It expects a function as its children, which has the list of the years as a parameter:

```tsx
<Calendar.Years.Root>
  {({ years }) => years.map((year) => <Calendar.Years.Cell value={year} />)}
</Calendar.Years.Root>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { years: PickerValidDate[] }) => React.ReactNode`

- `yearsOrder`: `'asc' | 'desc'`, default: `'asc'`.

- `yearsPerRow`: `number`, default: `1`

  :::success
  The `yearsPerRow` prop is needed to have a working keyboard navigation.
  See the equivalent prop in `Calendar.Months.Root` for more details.
  :::

### `Calendar.Years.Cell`

Renders the cell for a single year.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonElement>`

- `value`: `PickerValidDate` - **required**.
