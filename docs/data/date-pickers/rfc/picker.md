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
          {/** See field documentation */}
          <Popover.Trigger>📅</Popover.Trigger>
        </PickerField.Root>
        <Popover.Backdrop />
        <Popover.Positioner>
          <Popover.Popup>
            <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
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

```tsx
function CustomDatePicker(props) {
  const manager = useDateManager();

  return (
    <Dialog.Root>
      <PickerField.Root>
        {/** See field documentation */}
        <Dialog.Trigger>📅</Dialog.Trigger>
      </PickerField.Root>
      <Dialog.Backdrop />
      <Dialog.Popup>
        <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
```

## Basic responsive usage

### With Material UI

TODO

### Without Material UI

If the library does not provide any higher level utilities to create a responsive picker and sticks with "1 React component = 1 DOM element", here is what a responsive picker could look like:

```tsx
function CustomDatePicker(props) {
  const manager = useDateManager();
  const isDesktop = useMediaQuery('@media (pointer: fine)', {
    defaultMatches: true,
  });

  const wrapView = (viewNode: React.ReactNode) => {
    if (variant === 'mobile') {
      return <Dialog.Popup>{viewNode}</Dialog.Popup>;
    }

    return (
      <Popover.Positioner>
        <Popover.Popup>{viewNode}</Popover.Popup>
      </Popover.Positioner>
    );
  };

  return (
    <Popover.Root>
      <Picker.Root manager={manager} {...props}>
        <PickerField.Root>
          {/** See field documentation */}
          {variant === 'mobile' ? (
            <Dialog.Trigger>📅</Dialog.Trigger>
          ) : (
            <Popover.Trigger>📅</Popover.Trigger>
          )}
        </PickerField.Root>
        <Popover.Backdrop />
        {wrapView(
          <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>,
        )}
      </Picker.Root>
    </Popover.Root>
  );
}
```

:::success

:::

## Usage with date and time views

### With Material UI

TODO

### Without Material UI

The user can use the `<Picker.MatchView />` component to conditionally render the view components.
This is needed to build date time pickers:

```tsx
<Popover.Popup>
  <Picker.MatchView match={['day', 'month', 'year']}>
    <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
  </Picker.MatchView>
  <Picker.MatchView match={['hours', 'minutes', 'seconds', 'meridiem']}>
    <DigitalClock.Root>
      {/** See digital clock documentation (not available yet) */}
    </DigitalClock.Root>
  </Picker.MatchView>
</Popover.Popup>
```

## Add an action bar

### With Material UI

TODO

### Without Material UI

The user can use the `<Picker.AcceptValue />`, `<Picker.CancelValue />` and `<Picker.SetValue />` components to create an action bar and interact with the value:

```tsx
<Popover.Popup>
 <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
  <div>
    <Picker.SetValue target={null}>Clear</Picker.Clear>
    <Picker.SetValue target={dayjs()}>Today</Picker.Clear>
    <Picker.AcceptValue>Accept</Picker.AcceptValue>
    <Picker.CancelValue>Cancel</Picker.CancelValue>
    <Popover.Close>Close</Popover.Close>
  </div>
</Popover.Popup>
```

## Add a toolbar

### With Material UI

TODO

### Without Material UI

The user can use the `<Picker.FormattedValue />` component to create a toolbar for its picker:

```tsx
<Popover.Popup>
  <div>
    <Picker.FormattedValue format="MMMM YYYY" />
  </div>
  <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
</Popover.Popup>
```

The toolbar can also be used to switch between views thanks to the `<Picker.SetView />` component:

```tsx
<Popover.Popup>
  <div>
    <Picker.SetView target="year">
      <Picker.FormattedValue format="YYYY" />
    </Picker.SetView>
    <Picker.SetView target="day">
      <Picker.FormattedValue format="DD MMMM" />
    </Picker.SetView>
  </div>
  <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
</Popover.Popup>
```

## Add tabs

### With Material UI

TODO

### Without Material UI

The user can use the `<Picker.SetView />` component in combination with any Tabs / Tab components.

The example below uses the `Tabs` component from Base UI as an example:

```tsx
import { Tabs } from '@base-ui-components/react/tabs';
import { Picker } from '@base-ui/x-date-pickers/Picker';

<Picker.Popup>
  <Picker.ContextValue>
    {({ view }) => (
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
    )}
  </Picker.ContextValue>
  <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
</Picker.Popup>;
```

## Add shortcuts

### With Material UI

TODO

### Without Material UI

The user can use the `<Picker.SetValue />` component to create a shortcut UI:

```tsx
<Popover.Popup>
  <div>
    <Picker.SetValue target={dayjs().month(0).date(1)}>
      New Year's Day
    </Picker.SetValue>
    <Picker.SetValue target={dayjs().month(6).date(4)}>
      Independence Day
    </Picker.SetValue>
  </div>
  <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
</Popover.Popup>
```

:::success
To support the `isValid` param of the Material UI shortcut, a `useIsValidValue` hook could be added.
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

#### Props

- `manager`: `PickerManager` - **required**

  :::success
  See [#15395](https://github.com/mui/mui-x/issues/15395) for context.
  :::

- **Value props**: `value`, `defaultValue`, `referenceDate`, `onChange`, `onError` and `timezone`.

  Same typing and behavior as today.

- **Validation props**: list based on the `manager` prop

  For `useDateManager()` it would be `maxDate`, `minDate`, `disableFuture`, `disablePast`, `shouldDisableDate`, `shouldDisableMonth`, `shouldDisableYear`.

  Same typing and behavior as today.

- **Form props**: `disabled`, `readOnly`.

  Same typing and behavior as today.

### `Picker.FormattedValue`

Formats the value based on the provided format.

#### Props

- Extends `React.HTMLAttributes<HTMLSpanElement>`

- `format`: `string` - **required**

### `Picker.MatchView`

Utility component to conditionally render some components based on the current view.
Doesn't render a DOM node (it does not have a `render` prop either).

```tsx
<Picker.MatchView match="day">
  Only rendered when the view is "day"
</Picker.MatchView>

<Picker.MatchView match={["day", "month"]}>
  Only rendered when the view is "day" or "month"
</Picker.MatchView>
```

#### Props

- `match`: `TView | readonly TView[]` - **required**.

- `children`: `React.ReactNode`

### `Picker.ContextValue`

Utility component to access the picker public context.

:::success
The user can also use `usePickerContext()`, but a component allows to not create a dedicated component to access things close from `<Picker.Root />`
:::

#### Props

### `Picker.SetValue`

Renders a button to set the current value.
The button is disabled if the value is invalid.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

- `target`: `PickerValidDate` - **required**

### `Picker.AcceptValue`

Renders a button to accept the current value.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

### `Picker.CancelValue`

Renders a button to cancel the current value.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

### `Picker.SetView`

Renders a button to set the current visible view.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

- `target`: `TView` - **required**
