# Data Grid - Components

<p class="description">Data Grid components provide a way to extend the default UI via composable parts.</p>

## Introduction

The `Grid` component is available to import from the same package as the `DataGrid` component. It consists of many parts that can be used in combination with [slots](/x/react-data-grid/components/) to extend the Data Grid.

```tsx
import { DataGrid, Grid } from '@mui/x-data-grid';

function Toolbar() {
  return (
    <Grid.Toolbar.Root>
      <Grid.FilterPanel.Trigger render={<Grid.Toolbar.Button />}>
        Filters
      </Grid.FilterPanel.Trigger>
    </Grid.Toolbar.Root>
  );
}

function App() {
  return <DataGrid slots={{ toolbar: Toolbar }} />;
}
```

## Customization

The grid components are highly customizable, built to integrate with components from any design system, and any styling method.

### className

The `className` prop can be used to apply styles to grid components:

```tsx
<Grid.FilterPanel.Trigger className="text-blue-600 underline" />
```

Some grid components also provide internal state that can be used to conditionally apply classes:

```tsx
<Grid.FilterPanel.Trigger
  className={(state) => (state.open ? 'text-blue-600' : 'text-gray-900')}
/>
```

### render

The `render` prop can be used to override the element rendered by each grid component:

```tsx
<Grid.FilterPanel.Trigger render={<MyCustomButton />} />
```

A function can also be passed to the `render` prop, giving you control over the props that are forwarded to the custom element:

```tsx
<Grid.FilterPanel.Trigger
  render={(props) => <MyCustomButton onClick={props.onClick} />}
/>
```

Some grid components also provide internal state that can be used to control what is returned by the `render` function:

```tsx
<Grid.FilterPanel.Trigger
  render={(props, state) => (
    <MyCustomButton {...props}>
      {state.open ? 'Close filter panel' : 'Open filter panel'}
    </MyCustomButton>
  )}
/>
```

## Components

- [Toolbar](/x/react-data-grid/components/toolbar/)
- [Columns Panel](/x/react-data-grid/components/columns-panel/)
- [Filter Panel](/x/react-data-grid/components/filter-panel/)
- [Export](/x/react-data-grid/components/export/)
