# Data Grid - Components usage

<p class="description">Learn how to customize the Data Grid with composable components.</p>

## Introduction

By default, the `<DataGrid />` component includes all of the interfaces necessary for users to interact with the built-in features. Where more flexibility is needed over what gets rendered, the Data Grid package includes a set of highly customizable components:

- [Toolbar](/x/react-data-grid/components/toolbar/)
- [Export](/x/react-data-grid/components/export/)
- [Quick Filter](/x/react-data-grid/components/quick-filter/)
- [Columns Panel](/x/react-data-grid/components/columns-panel/) 🚧
- [Filter Panel](/x/react-data-grid/components/filter-panel/) 🚧

## Composition

The components are composable and consist of several parts. For example, `Toolbar` and `ToolbarButton` are parts of the [Toolbar component](/x/react-data-grid/components/toolbar/).

The snippet below is an example of how to assemble components to create a custom toolbar.

```tsx
import { Toolbar, ToolbarButton, FilterPanelTrigger } from '@mui/x-data-grid';

function CustomToolbar() {
  return (
    <Toolbar>
      <FilterPanelTrigger render={<ToolbarButton />}>Filters</FilterPanelTrigger>
    </Toolbar>
  );
}
```

The custom toolbar can then be passed to the `toolbar` [slot](/x/react-data-grid/components/):

```tsx
function App() {
  return <DataGrid slots={{ toolbar: CustomToolbar }} showToolbar />;
}
```

Any props passed to these parts will be forwarded directly to their corresponding HTML element. For example:

```tsx
// This will render a <div /> element with the class and aria-label attributes
<Toolbar className="my-toolbar" aria-label="Grid toolbar" />
```

## Customization

The component parts are highly customizable, built to integrate with any design system, and any styling method.

### className

The `className` prop can be used to apply styles:

```tsx
<FilterPanelTrigger className="text-blue-600 underline" />
```

Some components also provide internal state that can be used to conditionally apply classes:

```tsx
<FilterPanelTrigger
  className={(state) => (state.open ? 'text-blue-600' : 'text-gray-900')}
/>
```

### render

The `render` prop can be used to override the element rendered by each grid component. You can provide children in two ways:

```tsx
// Method 1: Children inside the rendered component
<FilterPanelTrigger render={<MyCustomButton>Filters</MyCustomButton>} />

// Method 2: Children of FilterPanelTrigger
<FilterPanelTrigger render={<MyCustomButton />}>Filters</FilterPanelTrigger>
```

Both methods above will produce the same result, as `<FilterPanelTrigger />` automatically passes its children to the rendered component.

A function can also be passed to the `render` prop to control which props are forwarded to the custom element:

```tsx
<FilterPanelTrigger
  render={(props) => (
    <MyCustomButton onClick={props.onClick}>Filters</MyCustomButton>
  )}
/>
```

Some components also provide internal state that can be used to control what is returned by the `render` function:

```tsx
<FilterPanelTrigger
  render={(props, state) => (
    <MyCustomButton {...props}>
      {state.open ? 'Close filter panel' : 'Open filter panel'}
    </MyCustomButton>
  )}
/>
```
