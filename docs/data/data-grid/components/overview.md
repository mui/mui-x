# Data Grid - Grid components

<p class="description">Grid components provide a way to extend the default Data Grid UI via composable parts.</p>

## Introduction

The `Grid` component is available to import from the same package as the `DataGrid` component. It consists of many parts that can be used in combination with [slots](/x/react-data-grid/components/) to extend the Data Grid.

```tsx
import { DataGrid, Grid } from '@mui/x-data-grid';

function Toolbar() {
  return (
    <Grid.Toolbar>
      <Grid.FilterPanel.Trigger render={<Grid.Toolbar.Button />}>
        Filters
      </Grid.FilterPanel.Trigger>
    </Grid.Toolbar>
  );
}

function App() {
  return <DataGrid slots={{ toolbar: Toolbar }} />;
}
```

## Customization

The `render` prop can be used to override the element rendered by each grid component.

```tsx
<Grid.FilterPanel.Trigger render={<MyCustomButton />} />
```

A function can also be passed to the `render` prop, giving you control over the props that are forwarded to the custom element.

```tsx
<Grid.FilterPanel.Trigger
  render={(props) => <MyCustomButton onClick={props.onClick} />}
/>
```

Some parts also provide internal state that can be used to control what is rendered by the `render` function.

```tsx
<Grid.FilterPanel.Trigger
  render={(props, state) => (
    <MyCustomButton {...props}>
      {state.open ? 'Close filter panel' : 'Open filter panel'}
    </MyCustomButton>
  )}
/>
```
