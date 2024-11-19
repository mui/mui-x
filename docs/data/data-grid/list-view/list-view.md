---
title: Data Grid - List view
---

# Data Grid - List view [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Display data in a single-column list view. Can be used to present a more compact grid on smaller screens and mobile devices.</p>

:::warning
This feature is under development and is marked as **unstable**. While you can use the list view feature in production, the API could change in the future.
:::

## Basic usage

List view can be enabled by providing the `unstable_listView` prop.

Unlike the default grid view, the list view makes no assumptions on how data is presented to end users.

In order to display data in a list view, a `unstable_listColumn` prop must be provided with a `renderCell` function.

```tsx
function ListViewCell(params: GridRenderCellParams) {
  return <>{params.row.id}</>;
}

const listColDef: GridListColDef = {
  field: 'listColumn',
  renderCell: ListViewCell,
};
```

{{"demo": "ListView.js", "bg": true}}

## Field visibility

Similar to the default grid view, field visibilty can be toggled in list view.

In the list view column’s `renderCell` function, data can be conditionally rendered based on [column visibility](/x/react-data-grid/column-visibility/).

```tsx
import {
  useGridSelector,
  useGridApiContext,
  gridColumnVisibilityModelSelector,
} from '@mui/x-data-grid';

function ListViewCell(params: GridRenderCellParams) {
  const apiRef = useGridApiContext();
  const columnVisibilityModel = useGridSelector(
    apiRef,
    gridColumnVisibilityModelSelector,
  );
  const showCreatedAt = columnVisibilityModel.createdBy !== false;

  return (
    <>
      <span>{params.row.id}</span>
      {showCreatedAt && (
        <time datetime={params.row.createdAt}>
          {formatDate(params.row.createdAt)}
        </time>
      )}
    </>
  );
}
```

## Enable with a media query

The `useMediaQuery` hook from `@mui/material` can be used to enable the list view feature at a specified breakpoint.

```tsx
import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

function App() {
  const theme = useTheme();
  const isListView = useMediaQuery(theme.breakpoints.down('md'));

  return <DataGrid unstable_listView={isListView} />;
}
```

## Advanced usage

The list view feature can be combined with [custom subcomponents](/x/react-data-grid/components/) to provide an improved user experience on small screens.

{{"demo": "ListViewAdvanced.js", "iframe": true, "maxWidth": 360, "height": 600}}

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "List View"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
