# Data Grid - Grid components

<p class="description">Grid components provide a way to extend the default grid UI via composable parts.</p>

## Introduction

Grid components can be used by importing `Grid` from the data grid package:

```tsx
import { DataGrid, Grid } from '@mui/x-data-grid';
```

### Composition

The `Grid` namespace organizes composable UI components (like `Grid.Toolbar` and `Grid.FilterPanel`) that can be used to extend the Data Grid through [slots](/x/react-data-grid/components/).

Each grid component is built of several parts. For example, `Grid.Toolbar.Root` and `Grid.Toolbar.Button` are parts of the [Toolbar component](/x/react-data-grid/components/toolbar/).

The snippet below is an example of how to compose grid components to create a custom toolbar.

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

### Customization

The grid components are highly customizable, built to integrate with components from any design system, and any styling method.

#### className

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

#### render

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
- [Quick Filter](/x/react-data-grid/components/quick-filter/)
