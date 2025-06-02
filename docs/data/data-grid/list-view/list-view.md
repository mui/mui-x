---
title: Data Grid - List view
---

# Data Grid - List view [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Display data in a single-column list view for a more compact Data Grid on smaller screens and mobile devices.</p>

A typical data grid built for desktop devices can be difficult to use on a mobile device.
The Data Grid Pro provides a single-column list view format to give users a better experience on smaller screens.

## Implementing list view

To enable list view, pass the `listView` prop to the Data Grid.

Unlike the default grid view which displays all columns, the list view requires you to explicitly define which columns to display by passing the `listViewColumn` prop with a `renderCell` function:

```tsx
function ListViewCell(params: GridRenderCellParams) {
  return <>{params.row.id}</>;
}

const listViewColDef: GridListViewColDef = {
  field: 'listColumn',
  renderCell: ListViewCell,
};

<DataGridPro listViewColumn={listViewColDef} listView={true} />;
```

{{"demo": "ListView.js", "bg": true}}

## Responsive list view with media query

Use the `useMediaQuery` hook from `@mui/material` to enable the list view feature at a specified breakpoint.
The demo below automatically switches to a list layout when the viewport width is below the `md` breakpoint.

{{"demo": "ListViewMediaQuery.js", "bg": "inline"}}

## List view with editable rows

The [editing feature](/x/react-data-grid/editing/) is not supported while in list view, but it is possible to build an editing experience from within a custom cell renderer, as shown below:

{{"demo": "ListViewEdit.js", "bg": true}}

## Optimizing list view for small screens

If your use case calls for first-class mobile UX, you can fully customize the Data Grid's list layout using [custom subcomponents](/x/react-data-grid/components/) as shown in the demo below:

{{"demo": "ListViewAdvanced.js", "iframe": true, "maxWidth": 400, "height": 600}}

## List view feature compatibility

List view can be used in combination with the following features:

- ✅ [Sorting](/x/react-data-grid/sorting/)
- ✅ [Filtering](/x/react-data-grid/filtering/)
- ✅ [Pagination](/x/react-data-grid/pagination/)
- ✅ [Row selection](/x/react-data-grid/row-selection/)
- ✅ [Multi-filters](/x/react-data-grid/filtering/multi-filters/) [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')
- ✅ [Row pinning](/x/react-data-grid/row-pinning/) [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')
- ✅ [Cell selection](/x/react-data-grid/cell-selection/) [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

:::warning
Features not listed here may not work as expected (or at all).
If you're using a feature that's listed above and it's not working as expected, please [open a bug report](https://github.com/mui/mui-x/issues/new?assignees=&labels=status%3A+waiting+for+maintainer%2Cbug+%F0%9F%90%9B&projects=&template=1.bug.yml).
If you need to use list view with any other features not listed, please [open a feature request](https://github.com/mui/mui-x/issues/new?assignees=&labels=status%3A+waiting+for+maintainer%2Cnew+feature&projects=&template=2.feature.yml).
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridListViewColDef](/x/api/data-grid/grid-list-view-col-def/)
