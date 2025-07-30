---
productId: x-data-grid
components: QuickFilter, QuickFilterControl, QuickFilterClear, QuickFilterTrigger
packageName: '@mui/x-data-grid'
githubLabel: 'scope: data grid'
---

# Data Grid - Quick Filter component

Provide users with an expandable search field to filter data in the Data Grid.

The [quick filter feature](/x/react-data-grid/filtering/quick-filter/) is enabled by default when `showToolbar` is passed to the `<DataGrid />` component.

You can use the Quick Filter and [Toolbar](/x/react-data-grid/components/toolbar/) components when you need to customize the quick filter, or when implementing a custom toolbar.

## Basic usage

The demo below shows how to compose the various Quick Filter parts to look and behave like the built-in toolbar quick filter.

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

type OwnerState = {
  expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
  display: 'grid',
  alignItems: 'center',
  marginLeft: 'auto',
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
  }),
);

const StyledTextField = styled(TextField)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  overflowX: 'clip',
  width: ownerState.expanded ? 260 : 'var(--trigger-width)',
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(['width', 'opacity']),
}));

function CustomToolbar() {
  return (
    <Toolbar>
      <StyledQuickFilter>
        <QuickFilterTrigger
          render={(triggerProps, state) => (
            <Tooltip title="Search" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded: state.expanded }}
                color="default"
                aria-disabled={state.expanded}
              >
                <SearchIcon fontSize="small" />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded: state.expanded }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}

export default function GridQuickFilter() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}

```

## Anatomy

```tsx
import {
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
} from '@mui/x-data-grid';

<QuickFilter>
  <QuickFilterTrigger />
  <QuickFilterControl />
  <QuickFilterClear />
</QuickFilter>;
```

### Quick Filter

`<QuickFilter />` is the top level component that provides context to child components.
It renders a `<div />` element.

### Quick Filter Control

`<QuickFilterControl />` takes user input and filters row data.
It renders the `baseTextField` slot.

### Quick Filter Clear

`<QuickFilterClear />` is a button that resets the filter value.
It renders the `baseIconButton` slot.

### Quick Filter Trigger

`<QuickFilterTrigger />` is a button that expands and collapses the quick filter.
It renders the `baseButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details, and [Toolbar—Custom elements demo](/x/react-data-grid/components/toolbar/#custom-elements) for an example of a custom Quick Filter.

## Recipes

Below are some ways the Quick Filter component can be used.

### Default expanded state

The quick filter is uncontrolled by default and can be toggled via the trigger. The `defaultExpanded` prop can be used to set the default expanded state.

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

type OwnerState = {
  expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
  display: 'grid',
  alignItems: 'center',
  marginLeft: 'auto',
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
  }),
);

const StyledTextField = styled(TextField)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  overflowX: 'clip',
  width: ownerState.expanded ? 260 : 'var(--trigger-width)',
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(['width', 'opacity']),
}));

function CustomToolbar() {
  return (
    <Toolbar>
      <StyledQuickFilter defaultExpanded>
        <QuickFilterTrigger
          render={(triggerProps, state) => (
            <Tooltip title="Search" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded: state.expanded }}
                color="default"
                aria-disabled={state.expanded}
              >
                <SearchIcon fontSize="small" />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded: state.expanded }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}

export default function GridUncontrolledQuickFilter() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}

```

### Expand quick filter via keyboard

The demo below shows how to control the quick filter state using the `expanded` and `onExpandedChange` props to support expanding the quick filter via keyboard. You can try it by clicking on any cell to ensure the data grid has focus, and then pressing <kbd class="key">Cmd</kbd> (or <kbd class="key">Ctrl</kbd> on Windows)+<kbd class="key">P</kbd>.

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

type OwnerState = {
  expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
  display: 'grid',
  alignItems: 'center',
  marginLeft: 'auto',
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
  }),
);

const StyledTextField = styled(TextField)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  overflowX: 'clip',
  width: ownerState.expanded ? 260 : 'var(--trigger-width)',
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(['width', 'opacity']),
}));

function CustomToolbar() {
  const [expanded, setExpanded] = React.useState(false);
  const apiRef = useGridApiContext();

  React.useEffect(() => {
    const rootElement = apiRef.current.rootElementRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        setExpanded(true);
      }
    };

    rootElement?.addEventListener('keydown', handleKeyDown);
    return () => rootElement?.removeEventListener('keydown', handleKeyDown);
  }, [apiRef]);

  return (
    <Toolbar>
      <StyledQuickFilter expanded={expanded} onExpandedChange={setExpanded}>
        <QuickFilterTrigger
          render={(triggerProps) => (
            <Tooltip title="Search" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded }}
                color="default"
                disabled={expanded}
              >
                <SearchIcon fontSize="small" />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}

export default function GridControlledQuickFilter() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}

```

### Persistent quick filter

The demo below shows how to display a persistent quick filter by passing the `expanded` prop to the `<QuickFilter />` component.

```tsx
import * as React from 'react';
import {
  DataGrid,
  Toolbar,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

const StyledQuickFilter = styled(QuickFilter)({
  marginLeft: 'auto',
});

function CustomToolbar() {
  return (
    <Toolbar>
      <StyledQuickFilter expanded>
        <QuickFilterControl
          render={({ ref, ...other }) => (
            <TextField
              {...other}
              sx={{ width: 260 }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: other.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...other.slotProps?.input,
                },
                ...other.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}

export default function GridPersistentQuickFilter() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}

```

## Accessibility

### ARIA

- You must render a `<label />` with a `for` attribute set to the `id` of `<QuickFilterControl />`, or apply an `aria-label` attribute to the `<QuickFilterControl />`.
- You must apply a text label or an `aria-label` attribute to the `<QuickFilterClear />` and `<QuickFilterTrigger />`.

### Keyboard

|                          Keys | Description                                                        |
| ----------------------------: | :----------------------------------------------------------------- |
| <kbd class="key">Escape</kbd> | Clears quick filter value. If already empty, collapses the filter. |


# QuickFilter API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Data Grid - Quick Filter component](/x/react-data-grid/components/quick-filter)

## Import

```jsx
import { QuickFilter } from '@mui/x-data-grid/components';
// or
import { QuickFilter } from '@mui/x-data-grid';
// or
import { QuickFilter } from '@mui/x-data-grid-pro';
// or
import { QuickFilter } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| debounceMs | `number` | `150` | No |  |
| defaultExpanded | `bool` | `false` | No |  |
| expanded | `bool` | - | No |  |
| formatter | `function(values: Array<any>) => string` | `(values: string[]) => values.join(' ')` | No |  |
| onExpandedChange | `function(expanded: boolean) => void` | - | No |  |
| parser | `function(input: string) => Array<any>` | `(searchText: string) => searchText.split(' ').filter((word) => word !== '')` | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/quickFilter/QuickFilter.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/quickFilter/QuickFilter.tsx)

# QuickFilterClear API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Data Grid - Quick Filter component](/x/react-data-grid/components/quick-filter)

## Import

```jsx
import { QuickFilterClear } from '@mui/x-data-grid/components';
// or
import { QuickFilterClear } from '@mui/x-data-grid';
// or
import { QuickFilterClear } from '@mui/x-data-grid-pro';
// or
import { QuickFilterClear } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/quickFilter/QuickFilterClear.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/quickFilter/QuickFilterClear.tsx)

# QuickFilterControl API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Data Grid - Quick Filter component](/x/react-data-grid/components/quick-filter)

## Import

```jsx
import { QuickFilterControl } from '@mui/x-data-grid/components';
// or
import { QuickFilterControl } from '@mui/x-data-grid';
// or
import { QuickFilterControl } from '@mui/x-data-grid-pro';
// or
import { QuickFilterControl } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/quickFilter/QuickFilterControl.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/quickFilter/QuickFilterControl.tsx)

# QuickFilterTrigger API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Data Grid - Quick Filter component](/x/react-data-grid/components/quick-filter)

## Import

```jsx
import { QuickFilterTrigger } from '@mui/x-data-grid/components';
// or
import { QuickFilterTrigger } from '@mui/x-data-grid';
// or
import { QuickFilterTrigger } from '@mui/x-data-grid-pro';
// or
import { QuickFilterTrigger } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/quickFilter/QuickFilterTrigger.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/quickFilter/QuickFilterTrigger.tsx)