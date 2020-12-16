---
title: Data Grid - Filtering
components: DataGrid, XGrid
---

# Data Grid - Filtering

<p class="description">Filtering helps view particular or related records in the Data Grid.</p>

## Basic Filtering

Column filters can be set using the column menu and clicking the filter menu item.
Alternatively, if the grid has the toolbar displayed, just need to click on the filter button.

A filtered column can be can pre-configured using the filterModel prop:

```ts
const filterModel: FilterModel = {
  items: [{ columnField: 'commodity', operatorValue: 'contains', value: 'rice' }],
};
```

{{"demo": "pages/components/data-grid/filtering/BasicFilteringGrid.js", "bg": "inline"}}

### Disable filter

#### Globally

Filters are enabled by default, but you can easily disable this feature by setting the `disableColumnFilter` prop.

```ts
<DataGrid disableColumnFilter />
```

#### Per column

You can disable the filter on a column by setting the `filterable` prop of the `ColDef` to `false`;

```ts
const columns = [{ field: 'image', filterable: false }];
```

{{"demo": "pages/components/data-grid/filtering/DisableFilteringGrid.js", "bg": "inline"}}

### Custom filter operator

We currently support different operators for the native column types.
However, you can extend the operator and add your own, customize the input component or set your own operator for a new column type.

In this demo, you will see how to reuse the numeric filter and customize the input filter value component.

{{"demo": "pages/components/data-grid/filtering/CustomRatingFilterOperator.js", "bg": "inline"}}
