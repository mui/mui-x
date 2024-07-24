# Custom slots and subcomponents

<p class="description">Learn how to override the default DOM structure of the MUI X components.</p>

## What is a slot?

A slot is a part of a component that can be overridden and / or customized.

## Basic usage

### How to override a slot?

You can override a slot by providing a custom component to the `slots` prop:

{{"demo": "CustomSlot.js"}}

### How to customize a slot?

You can pass props to any slot using the `slotProps` prop:

{{"demo": "CustomSlotProps.js"}}

You can also use both `slots` and `slotProps` on the same component:

{{"demo": "CustomSlotAndSlotProps.js"}}

Most components also support a callback version of `slotProps`.
This callback receives an object that contains information about the current state of the component,
that information can vary depending on the slot being used:

{{"demo": "CustomSlotPropsCallback.js"}}

## Recommended usage

A slot is a React component; therefore, it should follow some basic rules:

### Stable JavaScript reference

Slots should keep the same JavaScript reference between two renders.
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
export default function MyApp() {
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

If you are using one of the data grid packages,
you can also use [module augmentation](/x/react-data-grid/components/#custom-slot-props-with-typescript) to let TypeScript know about your custom props:

```tsx
import { DataGrid, GridSlots, PropsFromSlot } from '@mui/x-data-grid';

// Augment the props for the toolbar slot
declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    name: string;
    setName: (name: string) => void;
  }
}

function CustomToolbar({ name, setName }: PropsFromSlot<GridSlots['toolbar']>) {
  return <input value={name} onChange={(event) => setName(event.target.value)} />;
}

function MyApp() {
  const [name, setName] = React.useState('');

  return (
    <DataGrid
      rows={[]}
      columns={[]}
      slots={{
        // Pass your custom component to the toolbar slot.
        toolbar: CustomToolbar,
      }}
      slotProps={{
        toolbar: {
          // Pass your custom props to CustomToolbar.
          // Since you are using module augmentation, you don't need to cast the props.
          name,
          setName,
        },
      }}
    />
  );
}
```

:::info
See [Data Grid - Custom slots and subcomponents—Custom slot props with TypeScript](/x/react-data-grid/components/#custom-slot-props-with-typescript) for more details.
:::

## Slots of the X components

You can find the list of slots in the API documentation of each component (e.g. [DataGrid](/x/api/data-grid/data-grid/#slots), [DatePicker](/x/api/date-pickers/date-picker/#slots), [BarChart](/x/api/charts/bar-chart/#slots) or [RichTreeView](/x/api/tree-view/rich-tree-view/#slots)).

Most of the slots have a standalone doc example to show how to use them:

| Set of components     | Documentation                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Data Grid             | [Custom subcomponents](/x/react-date-pickers/custom-components/)                                                                                                   |
| Date and Time Pickers | [Custom slots and subcomponents](/x/react-date-pickers/custom-components/)                                                                                         |
| Charts                |                                                                                                                                                                    |
| Tree View             | [RichTreeView—Customization](/x/react-tree-view/rich-tree-view/customization/), [SimpleTreeView—Customization](/x/react-tree-view/simple-tree-view/customization/) |
