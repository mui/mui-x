---
productId: x-date-pickers
title: DX - Picker
---

# Picker

<p class="description">This page describes how people can use picker with Material UI and how they can build custom pickers.</p>

:::success
This page extends the initial proposal made in [#14718](https://github.com/mui/mui-x/issues/14718)
:::

## Basic usage in a Popover

### With Material UI

TODO

### Without Material UI

```tsx
function CustomDatePicker(props) {
  const manager = useDateManager();

  return (
    <Popover.Root>
      <Picker.Root manager={manager} {...props}>
        <PickerField.Root>
          <PickerField.Root>
            {/** See field documentation */}
            <Popover.Trigger>📅</Popover.Trigger>
          </PickerField.Root>
        </PickerField.Root>
        <Popover.Backdrop />
        <Popover.Positioner>
          <Popover.Popup>
            <Picker.Views></Picker.Views>
          </Popover.Popup>
        </Popover.Positioner>
      </Picker.Root>
    </Popover.Root>
  );
}
```

## Basic usage in a Dialog

### With Material UI

TODO

### Without Material UI

TODO

## Basic responsive usage

### With Material UI

TODO

### Without Material UI

TODO

## Basic responsive usage

## Add an action bar

### With Material UI

TODO

### Without Material UI

The user can use the `<Picker.AcceptValue />`, `<Picker.CancelValue />` and `<Picker.SetValue />` components to create an action bar and interact with the value:

```tsx
<Picker.Layout>
  <Picker.Views>{/** See demo above */}</Picker.Views>
  <div>
    <Picker.SetValue target={null}>Clear</Picker.Clear>
    <Picker.SetValue target={dayjs()}>Today</Picker.Clear>
    <Picker.AcceptValue>Accept</Picker.AcceptValue>
    <Picker.CancelValue>Cancel</Picker.CancelValue>
    <Popover.Close>Close</Popover.Close>
  </div>
</Picker.Layout>
```

## Add a toolbar

### With Material UI

TODO

### Without Material UI

The user can use the `Picker.ToolbarRoot` and `Picker.FormattedValue` components to create a toolbar for its picker:

```tsx
<Picker.Layout>
  <Picker.ToolbarRoot>
    <Picker.FormattedValue format="MMMM YYYY" />
  </Picker.ToolbarRoot>
  <Picker.Views>{/** See demo above */}</Picker.Views>
</Picker.Layout>
```

The toolbar can also be used to switch between views thanks to the `<Picker.SetView />` component:

```tsx
<Picker.Layout>
  <Picker.ToolbarRoot>
    <Picker.SetView target="year">
      <Picker.FormattedValue format="YYYY" />
    </Picker.SetView>
    <Picker.SetView target="day">
      <Picker.FormattedValue format="DD MMMM" />
    </Picker.SetView>
  </Picker.ToolbarRoot>
  <Picker.Views>{/** See demo above */}</Picker.Views>
</Picker.Layout>
```

## Add tabs

### With Material UI

TODO

### Without Material UI

The user can use the `Picker.SetView` component in combination with any `Tabs` component.

The example below uses the `Tabs` component from Base UI as an example:

```tsx
import { Tabs } from '@base-ui-components/react/tabs';
import { Picker } from '@base-ui/x-date-pickers/Picker';

<Picker.Layout>
  {({ view }) => (
    <React.Fragment>
      <Tabs.Root value={['day', 'month', 'year'].includes(view) ? 'date' : 'time'}>
        <Tabs.List>
          <Tabs.Tab
            value="date"
            render={(props) => <Picker.SetView {...props} target="day" />}
          >
            Date
          </Tabs.Tab>
          <Tabs.Tab
            value="time"
            render={(props) => <Picker.SetView {...props} target="hours" />}
          >
            Time
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
      <Picker.Views>{/** See demo above */}</Picker.Views>
    </React.Fragment>
  )}
</Picker.Layout>;
```

## Add shortcuts

### With Material UI

TODO

### Without Material UI

```tsx
<Picker.Layout>
  <div>
    <Picker.SetValue target={dayjs().month(0).date(1)}>
      New Year's Day
    </Picker.SetValue>
    <Picker.SetValue target={dayjs().month(6).date(4)}>
      Independence Day
    </Picker.SetValue>
  </div>
  <Picker.Views>{/** See demo above */}</Picker.Views>
</Picker.Layout>
```

:::success
To support the `isValid` param of the Material UI shortcut implement, a `useIsValidValue` hook could be added.
Without it, it's not trivial to use `useValidation` since it requires a value and params like the validation props or the timezone.

```tsx
import { useIsValueValid } from '@base-ui/x-date-pickers/hooks';

const isValueValid = useIsValueValid();

const newAvailableSaturday = React.useMemo(() => {
  const today = dayjs();
  const nextSaturday =
    today.day() <= 6
      ? today.add(6 - today.day(), 'day')
      : today.add(7 + 6 - today.day(), 'day');

  let maxAttempts = 50;
  let solution: Dayjs = nextSaturday;
  while (maxAttempts > 0 && !isValueValid(solution)) {
    solution = solution.add(7, 'day');
    maxAttempts -= 1;
  }

  return solution;
}, [isValueValid]);

return (
  <Picker.SetValue target={newAvailableSaturday}>Next available saturday<Picker.SetValue>
);
```

:::

## Anatomy of `Picker.*`

### `Picker.Root`

TODO

### `Picker.FormattedValue`

Formats the value based on the provided format.

#### Props

- Extends `React.HTMLAttributes<HTMLSpanElement>`

- `format`: `string` - **required**

### `Picker.Views`

TODO

### `Picker.SetValue`

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

- `target`: `PickerValidDate` - **required**

### `Picker.AcceptValue`

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

### `Picker.CancelValue`

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

### `Picker.SetView`

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

- `target`: `TView` - **required**

### `Picker.Layout`

TODO

### `Picker.ToolbarRoot`

TODO
