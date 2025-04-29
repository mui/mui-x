---
title: Data Grid - List view
---

# Data Grid - List view [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Display data in a single-column list view. Can be used to present a more compact grid on smaller screens and mobile devices.</p>

List view can be enabled by providing the `listView` prop.

Unlike the default grid view, the list view makes no assumptions on how data is presented to end users.

In order to display data in a list view, a `listViewColumn` prop must be provided with a `renderCell` function.

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

## Enable with a media query

Use the `useMediaQuery` hook from `@mui/material` to enable the list view feature at a specified breakpoint.

The demo below automatically switches to a list layout when the viewport width is below the `md` breakpoint.

{{"demo": "ListViewMediaQuery.js", "bg": "inline"}}

## Editable rows

The [editing feature](/x/react-data-grid/editing/) is not supported in list view, but it is possible to build an editing experience from within your custom cell renderer, as shown below.

{{"demo": "ListViewEdit.js", "bg": true}}

## Advanced usage

The list view feature can be combined with [custom subcomponents](/x/react-data-grid/components/) to provide an improved user experience on small screens, as shown below.

{{"demo": "ListViewAdvanced.js", "iframe": true, "maxWidth": 400, "height": 600}}

## Feature compatibility

The list view feature can be used in combination with the following features:

- ✅ [Sorting](/x/react-data-grid/sorting/)
- ✅ [Filtering](/x/react-data-grid/filtering/)
- ✅ [Pagination](/x/react-data-grid/pagination/)
- ✅ [Row selection](/x/react-data-grid/row-selection/)
- ✅ [Multi filters](/x/react-data-grid/filtering/multi-filters/) [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')
- ✅ [Row pinning](/x/react-data-grid/row-pinning/) [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')
- ✅ [Cell selection](/x/react-data-grid/cell-selection/) [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

:::warning
Features not listed may not work as expected, or may not work at all.

If you're using a feature that's listed above and it's not working as expected, please [open a bug report](https://github.com/mui/mui-x/issues/new?assignees=&labels=status%3A+waiting+for+maintainer%2Cbug+%F0%9F%90%9B&projects=&template=1.bug.yml).

If you need to use list view with any other features, please [open a feature request](https://github.com/mui/mui-x/issues/new?assignees=&labels=status%3A+waiting+for+maintainer%2Cnew+feature&projects=&template=2.feature.yml).
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridListViewColDef](/x/api/data-grid/grid-list-view-col-def/)
