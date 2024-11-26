---
productId: x-date-pickers
title: DX - Calendar
---

# Fields

<p class="description">This page describes how people can use date views with Material UI and how they can build custom date views.</p>

:::success
This page extends the initial proposal made in [#15598](https://github.com/mui/mui-x/issues/15598)
:::

## With Material UI

### Basic usage

The `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` packages expose four calendar components:
Those components are self-contained components (meaning they don't use composition).

- `<DateCalendar>`

  Allows users to edit a date (its day in the month, its month and its year).

  ```tsx
  import { DateCalendar } from '@mui/x-date-pickers/DateCalendar />';

  <DateCalendar value={value} onChange={setValue} />;
  ```

- `<MonthCalendar>`

  Allows users to edit the month of a date.

  ```tsx
  import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar />';

  <MonthCalendar value={value} onChange={setValue} />;
  ```

- `<YearCalendar>`

  Allows users to edit the year of a date.

  ```tsx
  import { YearCalendar } from '@mui/x-date-pickers/YearCalendar />';

  <YearCalendar value={value} onChange={setValue} />;
  ```

- `<DateRangeCalendar>`

  Allows users to edit a range of dates (for now it only handles the day in the month, but could handle the month and the year in the future).

  ```tsx
  import { DateRangeCalendar } from '@mui/x-date-pickers/DateRangeCalendar />';

  <DateRangeCalendar value={value} onChange={setValue} />;
  ```

### Override part of the UI

You can use slots to override part of the UI in self-contained components:

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
       </PickerCalendarHeaderRoot>
     );
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

## Without Material UI

### Basic usage

TODO
