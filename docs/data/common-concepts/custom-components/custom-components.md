# Custom slots and subcomponents

<p class="description">Learn how to override parts of the MUI X components.</p>

## What is a slot?

A slot is a part of a component that can be [overridden](/x/common-concepts/custom-components/#how-to-override-a-slot) and/or [customized](/x/common-concepts/custom-components/#how-to-customize-a-slot).

Some of those slots allow you to provide your own UI primitives to the MUI X components.
This is the role of all the `baseXXX` component on the Data Grid component (`baseButton`, `baseSelect`, ...).
These slots receive props that should be as generic as possible so they can integrate well with any other design system.

Other slots allow you to override parts of the MUI X UI components with a custom UI built specifically for this component.
This is the role of slots like `calendarHeader` on the `DateCalendar` component or `item` on the Rich Tree View component.
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
}: PropsFromSlot<DateCalendarSlots['calendarHeader']>) {
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
type CalendarHeaderProps = PropsFromSlot<DateCalendarSlots['calendarHeader']>;
```

:::

### Using additional props

If you are passing additional props to your slot, you can add them to the props your custom component receives:

```ts
interface CustomCalendarHeaderProps extends PropsFromSlot<
  DateCalendarSlots['calendarHeader']
> {
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
        calendarHeader: CustomCalendarHeader as DateCalendarSlots['calendarHeader'],
      }}
      slotProps={{
        calendarHeader: {
          displayWeekNumber,
          setDisplayWeekNumber,
        } as DateCalendarSlotProps['calendarHeader'],
      }}
    />
  );
}
```

{{"demo": "TypescriptCasting.js", "defaultCodeOpen": false}}

### Using module augmentation

If you are using one of the Data Grid or Charts packages,
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
      showToolbar
    />
  );
}
```

For more details, see:

- [Data Grid - Custom slots and subcomponents—Custom slot props with TypeScript](/x/react-data-grid/components/#custom-slot-props-with-typescript)
- [Charts - Custom slot props with TypeScript](/x/react-charts/components/#custom-slot-props-with-typescript)

:::warning
The module augmentation feature isn't implemented yet for the other sets of components. It's coming.

- 👍 Upvote [issue 9775](https://github.com/mui/mui-x/issues/9775) if you want to see it land faster on the Date and Time Pickers.
- 👍 Upvote [issue 14062](https://github.com/mui/mui-x/issues/14062) if you want to see it land faster on the Tree View.

  :::

### Passing `data-*` attributes to slots

By default, slot prop types don't accept arbitrary `data-*` attributes (such as test locators like `data-testid`).
To allow them, augment the `DataAttributesOverrides` interface once, anywhere in your project.

Augment `@mui/material/utils` to cover both Material UI and MUI X slots with a single declaration:

```ts
declare module '@mui/material/utils' {
  interface DataAttributesOverrides {
    // Accept any data-* key. Or list keys explicitly for autocomplete and typo-checking.
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}
```

`data-*` attributes then type-check on the slots of every supported package:

- **Charts** — `<BarChart slotProps={{ tooltip: { 'data-testid': 'chart-tooltip' } }} />`
- **Date and Time Pickers** — `<DateCalendar slotProps={{ day: { 'data-testid': 'day' } }} />`
- **Tree View** — `<RichTreeView slotProps={{ item: { 'data-testid': 'item' } }} />`
- **Chat** — `<ChatBox slotProps={{ messageRoot: { 'data-testid': 'message' } }} />`

:::warning
The `@mui/material/utils` path requires `@mui/material` **v9.2.0 or later**, where the interface is re-exported. On 9.2+, Material UI and MUI X resolve to one shared `@mui/utils`, so the augmentation always applies -- this is the dependable setup.

Packages with no Material UI dependency (such as Chat Headless) can augment `@mui/utils/types` directly: there is a single `@mui/utils`, so it applies cleanly to the MUI X slots.

An older Material UI (notably v7, which depends on `@mui/utils@^7`) leaves two `@mui/utils` copies that cannot dedupe -- Material UI's v7 and MUI X's v9.2 -- so TypeScript may augment the v7 copy and `data-*` stays a type error. Adding `@mui/utils` (`^9.2.0`) as a direct dependency can make your own augmentation resolve to the same v9.2 copy MUI X uses (the two v9.2 ranges dedupe; the v7 copy stays separate). This still depends on your package manager collapsing the v9.2 copies, so treat it as best-effort -- the reliable fix is to upgrade Material UI to 9.2 or later.
:::

The augmentation shares the same interface as Material UI. See the [Material UI TypeScript guide](/material-ui/guides/typescript/#allowing-data-attributes-on-slotprops) for the full explanation and the strict (explicit-key) variant.

Data Grid isn't covered by this augmentation yet; use its per-slot [`*PropsOverrides`](/x/react-data-grid/components/#custom-slot-props-with-typescript) instead.

## Slots of the X components

You can find the list of slots in the API documentation of each component (for example [DataGrid](/x/api/data-grid/data-grid/#slots), [DatePicker](/x/api/date-pickers/date-picker/#slots), [BarChart](/x/api/charts/bar-chart/#slots) or [RichTreeView](/x/api/tree-view/rich-tree-view/#slots)).

Most of the slots have a standalone doc example to show how to use them:

- [Data Grid—Custom slots and subcomponents](/x/react-data-grid/components/)
- [Date Picker—Custom slots and subcomponents](/x/react-date-pickers/custom-components/)
- [RichTreeView—Customization](/x/react-tree-view/rich-tree-view/customization/) / [SimpleTreeView—Customization](/x/react-tree-view/simple-tree-view/customization/)
