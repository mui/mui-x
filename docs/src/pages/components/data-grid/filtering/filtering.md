---
title: Data Grid - Filtering
components: DataGrid, XGrid
---

# Data Grid - Filtering

<p class="description">Filtering helps view particular or related records in the Data Grid.</p>

## Basic filtering

Column filters can be set using the column menu and clicking the filter menu item.
Alternatively, if the grid has the toolbar displayed, just need to click on the filter button.

A filtered column can be can pre-configured using the filterModel prop:

```ts
const filterModel: FilterModel = {
  items: [{ columnField: 'commodity', operatorValue: 'contains', value: 'rice' }],
};
```

{{"demo": "pages/components/data-grid/filtering/BasicFilteringGrid.js", "bg": "inline"}}

### With the toolbar

{{"demo": "pages/components/data-grid/filtering/BasicToolbarFilteringGrid.js", "bg": "inline"}}

### Disable filter

#### Globally

Filters are enabled by default, but you can easily disable this feature by setting the `disableColumnFilter` prop.

```jsx
<DataGrid disableColumnFilter />
```

#### Per column

You can disable the filter on a column by setting the `filterable` prop of the `ColDef` to `false`;

```js
const columns = [{ field: 'image', filterable: false }];
```

{{"demo": "pages/components/data-grid/filtering/DisableFilteringGrid.js", "bg": "inline"}}

### Custom filter operator

The data grid supports different operators for the native column types.
However, you can extend the operator and add your own, customize the input component or set your own operator for a new column type.

In this demo, you will see how to reuse the numeric filter and customize the input filter value component.

{{"demo": "pages/components/data-grid/filtering/CustomRatingFilterOperator.js", "bg": "inline"}}

Demo filter with new column type

Demo filter with new operator

### Server-side filter

### Controlled filtering

### Multi-filtering ⚡️

XGrid allows filtering by multiple columns.
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

https://master--material-ui-x.netlify.app/components/data-grid/rows/#apiref

## Quick filter
