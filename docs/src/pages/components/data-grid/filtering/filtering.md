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

### Disable filter

#### Globally

Filters are enabled by default, but you can easily disable this feature by setting the `disableColumnFilter` prop.

```jsx
<DataGrid disableColumnFilter />
```

#### Per column

You can disable the filter on a column by setting the `filterable` property of the `ColDef` to `false`;

```js
const columns = [{ field: 'image', filterable: false }];
```

{{"demo": "pages/components/data-grid/filtering/DisableFilteringGrid.js", "bg": "inline"}}

### Custom filter operator

The data grid supports different operators for the native column types.
However, you can extend the operator and add your own, customize the input component or set your own operator for a new column type.

1. **Custom input**. In this demo, you will see how to reuse the numeric filter and customize the input filter value component.

{{"demo": "pages/components/data-grid/filtering/CustomRatingFilterOperator.js", "bg": "inline"}}

2. **Custom column type**. WIP
3. **Custom operator**. WIP

### Server-side filter

WIP

### Controlled filtering

WIP

### Multi-column filtering ⚡️

`XGrid` supports filtering by multiple columns.
The default operator that will be applied between filters is an And.

{{"demo": "pages/components/data-grid/filtering/MultiFilteringGrid.js", "bg": "inline"}}

To change the default operator, you should set the 'linkOperator' property of the filterModel like below.

```ts
const filterModel: FilterModel = {
  items: [
    { columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
    { columnField: 'commodity', operatorValue: 'startsWith', value: 'Soy' },
  ],
  linkOperator: LinkOperator.Or,
};
```

{{"demo": "pages/components/data-grid/filtering/MultiFilteringWithOrGrid.js", "bg": "inline"}}

### apiRef ⚡️

<!-- https://master--material-ui-x.netlify.app/components/data-grid/rows/#apiref -->

## 🚧 Quick filter

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #202](https://github.com/mui-org/material-ui-x/issues/202) if you want to see it land faster.

In addition to the column specific filtering, a global quick filtering will also be available.
The provided search text will match against all the cells.
