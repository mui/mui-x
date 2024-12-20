---
productId: x-date-pickers
title: DX - Overview
---

# Overview

<p class="description">This page describes the main principles of the new DX.</p>

## General principles

### Composition

All the components displayed in the pages below are following the Base UI DX which means:

- One component = one HTML element (except for elements like hidden `<input />`)

- Every component can receive a `render` prop to override the rendered element:

  ```tsx
  import List from '@mui/material/List';
  import ListItem from '@mui/material/ListItem';
  import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';

  <Calendar.MonthsList render={<List />}>
    {({ months }) =>
      months.map((month) => (
        <Calendar.MonthsCell
          value={month}
          key={month.toString()}
          render={<ListItem />}
        />
      ))
    }
  </Calendar.MonthsList>;
  ```

  This `render` prop can also accept a function that receives the `props` and the `state` of the component (equivalent of our `ownerState`):

  ```tsx
  import List from '@mui/material/List';
  import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';

  <Calendar.MonthsList
    render={(props, state) => (
      <List {...props} data-orientation={state.pickerOrientation} />
    )}
  >
    {/** See demo above */}
  </Calendar.MonthsList>;
  ```

- Every component can receive a `className` prop, they don't have any `className` by default:

  ```tsx
  // Will always have the class "day"
  <Calendar.DaysCell value={day} className="day" />

  // Will always have the class "day"
  // Will only have the class "day-selected" when the day is selected
  <Calendar.DaysCell
    value={day}
    className={(state) => clsx("day", state.isDaySelected && "day-selected")}
  />
  ```

  :::success
  For most use-cases, people should use the `data-attr` instead of creating custom classes.
  The state of the Date and Time Pickers is quite big so we won't add one `data-attr` for each property in it on each component.
  We will probably add the most useful one (`data-selected` on the `<Calendar.DaysCell />` component for example) and people can use the `className` prop for more advanced use cases.
  :::

- Components can have `data-attr` to allow conditional styling

  ```tsx
  <Calendar.DaysCell value={day} className="day">
  ```

  ```css
  .day {
    background-color: red;
  }

  .day[data-selected] {
    background-color: green;
  }
  ```

## Lifecycle of the components

- The concept of _view_ is removed in favor of a concept of _active section_ that is shared with the field and make no assumption about how those sections are rendered.
