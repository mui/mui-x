# Data Grid - Grid components

<p class="description">Grid components provide a way to extend the default grid UI via composable parts.</p>

## Introduction

Grid components can be used by importing `Grid` from the data grid package:

```tsx
import { DataGrid, Grid } from '@mui/x-data-grid';
```

By itself, `Grid` doesn't render anything. It is a namespace that acts to organize the grid components e.g. `Grid.Toolbar` and `Grid.FilterPanel`.

The grid components can be used in combination with [slots](/x/react-data-grid/components/) to extend the Data Grid, as shown in the snippet below.

```tsx
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

### Key concepts

There are some key concepts that make grid components different from the other [Data Grid subcomponents](/x/react-data-grid/components/):

- Each grid component is built of several parts. For example, `Grid.Toolbar.Root` and `Grid.Toolbar.Button` are parts of the [Toolbar component](/x/react-data-grid/components/toolbar/).
- The component namespace, e.g. `Grid.Toolbar`, does not render anything by itself, but acts as a way to organize the various parts.
- Highly customizable via the `className` and `render` prop. See the [customization](/x/react-data-grid/components/overview/#customization) section below to learn more.

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

A function can also be passed to the `render` prop to control which props are forwarded to the custom element:

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
