---
title: Data Grid - Master detail
---

# Data Grid - Master detail [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Expand your rows to display additional information.</p>

The master detail feature allows expanding a row to display additional information inside a panel.
To use this feature, pass a function to the `getDetailPanelContent` prop with the content to be rendered inside the panel.
Any valid React element can be used as the row detail, even another grid.

By default, the detail panel height is 500px.
You can customize it by passing a function to the `getDetailPanelHeight` prop.
This function must return either a number or the `"auto"` string.
If it returns a number, then the panel will use that value (in pixels) for the height.
If it returns `"auto"`, then the height will be [derived](#infer-height-from-the-content) from the content.

```tsx
<DataGridPro
  getDetailPanelContent={({ row }) => <div>Row ID: {row.id}</div>}
  getDetailPanelHeight={({ row }) => 100} // Optional, default is 500px.
/>

// or

<DataGridPro
  getDetailPanelContent={({ row }) => <div>Row ID: {row.id}</div>}
  getDetailPanelHeight={({ row }) => 'auto'} // Height based on the content.
/>
```

:::info
Both props are called with a [`GridRowParams`](/x/api/data-grid/grid-row-params/) object, which lets you return a different value for each row.
:::

To expand a row, click on the **+** icon or press <kbd class="key">Space</kbd> inside the detail toggle column.
Returning `null` or `undefined` as the value of `getDetailPanelContent` will prevent the respective row from being expanded.

{{"demo": "BasicDetailPanels.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
Always memoize the function provided to `getDetailPanelContent` and `getDetailPanelHeight`.
The Data Grid depends on the referential value of these props to cache their values and optimize the rendering.

```tsx
const getDetailPanelContent = React.useCallback(() => { ... }, []);

<DataGridPro getDetailPanelContent={getDetailPanelContent} />
```

:::

## Infer height from the content

Like [dynamic row height](/x/react-data-grid/row-height/#dynamic-row-height), you can also derive the detail panel height from its content.
For this, pass a function to the `getDetailPanelHeight` prop returning `"auto"`, as below:

```tsx
<DataGridPro getDetailPanelHeight={() => 'auto'} />
```

The following example demonstrates this option in action:

{{"demo": "DetailPanelAutoHeight.js", "bg": "inline", "defaultCodeOpen": false}}

## Controlling expanded detail panels

To control which rows are expanded, pass a list of row IDs to the `detailPanelExpandedRowIds` prop.
Passing a callback to the `onDetailPanelExpandedRowIds` prop can be used to detect when a row gets expanded or collapsed.

On the other hand, if you only want to initialize the data grid with some rows already expanded, use the `initialState` prop as follows:

```tsx
<DataGridPro initialState={{ detailPanel: { expandedRowIds: [1, 2, 3] } }}>
```

{{"demo": "ControlMasterDetail.js", "bg": "inline", "defaultCodeOpen": false}}

## Lazy loading detail panel content

You don't need to provide the content for detail panels upfront.
Instead, you can load it lazily when the row is expanded.

In the following example, the `DetailPanelContent` component is fetching the data on mount.
This component is used by the `getDetailPanelContent` prop to render the detail panel content.

{{"demo": "LazyLoadingDetailPanel.js", "bg": "inline", "defaultCodeOpen": false}}

## Using a detail panel as a form

As an alternative to the built-in [row editing](/x/react-data-grid/editing/#row-editing), a form component can be rendered inside the detail panel, allowing the user to edit the current row values.

The following demo shows integration with [react-hook-form](https://react-hook-form.com/), but other form libraries are also supported.

{{"demo": "FormDetailPanel.js", "bg": "inline", "defaultCodeOpen": false}}

## Customizing the detail panel toggle

To change the icon used for the toggle, you can provide a different component for the [icon slot](/x/react-data-grid/components/#icons) as follow:

```tsx
<DataGridPro
  slots={{
    detailPanelExpandIcon: CustomExpandIcon,
    detailPanelCollapseIcon: CustomCollapseIcon,
  }}
/>
```

If this is not sufficient, the entire toggle component can be overridden.
To fully customize it, add another column with `field: GRID_DETAIL_PANEL_TOGGLE_FIELD` to your set of columns.
The grid will detect that there is already a toggle column defined and it will not add another toggle in the default position.
The new toggle component can be provided via [`renderCell`](/x/react-data-grid/column-definition/#rendering-cells) in the same as any other column.
By only setting the `field`, is up to you to configure the remaining options (for example disable the column menu, filtering, sorting).
To already start with a few suggested options configured, spread `GRID_DETAIL_PANEL_TOGGLE_COL_DEF` when defining the column.

```tsx
<DataGridPro
  columns={[
    {
      field: GRID_DETAIL_PANEL_TOGGLE_FIELD,
      renderCell: (params) => <CustomDetailPanelToggle {...params} />
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

:::info
As any ordinary cell renderer, the `value` prop is also available, and it corresponds to the state of the row: `true` when expanded and `false` when collapsed.
:::

## Custom header for detail panel column

To render a custom header for the detail panel column, use the [`renderHeader`](/x/react-data-grid/column-header/#custom-header-renderer) property in the column definition.
This property receives a `GridRenderHeaderParams` object that contains `colDef` (the column definition) and `field`.
The following example demonstrates how to render a custom header for the detail panel column:

```tsx
const columns = [
  {
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    renderHeader: (params) => (
      <div>
        <span>{params.colDef.headerName}</span>
        <button onClick={() => console.log('Custom action')}>Custom action</button>
      </div>
    ),
  },
  //... other columns
];
```

:::info
For a more advanced example check out the [Expand or collapse all detail panels](/x/react-data-grid/row-recipes/#expand-or-collapse-all-detail-panels) recipe.
:::

## Disable detail panel content scroll

By default, the detail panel has a width that is the sum of the widths of all columns.
This means that when a horizontal scrollbar is present, scrolling it will also scroll the panel content.
To avoid this behavior, set the size of the detail panel to the outer size of the data grid.
Use `apiRef.current.getRootDimensions()` to get the latest dimension values.
Finally, to prevent the panel from scrolling, set `position: sticky` and `left: 0`.

The following demo shows how this can be achieved.
Notice that the toggle column is pinned to make sure that it will always be visible when the data grid is scrolled horizontally.

{{"demo": "FullWidthDetailPanel.js", "bg": "inline", "defaultCodeOpen": false}}

## Recipes

More examples of how to customize the detail panel:

- [One expanded detail panel at a time](/x/react-data-grid/row-recipes/#one-expanded-detail-panel-at-a-time)
- [Expand or collapse all detail panels](/x/react-data-grid/row-recipes/#expand-or-collapse-all-detail-panels)

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

{{"demo": "DetailPanelApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
