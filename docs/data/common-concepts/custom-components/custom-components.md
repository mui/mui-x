# Custom slots and subcomponents

<p class="description">Learn how to override the default DOM structure of the MUI X components.</p>

## What is a slot?

A slot is a part of a component that can be overridden and / or customized.

## How to override a slot?

You can override a slot by providing a custom component to the `slots` prop:

{{"demo": "CustomSlot.js"}}

## How to customize a slot?

You can pass props to any slot using the `slotProps` prop:

{{"demo": "CustomSlotProps.js"}}

You can also use both `slots` and `slotProps` on the same component:

{{"demo": "CustomSlotAndSlotProps.js"}}

## Recommended usage

A slot is a React component; therefore, it should follow some basic rules:

### Stable JavaScript reference

Slots should keep the same JavaScript reference between two renders.
If the JavaScript reference of component changes between two renders, React will remount it.
You can avoid it by not inlining the component definition in the `slots` prop.

The first two examples below are buggy because the toolbar will remount after each keystroke, leading to a loss of focus.

```jsx
// ❌ The `toolbar` slot is re-defined each time the parent component renders,
// causing the component to remount.
function MyApp() {
  return (
    <DataGrid
      slots={{
        toolbar: () => (
          <input value={name} onChange={(event) => setName(event.target.value)} />
        ),
      }}
    />
  );
}
```

```jsx
// ❌ The `toolbar` slot is re-defined each time `name` is updated,
// causing the component to remount.
function MyApp() {
  const [name, setName] = React.useState('');

  const CustomToolbar = React.useCallback(
    () => <input value={name} onChange={(event) => setName(event.target.value)} />,
    [name],
  );

  return <DataGrid slots={{ toolbar: CustomToolbar }} />;
}
```

```jsx
// ✅ The `toolbar` slot is defined only once, it will never remount.
const CustomToolbar = ({ name, setName }) => (
  <input value={name} onChange={(event) => setName(event.target.value)} />
);

function MyApp() {
  const [name, setName] = React.useState('');
  return (
    <DataGrid
      slots={{ toolbar: CustomToolbar }}
      slotProps={{ toolbar: { name, setName } }}
    />
  );
}
```

### Usage with TypeScript

If your custom component has a different type than the default one, you can cast it to the correct type.
This can happen if you pass additional props to your custom component using `slotProps`.
If we take the example of the `toolbar` slot, you can cast your custom component as below:

```tsx
// Ensures type safety to your slots
type CustomToolbarProps = NonNullable<DataGridProps['slotProps']>['toolbar'] & {
  name: string;
  setName: (name: string) => void;
};

const CustomToolbar = ({ name, setName }: CustomToolbarProps) => (
  <input value={name} onChange={(event) => setName(event.target.value)} />
);

function MyApp() {
  const [name, setName] = React.useState('');
  return (
    <DataGrid
      rows={[]}
      columns={[]}
      // Cast the custom component to the type expected by the X component
      slots={{
        toolbar: CustomToolbar as NonNullable<DataGridProps['slots']>['toolbar'],
      }}
      slotProps={{
        toolbar: { name, setName } as NonNullable<
          DataGridProps['slotProps']
        >['toolbar'],
      }}
    />
  );
}
```

:::success
If you are using the data grid, you can also use [module augmentation to enhance the props interface](/x/react-data-grid/components/#custom-slot-props-with-typescript)
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
