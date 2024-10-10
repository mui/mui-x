# Custom slots and subcomponents

<p class="description">Learn how to override parts of the MUI X components.</p>

## What is a slot?

A slot is a part of a component that can be [overridden](/x/common-concepts/custom-components/#how-to-override-a-slot) and/or [customized](/x/common-concepts/custom-components/#how-to-customize-a-slot).

Some of those slots allow you to provide your own UI primitives to the MUI X components.
This is the role of all the `baseXXX` component on the Data Grid component (`baseButton`, `baseSelect`, ...).
These slots receive props that should be as generic as possible so that it is easy to interface any other design system.

Other slots allow you to override parts of the MUI X UI components with a custom UI built specifically for this component.
This is the role of slots like `calendarHeader` on the `DateCalendar` component or `item` on the `RichTreeView` component.
These slots receive props specific to this part of the UI and will most likely not be re-use throughout your application.

## Basic usage

### How to override a slot?

You can override a slot by providing a custom component to the `slots` prop:

{{"demo": "CustomSlot.js"}}

### How to customize a slot?

You can pass props to any slot using the `slotProps` prop:

{{"demo": "CustomSlotProps.js"}}

You can also use both `slots` and `slotProps` on the same component:

{{"demo": "CustomSlotAndSlotProps.js"}}

Most slots also support a callback version of `slotProps`.
This callback receives an object that contains information about the current state of the component,
that information can vary depending on the slot being used:

{{"demo": "CustomSlotPropsCallback.js"}}

## Correct usage

A slot is a React component; therefore, it should keep the same JavaScript reference between two renders.
If the JavaScript reference of component changes between two renders, React will remount it.
You can avoid it by not inlining the component definition in the `slots` prop.

The first two examples below are buggy because the calendar header will remount after each keystroke, leading to a loss of focus.

```jsx
// ❌ The `calendarHeader` slot is re-defined each time the parent component renders,
// causing the component to remount.
function MyApp() {
  const [name, setName] = React.useState('');
  return (
    <DateCalendar
      slots={{
        calendarHeader: () => (
          <input value={name} onChange={(event) => setName(event.target.value)} />
        ),
      }}
    />
  );
}
```

```jsx
// ❌ The `calendarHeader` slot is re-defined each time `name` is updated,
// causing the component to remount.
function MyApp() {
  const [name, setName] = React.useState('');

  const CustomCalendarHeader = React.useCallback(
    () => <input value={name} onChange={(event) => setName(event.target.value)} />,
    [name],
  );

  return <DateCalendar slots={{ calendarHeader: CustomCalendarHeader }} />;
}
```

```jsx
// ✅ The `calendarHeader` slot is defined only once, it will never remount.
const CustomCalendarHeader = ({ name, setName }) => (
  <input value={name} onChange={(event) => setName(event.target.value)} />
);

function MyApp() {
  const [name, setName] = React.useState('');
  return (
    <DateCalendar
      slots={{ calendarHeader: CustomCalendarHeader }}
      slotProps={{ calendarHeader: { name, setName } }}
    />
  );
}
```

## Usage with TypeScript

### Type custom slots

If you want to ensure type safety on your custom slot component,
you can declare your component using the `PropsFromSlot` interface:

```tsx
function CustomCalendarHeader({
  currentMonth,
}: PropsFromSlot<DateCalendarSlots<Dayjs>['calendarHeader']>) {
  return <div>{currentMonth?.format('MM-DD-YYYY')}</div>;
}
```

:::success
The `PropsFromSlot` is exported from every package that supports slots:

```ts
import { PropsFromSlot } from '@mui/x-data-grid/models';
import { PropsFromSlot } from '@mui/x-date-pickers/models';
// ...
```

It takes the slot type (as defined in the `slots` prop of your component) and returns the props that the slot receives.

```ts
import { Dayjs } from 'dayjs';
import { PropsFromSlot, GridSlots } from '@mui/x-data-grid';
import { DateCalendarSlots } from '@mui/x-date-pickers';

type ToolbarProps = PropsFromSlot<GridSlots['toolbar']>;

// Most of the picker slots interfaces need to receive the date type as a generic.
type CalendarHeaderProps = PropsFromSlot<DateCalendarSlots<Dayjs>['calendarHeader']>;
```

:::

### Using additional props

If you are passing additional props to your slot, you can add them to the props your custom component receives:

```ts
interface CustomCalendarHeaderProps
  extends PropsFromSlot<DateCalendarSlots<Dayjs>['calendarHeader']> {
  displayWeekNumber: boolean;
  setDisplayWeekNumber: (displayWeekNumber: boolean) => void;
}
```

You can then use these props in your custom component and access both the props provided by the host component
and the props you added:

```tsx
function CustomCalendarHeader({
  displayWeekNumber,
  setDisplayWeekNumber,
  ...other
}: CustomCalendarHeaderProps) {
  return (
    <Stack>
      <DisplayWeekNumberToggle
        value={displayWeekNumber}
        onChange={setDisplayWeekNumber}
      />
      <PickersCalendarHeader {...other} />
    </Stack>
  );
}
```

If your custom component has a different type than the default one, you will need to cast it to the correct type.
This can happen if you pass additional props to your custom component using `slotProps`.
If we take the example of the `calendarHeader` slot, you can cast your custom component as below:

```tsx
function MyApp() {
  const [displayWeekNumber, setDisplayWeekNumber] = React.useState(false);
  return (
    <DateCalendar
      displayWeekNumber={displayWeekNumber}
      slots={{
        calendarHeader:
          CustomCalendarHeader as DateCalendarSlots<Dayjs>['calendarHeader'],
      }}
      slotProps={{
        calendarHeader: {
          displayWeekNumber,
          setDisplayWeekNumber,
        } as DateCalendarSlotProps<Dayjs>['calendarHeader'],
      }}
    />
  );
}
```

{{"demo": "TypescriptCasting.js", "defaultCodeOpen": false}}

### Using module augmentation

If you are using one of the Data Grid packages,
you can also use [module augmentation](/x/react-data-grid/components/#custom-slot-props-with-typescript) to let TypeScript know about your custom props:

```ts
declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    name: string;
    setName: (name: string) => void;
  }
}
```

You can then use your custom slot without any type casting:

```tsx
function CustomToolbar({ name, setName }: PropsFromSlot<GridSlots['toolbar']>) {
  return <input value={name} onChange={(event) => setName(event.target.value)} />;
}

function MyApp() {
  const [name, setName] = React.useState('');
  return (
    <DataGrid
      rows={[]}
      columns={[]}
      slots={{ toolbar: CustomToolbar }}
      slotProps={{
        toolbar: { name, setName },
      }}
    />
  );
}
```

See [Data Grid - Custom slots and subcomponents—Custom slot props with TypeScript](/x/react-data-grid/components/#custom-slot-props-with-typescript) for more details.

:::warning
The module augmentation feature isn't implemented yet for the other sets of components. It's coming.

- 👍 Upvote [issue 9775](https://github.com/mui/mui-x/issues/9775) if you want to see it land faster on the Date and Time Pickers.
- 👍 Upvote [issue 14063](https://github.com/mui/mui-x/issues/14063) if you want to see it land faster on the Charts.
- 👍 Upvote [issue 14062](https://github.com/mui/mui-x/issues/14062) if you want to see it land faster on the Tree View.

  :::

## Slots of the X components

You can find the list of slots in the API documentation of each component (for example [DataGrid](/x/api/data-grid/data-grid/#slots), [DatePicker](/x/api/date-pickers/date-picker/#slots), [BarChart](/x/api/charts/bar-chart/#slots) or [RichTreeView](/x/api/tree-view/rich-tree-view/#slots)).

Most of the slots have a standalone doc example to show how to use them:

- [Data Grid—Custom slots and subcomponents](/x/react-data-grid/components/)
- [Date Picker—Custom slots and subcomponents](/x/react-date-pickers/custom-components/)
- [RichTreeView—Customization](/x/react-tree-view/rich-tree-view/customization/) / [SimpleTreeView—Customization](/x/react-tree-view/simple-tree-view/customization/)
