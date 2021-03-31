---
title: Data Grid - Filtering
components: DataGrid, XGrid
---

# Data Grid - Filtering

<p class="description">Filtering helps view particular or related records in the data grid.</p>

## Column filters

### Basic filter

Column filters can be set using the column menu and clicking the filter menu item.
Alternatively, if the grid has the toolbar displayed, just need to click on the filter button.

A filtered column can be can pre-configured using the `filterModel` prop:

{{"demo": "pages/components/data-grid/filtering/BasicFilteringGrid.js", "bg": "inline"}}

### Toolbar

In addition to the column menu that allows users to apply a filter, you can also show a toolbar:

{{"demo": "pages/components/data-grid/filtering/BasicToolbarFilteringGrid.js", "bg": "inline"}}

### Column types

The type of the column is used for adapting the filtering. You can find the different supported types in the [columns section](/components/data-grid/columns/#column-types).

{{"demo": "pages/components/data-grid/filtering/FilterOperators.js", "bg": "inline", "defaultCodeOpen": false}}

### Disable filter

#### Globally

Filters are enabled by default, but you can easily disable this feature by setting the `disableColumnFilter` prop.

```jsx
<DataGrid disableColumnFilter />
```

#### Per column

You can disable the filter on a column by setting the `filterable` property of the `GridColDef` to `false`;

```js
const columns = [{ field: 'image', filterable: false }];
```

{{"demo": "pages/components/data-grid/filtering/DisableFilteringGrid.js", "bg": "inline"}}

### Custom filter operator

The data grid supports different operators for the native column types.
However, you can extend the operator and add your own, customize the input component or set your own operator for a new column type.

1. **Custom input**.

In this demo you will see how to reuse the numeric filter and customize the input filter value component.

The rating column reuses the numeric operator, but the input value is a new rating component.

{{"demo": "pages/components/data-grid/filtering/ExtendNumericOperator.js", "bg": "inline"}}

2. **Custom column type**.

In this demo you will see how to extend an existing column type, adding your own filter operators with filter input value props.

As you can see in the filter panel, the `totalPrice` column only contains 2 operators `<`, & `>`, and the input field is prefixed with `$`.

{{"demo": "pages/components/data-grid/filtering/ColumnTypeFilteringGrid.js", "bg": "inline"}}

3. **Custom operator**.

In this demo you will see how to create a complete new operator for a specific column.

The rating column contains a new `From` operator, as you can see in the filter panel.

{{"demo": "pages/components/data-grid/filtering/CustomRatingOperator.js", "bg": "inline"}}

### Server-side filter

Filtering can be run server-side by setting the `filterMode` prop to `server`, and implementing the `onFilterModelChange` handler.

```tsx
<DataGrid
  rows={rows}
  columns={columns}
  filterMode="server"
  onFilterModelChange={handleFilterModelChange}
  loading={loading}
/>
```

Below is very simple demo on how you could achieve server side filtering.

{{"demo": "pages/components/data-grid/filtering/ServerFilterGrid.js", "bg": "inline"}}

### Controlled filtering

WIP

### Multi-column filtering <span class="pro"></span>

`XGrid` supports filtering by multiple columns.
The default operator that will be applied between filters is an And.

{{"demo": "pages/components/data-grid/filtering/MultiFilteringGrid.js", "bg": "inline"}}

To change the default operator, you should set the 'linkOperator' property of the filterModel like below.

```ts
const filterModel: GridFilterModel = {
  items: [
    { columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
    { columnField: 'commodity', operatorValue: 'startsWith', value: 'Soy' },
  ],
  linkOperator: GridLinkOperator.Or,
};
```

{{"demo": "pages/components/data-grid/filtering/MultiFilteringWithOrGrid.js", "bg": "inline", "disableAd": true}}

### apiRef <span class="pro"></span>

<!-- https://master--material-ui-x.netlify.app/components/data-grid/rows/#apiref -->

## 🚧 Quick filter

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #202](https://github.com/mui-org/material-ui-x/issues/202) if you want to see it land faster.

In addition to the column specific filtering, a global quick filtering will also be available.
The provided search text will match against all the cells.
