---
productId: x-date-pickers
title: DX - Picker
---

# Picker

<p class="description">This page describes how people can use picker with Material UI and how they can build custom pickers.</p>

:::success
This page extends the initial proposal made in [#14718](https://github.com/mui/mui-x/issues/14718)
:::

## Usage in a Popover

### Without Material UI

#### With Base UI `Popover.*` components

The user can use the `Picker.*` components in combination with the `Popover.*` components from `@base-ui-components/react` to build a picker:

```tsx
import { Popover } from '@base-ui-components/react/popover';
import { useDateManager } from '@base-ui-components/react-x-date-pickers/managers';
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';

function DesktopDatePicker(props) {
  const manager = useDateManager();

  return (
    <Picker.Root manager={manager} {...props}>
      {({ open, setOpen }) => (
        <Popover.Root open={open} onOpenChange={setOpen}>
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
        </Popover.Root>
      )}
    </Picker.Root>
  );
}

<DesktopDatePicker value={value} onChange={setValue} />;
```

#### With React Aria `<Popover />` components

Even if Base UI will be the solution presented in the doc to connect the field and the view, nothing prevents the user from using another library:

```tsx
import { useDateManager } from '@base-ui-components/react-x-date-pickers/managers';
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';
import { Dialog, DialogTrigger, Button, Popover } from 'react-aria-components';

function DesktopDatePicker(props) {
  const manager = useDateManager();

  return (
    <Picker.Root manager={manager} {...props}>
      {({ open, setOpen }) => (
        <DialogTrigger isOpen={open} onOpenChange={setOpen}>
          <PickerField.Root>
            {/** See field documentation */}
            <Button>📅</Button>
          </PickerField.Root>
          <Popover>
            <Dialog>
              <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
            </Dialog>
          </Popover>
        </DialogTrigger>
      )}
    </Picker.Root>
  );
}

<DesktopDatePicker value={value} onChange={setValue} />;
```

### With Material UI

The user can use the `<DesktopDatePicker />` component:

```tsx
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

<DesktopDatePicker value={value} onChange={setValue} />;
```

:::success
This component could be renamed `<PopoverDatePicker />` to better match its behavior.
:::

## Usage in a Dialog

### Without Material UI

#### With Base UI `Dialog.*` components

The user can use the `Picker.*` components in combination with the `Dialog.*` components from `@base-ui-components/react` to build a picker:

```tsx
import { useDateManager } from '@base-ui-components/react-x-date-pickers/managers';
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';
import { Dialog } from '@base-ui-components/react/dialog';

function MobileDatePicker(props) {
  const manager = useDateManager();

  return (
    <Picker.Root manager={manager} {...props}>
      {({ open, setOpen }) => (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <PickerField.Root>
            {/** See field documentation */}
            <Dialog.Trigger>📅</Dialog.Trigger>
          </PickerField.Root>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
          </Dialog.Popup>
        </Dialog.Root>
      )}
    </Picker.Root>
  );
}

<MobileDatePicker value={value} onChange={setValue} />;
```

#### With Mantine `<Modal />` component

The user can use a Modal that expect different props for its lifecycle:

```tsx
import { useDateManager } from '@base-ui-components/react-x-date-pickers/managers';
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';
import { Modal, Button } from '@mantine/core';

function MobileDatePicker(props) {
  const manager = useDateManager();

  return (
    <Picker.Root manager={manager} {...props}>
      {({ open, openPicker, closePicker }) => (
        <DialogTrigger isOpen={open} onClose={closePicker}>
          <PickerField.Root>
            {/** See field documentation */}
            <Button onClick={openPicker}>📅</Button>
          </PickerField.Root>
          <Popover>
            <Dialog>
              <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
            </Dialog>
          </Popover>
        </DialogTrigger>
      )}
    </Picker.Root>
  );
}

<MobileDatePicker value={value} onChange={setValue} />;
```

### With Material UI

```tsx
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

<MobileDatePicker value={value} onChange={setValue} />;
```

:::success
This component could be renamed `<DialogDatePicker />` to better match its behavior.
:::

## Responsive usage

### Without Material UI

If the library does not provide any higher level utilities to create a responsive picker and sticks with "1 React component = 1 DOM element", here is what a responsive picker could look like:

```tsx
import { useDateManager } from '@base-ui-components/react-x-date-pickers/managers';
import { useMediaQuery } from '@base-ui-components/react-utils/useMediaQuery'; // not sure how the util package will be named
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';
import { Popover } from '@base-ui-components/react/popover';
import { Dialog } from '@base-ui-components/react/dialog';

function DatePicker(props) {
  const manager = useDateManager();
  const isDesktop = useMediaQuery('@media (pointer: fine)', {
    defaultMatches: true,
  });

  const field = (
    <PickerField.Root>
      {/** See field documentation */}
      {isDesktop ? (
        <Popover.Trigger>📅</Popover.Trigger>
      ) : (
        <Dialog.Trigger>📅</Dialog.Trigger>
      )}
    </PickerField.Root>
  );

  const view = <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>;

  if (isDesktop) {
    return (
      <Picker.Root manager={manager} {...props}>
        {({ open, setOpen }) => (
          <Popover.Root open={open} onOpenChange={setOpen}>
            {field}
            <Popover.Backdrop />
            <Popover.Positioner>
              <Popover.Popup>{view}</Popover.Popup>
            </Popover.Positioner>
          </Popover.Root>
        )}
      </Picker.Root>
    );
  }

  return (
    <Picker.Root manager={manager} {...props}>
      {({ open, setOpen }) => (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          {field}
          <Dialog.Backdrop />
          <Dialog.Popup>{view}</Dialog.Popup>
        </Dialog.Root>
      )}
    </Picker.Root>
  );
}

<DatePicker value={value} onChange={setValue}>
```

### With Material UI

The user can use the `<DatePicker />` component:

```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

<DatePicker value={value} onChange={setValue} />;
```

## Static usage

### Without Material UI

The user can use the `<Picker.StaticRoot />` component to create a static picker.
Most of the time, the user can use directly components such as `Calendar.*`, but the static picker can be useful in the following scenarios:

- several view components are used together (the main use case is to create a Date Time Picker). The static picker will make sure the value is correctly handled between those components.
- the user wants to add UI elements like a shortcut panel using utility components like `<Picker.SetValue />`.

```tsx
import { useDateManager } from '@base-ui-components/react-x-date-pickers/managers';
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';

function StaticDatePicker(props) {
  const manager = useDateManager();

  return (
    <Picker.StaticRoot manager={manager} {...props}>
      <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
    </Picker.StaticRoot>
  );
}

<StaticDatePicker value={value} onChange={setValue} />;
```

### With Material UI

TODO

## Usage with date and time

### Without Material UI

The user can use both the `Calendar.*` and the `DigitalClock.*` components together to render the date and the time picking UI side by side:

```tsx
import { Popover } from '@base-ui-components/react/popover';
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';
import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';
import { DigitalClock } from '@base-ui-components/react-x-date-pickers/digital-clock';

<Popover.Popup>
  <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
  <DigitalClock.Root>{/** See digital clock documentation */}</DigitalClock.Root>
</Popover.Popup>;
```

If the user wants to set the UI to select the date, then the time, he can conditionally render the view component based on the active section:

```tsx
import { Popover } from '@base-ui-components/react/popover';
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';
import { Calendar } from '@base-ui-components/react-x-date-pickers/calendar';
import { DigitalClock } from '@base-ui-components/react-x-date-pickers/digital-clock';
import { isDateSection } from '@base-ui-components/react-x-date-pickers/utils';

<Popover.Popup>
  <Picker.ContextValue>
    {({ activeSection }) =>
      isDateSection(activeSection) ? (
        <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
      ) : (
        <DigitalClock.Root>
          {/** See digital clock documentation */}
        </DigitalClock.Root>
      )
    }
  </Picker.ContextValue>
</Popover.Popup>;
```

### With Material UI

TODO

## Add an action bar

### Without Material UI

The user can use the `<Picker.AcceptValue />`, `<Picker.CancelValue />` and `<Picker.SetValue />` components to create an action bar and interact with the value:

```tsx
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';
import { Popover } from '@base-ui-components/react/popover';

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

### With Material UI

TODO

## Add a toolbar

### Without Material UI

The user can use the `<Picker.FormattedValue />` component to create a toolbar for its picker:

```tsx
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';
import { Popover } from '@base-ui-components/react/popover';

<Popover.Popup>
  <div>
    <Picker.FormattedValue format="MMMM YYYY" />
  </div>
  <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
</Popover.Popup>;
```

The toolbar can also be used to switch between sections thanks to the `<Picker.SetActiveSection />` component:

```tsx
import { Popover } from '@base-ui-components/react/popover';
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';

<Popover.Popup>
  <div>
    <Picker.SetActiveSection target="year">
      <Picker.FormattedValue format="YYYY" />
    </Picker.SetActiveSection>
    <Picker.SetActiveSection target="day">
      <Picker.FormattedValue format="DD MMMM" />
    </Picker.SetActiveSection>
  </div>
  <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
</Popover.Popup>;
```

### With Material UI

TODO

## Add tabs

### Without Material UI

The user can use the `<Picker.SetActiveSection />` component in combination with any Tabs / Tab components.

The example below uses the `Tabs` component from Base UI as an example:

```tsx
import { Tabs } from '@base-ui-components/react/tabs';
import { Popover } from '@base-ui-components/react/popover';
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';
import { isDateSection } from '@base-ui-components/react-x-date-pickers/utils';

<Popover.Popup>
  <Picker.ContextValue>
    {({ activeSection }) => (
      <Tabs.Root value={isDateSection(activeSection) ? 'date' : 'time'}>
        <Tabs.List>
          <Tabs.Tab
            value="date"
            render={(props) => <Picker.SetActiveSection {...props} target="day" />}
          >
            Date
          </Tabs.Tab>
          <Tabs.Tab
            value="time"
            render={(props) => <Picker.SetActiveSection {...props} target="hours" />}
          >
            Time
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    )}
  </Picker.ContextValue>
  <Calendar.Root>{/** See calendar documentation */}</Calendar.Root>
</Popover.Popup>;
```

### With Material UI

TODO

## Add shortcuts

### Without Material UI

The user can use the `<Picker.SetValue />` component to create a shortcut UI:

```tsx
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';
import { Popover } from '@base-ui-components/react/popover';

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
</Popover.Popup>;
```

:::success
To support the `isValid` param of the Material UI shortcut, a `useIsValidValue` hook could be added.
Without it, it's not trivial to use `useValidation` since it requires a value and params like the validation props or the timezone.

```tsx
import { useIsValueValid } from'@base-ui-components/react-x-date-pickers/hooks';
import { Picker } from '@base-ui-components/react-x-date-pickers/picker';

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

### With Material UI

TODO

## Anatomy of `Picker.*`

### `Picker.Root`

Top level component that wraps the other components.

It expects a function as its children, which receives the context value as a parameter:

```tsx
<Picker.Root manager={manager} {...props}>
  {({ open, setOpen }) => <Popover.Root open={open} onOpenChange={setOpen} />}
</Picker.Root>
```

#### Props

- `manager`: `PickerManager` - **required**

  :::success
  See [#15395](https://github.com/mui/mui-x/issues/15395) for context.
  :::

- `children`: `(contextValue: PickerContextValue) => React.ReactNode`

- **Value props**: `value`, `defaultValue`, `referenceDate`, `onChange`, `onError` and `timezone`.

  Same typing and behavior as today.

- **Validation props**: list based on the `manager` prop

  For `useDateManager()` it would be `maxDate`, `minDate`, `disableFuture`, `disablePast`, `shouldDisableDate`, `shouldDisableMonth`, `shouldDisableYear`.

  Same typing and behavior as today.

- **Form props**: `disabled`, `readOnly`.

  Same typing and behavior as today.

- **Open props**: `open`, `onOpenChange`

  The `onOpenChange` replaces the `onOpen` and `onClose` props in the current implementation

### `Picker.StaticRoot`

#### Props

Top level component that wraps the other components when there is not field UI but only views.

- `manager`: `PickerManager` - **required**

  :::success
  See [#15395](https://github.com/mui/mui-x/issues/15395) for context.
  :::

- `children`: `(contextValue: PickerContextValue) => React.ReactNode`

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

#### Usages in the styled version

- The title / individual sections in all the toolbar components (in combination with `<Picker.SetActiveSection />`)

### `Picker.ContextValue`

Utility component to access the picker public context.
Doesn't render a DOM node (it does not have a `render` prop either).

:::success
The user can also use `usePickerContext()`, but a component allows to not create a dedicated component to access things close from `<Picker.Root />`
:::

#### Props

- `children`: `(contextValue: PickerContextValue) => React.ReactNode`

### `Picker.SetValue`

Renders a button to set the current value.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

- `target`: `PickerValidDate` - **required**

- `importance`: `'set' | 'accept'`, default: `'accept'` (equivalent of the `changeImportance` prop on the `shortcut` slot)

- `skipValidation`: `boolean`, default: `false` (by default the button is disabled is the target value is not passing validation)

#### Usages in the styled version

- The List Item of `<PickersShortcuts />` (people creating custom UIs can also use this component)

- The Button of `<PickersActionBar />` that sets the value to today or clear the value

### `Picker.AcceptValue`

Renders a button to accept the current value.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

#### Usages in the styled version

- The Button of `<PickersActionBar />` that accepts the value

### `Picker.CancelValue`

Renders a button to cancel the current value.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

#### Usages in the styled version

- The Button of `<PickersActionBar />` that cancels the value

### `Picker.SetActiveSection`

Renders a button to set the active section.

#### Usages in the styled version

- The Tab in `<DateTimePickerTabs />`

- The Tab in `<DateTimeRangePickerTabs />` (might require manually using `usePickerContext` to make the range position change work)

#### Props

- Extends `React.HTMLAttributes<HTMLButtonELement>`

- `target`: `PickerSectionType` (current `FieldSectionType` that would be renamed) - **required**

#### Usages in the styled version

- The title / individual sections in all the toolbar components (in combination with `<Picker.FormattedValue />`)
