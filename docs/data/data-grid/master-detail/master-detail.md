---
title: Data Grid - Master detail
---

# Data Grid - Master detail [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

<p class="description">Expand your rows to display additional information.</p>

The master detail feature allows expanding a row to display additional information inside a panel.
To use this feature, pass a function to the `getDetailPanelContent` prop with the content to be rendered inside the panel.
Any valid React element can be used as the row detail, even another grid.

The height of the detail panel content needs to be provided upfront.
The grid assumes the value of 500px by default however this can be configured by passing a function to the `getDetailPanelHeight` prop that returns the required height.
Both props are called with a [`GridRowParams`](/x/api/data-grid/grid-row-params/) object, allowing you to return a different value for each row.

```tsx
<DataGridPro
  getDetailPanelContent={({ row }) => <div>Row ID: {row.id}</div>}
  getDetailPanelHeight={({ row }) => 100} // Optional, default is 500px.
/>
```

To expand a row, click on the `+` icon or press <kbd class="key">Space</kbd> inside the detail toggle column.
Returning `null` or `undefined` as the value of `getDetailPanelContent` will prevent the respective row from being expanded.

{{"demo": "BasicDetailPanels.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠ Always memoize the function provided to `getDetailPanelContent` and `getDetailPanelHeight`.
> The grid depends on the referential value of these props to cache their values and optimize the rendering.
>
> ```tsx
> const getDetailPanelContent = React.useCallback(() => { ... }, []);
>
> <DataGridPro getDetailPanelContent={getDetailPanelContent} />
> ```
>
> ⚠ Depending on the height of the detail panel, you may see a blank space when scrolling.
> This is caused by the grid using a lazy approach to update the rendered rows.
> Set `rowThreshold` to 0 to force new rows to be rendered more often to fill the blank space.
> Note that this may reduce the performance.
>
> ```tsx
> <DataGridPro rowThreshold={0} />
> ```

## Controlling expanded detail panels

To control which rows are expanded, pass a list of row IDs to the `detailPanelExpandedRowIds` prop.
Passing a callback to the `onDetailPanelExpandedRowIds` prop can be used to detect when a row gets expanded or collapsed.

On the other hand, if you only want to initialize the grid with some rows already expanded, use the `initialState` prop as follows:

```tsx
<DataGridPro initialState={{ detailPanel: { expandedRowIds: [1, 2, 3] } }}>
```

{{"demo": "ControlMasterDetail.js", "bg": "inline", "defaultCodeOpen": false}}

## Using a detail panel as a form

As an alternative to the built-in [row editing](/x/react-data-grid/editing/#row-editing), a form component can be rendered inside the detail panel, allowing the user to edit the current row values.

The following demo shows integration with [react-hook-form](https://react-hook-form.com/), but other form libraries are also supported.

{{"demo": "FormDetailPanel.js", "bg": "inline", "defaultCodeOpen": false}}

## Customizing the detail panel toggle

To change the icon used for the toggle, you can provide a different component for the [icon slot](/x/react-data-grid/components/#icons) as follow:

```tsx
<DataGridPro
  components={{
    DetailPanelExpandIcon: CustomExpandIcon,
    DetailPanelCollapseIcon: CustomCollapseIcon,
  }}
/>
```

If this is not sufficient, the entire toggle component can be overridden.
To fully customize it, add another column with `field: GRID_DETAIL_PANEL_TOGGLE_FIELD` to your set of columns.
The grid will detect that there is already a toggle column defined and it will not add another toggle in the default position.
The new toggle component can be provided via [`renderCell`](/x/react-data-grid/cells/#render-cell) in the same as any other column.
By only setting the `field`, is up to you to configure the remaining options (e.g. disable the column menu, filtering, sorting).
To already start with a few suggested options configured, spread `GRID_DETAIL_PANEL_TOGGLE_COL_DEF` when defining the column.

```tsx
<DataGridPro
  columns={[
    {
      field: GRID_DETAIL_PANEL_TOGGLE_FIELD,
      renderCell: (params) => <CustomDetailPanelToggle {...params}>
    },
  ]}
/>

// or

<DataGridPro
  columns={[
    {
      ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF, // Already contains the right field
      renderCell: (params) => <CustomDetailPanelToggle {...params}>
    },
  ]}
/>
```

This approach can also be used to change the location of the toggle column, as shown below.

{{"demo": "CustomizeDetailPanelToggle.js", "bg": "inline", "defaultCodeOpen": false}}

> **Note**: As any ordinary cell renderer, the `value` prop is also available and it corresponds to the state of the row: `true` when expanded and `false` when collapsed.

## Disable detail panel content scroll

By default, the detail panel has a width that is the sum of the widths of all columns.
This means that when a horizontal scrollbar is present, scrolling it will also scroll the panel content.
To avoid this behavior, set the size of the detail panel to the outer size of the grid.
Use `apiRef.current.getRootDimensions()` to get the latest dimension values.
Finally, to prevent the panel from scrolling, set `position: sticky` and `left: 0`.

The following demo shows how this can be achieved.
Notice that the toggle column is pinned to make sure that it will always be visible when the grid is scrolled horizontally.

{{"demo": "FullWidthDetailPanel.js", "bg": "inline", "defaultCodeOpen": false}}

## apiRef

{{"demo": "DetailPanelApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
