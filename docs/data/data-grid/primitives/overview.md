# Data Grid - Primitives

<p class="description">A set of primitive components that can be used to customize the Data Grid.</p>

## Introduction

By default, the `<DataGrid />` component includes all of the interfaces necessary for users to interact with the built-in features. Where more flexibility is needed over what gets rendered, the Data Grid package includes a set of highly customizable primitive components.

The primitive components are available to import from the following paths:

- Community package: `@mui/x-data-grid/primitives`
- Pro package: `@mui/x-data-grid-pro/primitives`
- Premium package: `@mui/x-data-grid-premium/primitives`

### Composition

Primitive components consist of several parts. For example, `Toolbar.Root` and `Toolbar.Button` are parts of the [Toolbar component](/x/react-data-grid/components/toolbar/). Any props you pass to these parts will be forwarded directly to their corresponding HTML element. For example:

```tsx
// This will render a <div /> element with the class and aria-label attributes
<Toolbar.Root className="my-toolbar" aria-label="Grid toolbar" />
```

The snippet below is an example of how to compose primitive components to create a custom toolbar.

```tsx
import { Toolbar, FilterPanel } from '@mui/x-data-grid/primitives';

function CustomToolbar() {
  return (
    <Toolbar.Root>
      <FilterPanel.Trigger render={<Toolbar.Button />}>Filters</FilterPanel.Trigger>
    </Toolbar.Root>
  );
}
```

The custom toolbar can then be passed to the `toolbar` [slot](/x/react-data-grid/components/):

```
function App() {
  return <DataGrid slots={{ toolbar: CustomToolbar }} />;
}
```

See [Primitives—Components](#components) for the full list of components.

### Customization

The primitive components are highly customizable, built to integrate with components from any design system, and any styling method.

#### className

The `className` prop can be used to apply styles:

```tsx
<FilterPanel.Trigger className="text-blue-600 underline" />
```

Some components also provide internal state that can be used to conditionally apply classes:

```tsx
<FilterPanel.Trigger
  className={(state) => (state.open ? 'text-blue-600' : 'text-gray-900')}
/>
```

#### render

The `render` prop can be used to override the element rendered by each grid component:

```tsx
<FilterPanel.Trigger render={<MyCustomButton />} />
```

A function can also be passed to the `render` prop to control which props are forwarded to the custom element:

```tsx
<FilterPanel.Trigger
  render={(props) => <MyCustomButton onClick={props.onClick} />}
/>
```

Some components also provide internal state that can be used to control what is returned by the `render` function:

```tsx
<FilterPanel.Trigger
  render={(props, state) => (
    <MyCustomButton {...props}>
      {state.open ? 'Close filter panel' : 'Open filter panel'}
    </MyCustomButton>
  )}
/>
```

## Components

- [Toolbar](/x/react-data-grid/primitives/toolbar/)
- [Export](/x/react-data-grid/primitives/export/)
- [Quick Filter](/x/react-data-grid/primitives/quick-filter/)
- [Columns Panel](/x/react-data-grid/primitives/columns-panel/) 🚧
- [Filter Panel](/x/react-data-grid/primitives/filter-panel/) 🚧
