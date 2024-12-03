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

### Without Material UI

The user can use the `<Calendar.Days />`, `<Calendar.DaysHeader />`, `<Calendar.DaysHeaderCell />`, `<Calendar.DaysContent />`, `<Calendar.DaysWeekRow />` and `<Calendar.DaysCell />` components to create a grid of days:

```tsx
import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';

<Calendar.Root value={value} onChange={setValue}>
  <div>
    <Calendar.GoToMonth target="previous">◀</Calendar.GoToMonth>
    <Calendar.FormattedValue format="MMMM YYYY" />
    <Calendar.GoToMonth target="next">▶</Calendar.GoToMonth>
  </div>
  <Calendar.Days>
    <Calendar.DaysHeader>
      {({ days }) =>
        days.map((day) => (
          <Calendar.DaysHeaderCell value={day} key={day.toString()} />
        ))
      }
    </Calendar.DaysHeader>
    <Calendar.DaysContent>
      {({ weeks }) =>
        weeks.map((week) => (
          <Calendar.DaysWeekRow value={week}>
            {({ days }) =>
              days.map((day) => (
                <Calendar.DaysCell value={day} key={day.toString()} />
              ))
            }
          </Calendar.DaysWeekRow>
        ))
      }
    </Calendar.DaysContent>
  </Calendar.Days>
</Calendar.Root>;
```

### With Material UI

:::success
No DX change here compared to today
:::

The user can use the `<DateCalendar />` and limit the views:

```tsx
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

<DateCalendar views={['day']} value={value} onChange={setValue} />;
```

## Usage with only months

### Without Material UI

The user can use the `<Calendar.Months />` and `<Calendar.MonthsCell />` components to create a grid of months and utility components like `<Calendar.GoToYear />` and `<Calendar.FormattedValue />` to create a header to navigate across the years:

```tsx
import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';

<Calendar.Root value={value} onChange={setValue}>
  <div>
    <Calendar.GoToYear target="previous">◀</Calendar.GoToYear>
    <Calendar.FormattedValue format="YYYY" />
    <Calendar.GoToYear target="next">▶</Calendar.GoToYear>
  </div>
  <Calendar.Months>
    {({ months }) =>
      months.map((month) => (
        <Calendar.MonthsCell value={month} key={month.toString()} />
      ))
    }
  </Calendar.Months>
</Calendar.Root>;
```

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

## Usage with only years

### Without Material UI

The user can use the `<Calendar.Years />` and `<Calendar.YearsCell />` components to create a grid of years:

```tsx
import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';

<Calendar.Root value={value} onChange={setValue}>
  <Calendar.Years>
    {({ years }) =>
      years.map((year) => <Calendar.YearsCell value={year} key={year.toString()} />)
    }
  </Calendar.Years>
</Calendar.Root>;
```

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

## Day + month + years

### Without Material UI

```tsx
import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';

<Calendar.Root value={value} onChange={setValue}>
  <div>{/** See calendar header documentation */}</div>
  <Calendar.Days>
    <Calendar.DaysHeader>
      {({ days }) =>
        days.map((day) => (
          <Calendar.DaysHeaderCell value={day} key={day.toString()} />
        ))
      }
    </Calendar.DaysHeader>
    <Calendar.DaysContent>
      {({ weeks }) =>
        weeks.map((week) => (
          <Calendar.DaysWeekRow value={week} key={week.toString()}>
            {({ days }) =>
              days.map((day) => (
                <Calendar.DaysCell value={day} key={day.toString()} />
              ))
            }
          </Calendar.DaysWeekRow>
        ))
      }
    </Calendar.DaysContent>
  </Calendar.Days>
  <Calendar.Months>
    {({ months }) =>
      months.map((month) => (
        <Calendar.MonthsCell value={month} key={month.toString()} />
      ))
    }
  </Calendar.Months>
  <Calendar.Years>
    {({ years }) =>
      years.map((year) => <Calendar.YearsCell value={year} key={year.toString()} />)
    }
  </Calendar.Years>
</Calendar.Root>;
```

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

## Calendar header

### Without Material UI

The user can use the `<Calendar.GoToMonth />`, `<Calendar.FormattedValue />` and `<Calendar.SetView />` to build basically any kind of header they could think of:

#### Very basic header (without month and year views)

```tsx
import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';

function CalendarHeader() {
  return (
    <div>
      <Calendar.GoToMonth target="previous">◀</Calendar.GoToMonth>
      <Calendar.FormattedValue format="MMMM YYYY" />
      <Calendar.GoToMonth target="next">▶</Calendar.GoToMonth>
    </div>
  );
}
```

#### MD2 header (MUI X implementation)

```tsx
import {
  Calendar,
  useCalendarContext,
} from '@base-ui-components/react-x-date-pickers/calendar';

function CalendarHeader() {
  const { view } = useCalendarContext();

  return (
    <div>
      <Calendar.SetView target={view === 'year' ? 'month' : 'year'}>
        <Calendar.FormattedValue format="MMMM YYYY" />
        {view === 'year' ? '▲' : '▼'}
      </Calendar.SetView>
      <Calendar.MatchView match="day">
        <div>
          <Calendar.GoToMonth target="previous">◀</Calendar.GoToMonth>
          <Calendar.GoToMonth target="next">▶</Calendar.GoToMonth>
        </div>
      </Calendar.MatchView>
    </div>
  );
}
```

#### MD3 header

```tsx
import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';

function CalendarHeader() {
  const { view } = useCalendarContext();
  return (
    <div>
      <div>
        {view === 'day' && (
          <Calendar.GoToMonth target="previous">◀</Calendar.GoToMonth>
        )}
        <Calendar.SetView
          target={view === 'year' ? 'day' : 'year'}
          disabled={view === 'month'}
        >
          <Calendar.FormattedValue format="YYYY" />
        </Calendar.SetView>
        {view === 'day' && <Calendar.GoToMonth target="next">▶</Calendar.GoToMonth>}
      </div>
      <div>
        {view === 'day' && (
          <Calendar.GoToYear target="previous">◀</Calendar.GoToYear>
        )}
        <Calendar.SetView
          target={view === 'month' ? 'day' : 'month'}
          disabled={view === 'year'}
        >
          <Calendar.FormattedValue format="YYYY" />
        </Calendar.SetView>
        {view === 'day' && <Calendar.GoToYear target="next">▶</Calendar.GoToYear>}
      </div>
    </div>
  );
}
```

#### Header with dropdown for months and years

The user can create a custom header where the month and the year editing is done through a menu, while the day calendar is always visible below:

```tsx
import { Menu } from '@base-ui-components/react/menu';
import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';

function CalendarHeader() {
  const { view } = useCalendarContext();
  return (
    <div>
      <Menu.Root>
        <Calendar.FormattedValue format="MMMM" render={<Menu.Trigger />} />
        <Menu.Positioner>
          <Calendar.Months alwaysVisible render={<Menu.Popup />}>
            {({ months }) =>
              months.map((month) => (
                <Calendar.MonthsCell value={month} key={month.toString()} />
              ))
            }
          </Calendar.Months>
        </Menu.Positioner>
      </Menu.Root>
      <Menu.Root>
        <Calendar.FormattedValue format="YYYY" render={<Menu.Trigger />} />
        <Menu.Positioner>
          <Calendar.Months alwaysVisible render={<Menu.Popup />}>
            {({ years }) =>
              years.map((year) => (
                <Calendar.MonthsCell value={year} key={year.toString()} />
              ))
            }
          </Calendar.Months>
        </Menu.Positioner>
      </Menu.Root>
    </div>
  );
}
```

### With Material UI

The user can use slots to override part of the UI in self-contained components:

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
   import { useCalendarContext } from '@base-ui-components/react-x-date-pickers/calendar';

   function CustomCalendarHeader() {
     const { currentMonth } = useCalendarContext();

     return <div>{currentMonth.format('MMMM YYYY')}</div>;
   }
   ```

   This is not the recommended way, but nothing prevents it.

   :::success
   The `calendarHeader` slot does not receive `currentMonth` as a prop but instead access it using `useCalendarContext()`.
   That way, the API is consistent with and without Material UI, and if we introduce a composable version with Material UI in the future it will work fine.
   :::

2. Using the primitives exposed by `@base-ui-components/react-x-date-pickers/calendar`:

   If the user wants to totally own the styling of this part of the UI (because the UI is really different from the default one), he can use components like `<Calendar.FormattedValue />` or `<Calendar.GoToMonth />` only for this part of the UI while still using `@mui/x-date-pickers` for everything he doesn't want to deeply customize:

   ```tsx
   import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';

   function CustomCalendarHeader() {
     return (
       <div>
         <Calendar.GoToMonth target="previous">◀</Calendar.GoToMonth>
         <Calendar.FormattedValue format="MMMM YYYY" />
         <Calendar.GoToMonth target="next">▶</Calendar.GoToMonth>
       </div>
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
   The components like `<PickersCalendarHeaderRoot />` would be built on top of their `@base-ui-components/react-x-date-pickers/Calendar` counterparts and would be used to build `<PickersCalendarHeader />`. The packages expose several version but they don't have logic duplication.
   Internally, the code would look something like that:

   ```tsx
   import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';

   export const PickerCalendarHeaderRoot = styled('div')({
     display: 'flex',
     alignItems: 'center',
     marginTop: 12,
     marginBottom: 4,
     paddingLeft: 24,
     paddingRight: 12,
   });

   export const PickerCalendarHeaderLabel = styled(Calendar.FormattedValue)({
     /** ... */
   });

   // This component is purely presentational and not present in `@base-ui-components/react-x-date-pickers/Calendar'.
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
   2. `<Calendar.Header />` to match the exports from `@base-ui-components/react-x-date-pickers`
   3. Something else?

   :::

## Display week number

### Without Material UI

The user can use the `<Calendar.DaysWeekNumberHeaderCell />` and `<Calendar.DaysWeekNumberCell />` components to add a column to the grid:

```tsx
<Calendar.Days>
  <Calendar.DaysHeader>
    {({ days }) => (
      <React.Fragment>
        <Calendar.DaysWeekNumberHeaderCell>#</Calendar.DaysWeekNumberHeaderCell>
        {days.map((day) => (
          <Calendar.DaysHeaderCell value={day} key={day.toString()} />
        ))}
      </React.Fragment>
    )}
  </Calendar.DaysHeader>
  <Calendar.DaysContent>
    {({ weeks }) =>
      weeks.map((week) => (
        <Calendar.DaysWeekRow value={week} key={week.toString()}>
          {({ days }) => (
            <React.Fragment>
              <Calendar.DaysWeekNumberCell />
              {days.map((day) => (
                <Calendar.DaysCell value={day} key={day.toString()} />
              ))}
            </React.Fragment>
          )}
        </Calendar.DaysWeekRow>
      ))
    }
  </Calendar.DaysContent>
</Calendar.Days>
```

### With Material UI

:::success
No DX change here compared to today
:::

The user can use the `<DateCalendar />` with the `displayWeekNumber` prop:

```tsx
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

<DateCalendar displayWeekNumber views={['day']} value={value} onChange={setValue} />;
```

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

:::success
All the props that the picker can pass to the calendar (validation props, value props, etc...) are read both from the props and from `usePickerContext` so that the calendar can be used inside a picker built with composition.

That way, users only have to pass the props specific to the calendar to the `Calendar.*` components:

```tsx
<Picker.Root manager={manager} {...props} disablePast>
  <PickerField.Root>{/** See the field documentation */}</PickerField.Root>
  <Popover.Backdrop />
  <Popover.Positioner>
    <Popover.Popup>
      <Calendar.Root>
        <Calendar.Days fixedWeekNumber={6}>{/** See demo above */}</Calendar.Days>
      </Calendar.Root>
    </Popover.Popup>
  </Popover.Positioner>
</Picker.Root>
```

:::

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

### `Calendar.FormattedValue`

Formats the value based on the provided format.

#### Props

- Extends `React.HTMLAttributes<HTMLSpanElement>`

- `format`: `string` - **required**

### `Calendar.ContextValue`

Utility component to access the calendar public context.
Doesn't render a DOM node (it does not have a `render` prop either).

:::success
The user can also use `useCalendarContext()`, but a component allows to not create a dedicated component to access things close from `<Calendar.Root />`
:::

#### Props

- `children`: `(contextValue: CalendarContextValue) => React.ReactNode`

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

### `Calendar.Days`

Top level component for the `"day"` view.

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `fixedWeekNumber`: `number`

### `Calendar.DaysHeader`

Renders the header of the day grid.

It expects a function as its children, which receives the list of days to render as a parameter:

```tsx
<Calendar.DaysHeader>
  {({ days }) =>
    days.map((day) => <Calendar.DaysHeaderCell value={day} key={day.toString()} />)
  }
</Calendar.DaysHeader>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { days: PickerValidDate[] }) => React.ReactNode`

### `Calendar.DaysHeaderCell`

Renders the header of a day in the week.

#### Props

- Extends `React.HTMLAttributes<HTMLSpanElement>`

- `value`: `PickerValidDate` - **required**.

### `Calendar.DaysWeekNumberHeaderCell`

Renders the header of the week number column.

#### Props

- Extends `React.HTMLAttributes<HTMLSpanElement>`

### `Calendar.DaysContent`

Renders the content all the days in a month (it is the DOM element that should contain all the weeks).

It expects a function as its children, which receives the list of weeks to render as a parameter:

```tsx
<Calendar.DaysContent>
  {({ weeks }) =>
    weeks.map((week) => <Calendar.DaysWeekRow value={week} key={week.toString()} />)
  }
</Calendar.DaysContent>
```

:::success
Maybe it should be named `<Calendar.Days.Grid />`.
:::

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { weeks: PickerValidDate[] }) => React.ReactNode`

### `Calendar.DaysWeekRow`

Renders the content all the days in a week.

It expects a function as its children, which receives the list of days to render and the week number as a parameter:

```tsx
<Calendar.DaysWeekRow>
  {({ days }) =>
    days.map((day) => <Calendar.DaysCell value={day} key={day.toString()} />)
  }
</Calendar.DaysWeekRow>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `value`: `{ value: PickerValidDate }` - **required**

- `children`: `(params: { days: PickerValidDate[], week: PickerValidDate }) => React.ReactNode`

### `Calendar.DaysCell`

Renders the cell for a single day.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonElement>`

- `value`: `PickerValidDate` - **required**

### `Calendar.DaysWeekNumberCell`

Renders the number of the current week.

- Extends `React.HTMLAttributes<HTMLParagraphElement>`

### `Calendar.Months`

Top level component for the `"month"` view.

It expects a function as its children, which receives the list of the months to render as a parameter:

```tsx
<Calendar.Months>
  {({ months }) =>
    months.map((month) => (
      <Calendar.MonthsCell value={month} key={month.toString()} />
    ))
  }
</Calendar.Months>
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

- `alwaysVisible`: `boolean`, default: `false`. By default this component is only rendered when the current view is `"month"`.

### `Calendar.MonthsCell`

Renders the cell for a single month.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonElement>`

- `value`: `PickerValidDate` - **required**.

### `Calendar.Years`

Top level component for the `"year"` view.

It expects a function as its children, which receives the list of years to render as a parameter:

```tsx
<Calendar.Years>
  {({ years }) =>
    years.map((year) => <Calendar.YearsCell value={year} key={year.toString()} />)
  }
</Calendar.Years>
```

#### Props

- Extends `React.HTMLAttributes<HTMLDivElement>`

- `children`: `(params: { years: PickerValidDate[] }) => React.ReactNode`

- `yearsOrder`: `'asc' | 'desc'`, default: `'asc'`.

- `yearsPerRow`: `number`, default: `1`

  :::success
  The `yearsPerRow` prop is needed to have a working keyboard navigation.
  See the equivalent prop in `Calendar.Months` for more details.
  :::

- `alwaysVisible`: `boolean`, default: `false`. By default this component is only rendered when the current view is `"year"`.

### `Calendar.YearsCell`

Renders the cell for a single year.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonElement>`

- `value`: `PickerValidDate` - **required**.
