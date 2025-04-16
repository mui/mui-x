# Data Grid - Components usage

<p class="description">Learn how to customize the Data Grid with composable components.</p>

## Introduction

By default, the `<DataGrid />` component includes all of the interfaces necessary for users to interact with the built-in features. Where more flexibility is needed over what gets rendered, the Data Grid package includes a set of highly customizable components:

- [Toolbar](/x/react-data-grid/components/toolbar/)
- [Export](/x/react-data-grid/components/export/)
- [Quick Filter](/x/react-data-grid/components/quick-filter/)
- [Prompt Field](/x/react-data-grid/components/prompt-field/) [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')
- [Columns Panel](/x/react-data-grid/components/columns-panel/) 🚧
- [Filter Panel](/x/react-data-grid/components/filter-panel/) 🚧
- [Pivot Panel](/x/react-data-grid/components/pivot-panel/) [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')🚧
- [AI Assistant Panel](/x/react-data-grid/components/ai-assistant-panel/) [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')🚧

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

## Customization

The component parts are highly customizable, built to integrate with any design system, and any styling method.

### CSS classes

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

### Render prop

The `render` prop provides control over how the components are rendered. It serves three main purposes:

1. Replacing the default rendered element
2. Providing access to props and internal state
3. Merging functionality between two or more components

#### Custom elements

You can use the `render` prop to replace the default rendered element with your own:

```tsx
<FilterPanelTrigger render={<CustomButton />} />
```

#### Render function

When you need access to the component's props or internal state, you can pass a function to the `render` prop, as shown in the example below. This pattern is particularly useful when you need to:

1. Use internal state for custom rendering
2. Access and handle component props (like event handlers)
3. Transform props before passing them to your custom element

```tsx
// Access props
<FilterPanelTrigger
  render={(props) => <ToolbarButton onClick={props.onClick}>Filters</ToolbarButton>}
/>

// Access state
<FilterPanelTrigger
  render={(props, state) => (
    <ToolbarButton {...props}>
      {state.open ? 'Close filter panel' : 'Open filter panel'}
    </ToolbarButton>
  )}
/>
```

#### Prop forwarding

Any props passed to the components will be forwarded directly to their corresponding HTML element. For example:

```tsx
<Toolbar className="my-toolbar" aria-label="Grid toolbar" />

// Rendered HTML:
<div role="toolbar" class="my-toolbar" aria-label="Grid toolbar" />
```

#### Providing children

You can provide children to the rendered element in two ways:

```tsx
// Method 1: Children inside the rendered component
<FilterPanelTrigger render={<CustomButton>Filters</CustomButton>} />

// Method 2: Children of <FilterPanelTrigger />
<FilterPanelTrigger render={<CustomButton />}>Filters</FilterPanelTrigger>
```

Both methods above will produce the same result, as the component automatically passes its children to the rendered element.

#### Avoiding nested elements

A common use case for the `render` prop is when composing components that render the same HTML element. For example, both `FilterPanelTrigger` and `ToolbarButton` render a button element. The `render` prop in this example merges the functionality of both components whilst ensuring that only one button gets rendered:

```tsx
// ❌ This creates nested button elements
<FilterPanelTrigger>
  <ToolbarButton>
    Filters
  </ToolbarButton>
</FilterPanelTrigger>

// ✅ This merges the props and renders a single button
<FilterPanelTrigger render={<ToolbarButton />}>
  Filters
</FilterPanelTrigger>
```
