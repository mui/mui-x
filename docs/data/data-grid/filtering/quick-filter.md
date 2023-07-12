# Data Grid - Quick filter

<p class="description">One filter field to quickly filter grid.</p>

Quick filter allows filtering rows by multiple columns with a single text input.
To enable it, you can add the `<GridToolbarQuickFilter />` component to your custom toolbar or pass `showQuickFilter` to the default `<GridToolbar />`.

By default, the quick filter considers the input as a list of values separated by space and keeps only rows that contain all the values.

{{"demo": "QuickFilteringGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Initialize the quick filter values

The quick filter values can be initialized by setting the `filter.filterModel.quickFilterValues` property of the `initialState` prop.

```tsx
<DataGrid
  initialState={{
    filter: {
      filterModel: {
        items: [],
        quickFilterValues: ['quick', 'filter'],
      },
    },
  }}
/>
```

{{"demo": "QuickFilteringInitialize.js", "bg": "inline", "defaultCodeOpen": false}}

## Excluding hidden columns

By default, the quick filter searches all the columns, including those that are hidden.

To exclude the hidden columns from the quick filter, set `filterModel.quickFilterExcludeHiddenColumns` to `true`:

```tsx
<DataGrid
  initialState={{
    filter: {
      filterModel: {
        items: [],
        quickFilterExcludeHiddenColumns: true,
      },
    },
  }}
/>
```

In the demo below, try hiding the `ID` column. You will see no results, because there are no visible columns that contain `1`:

{{"demo": "QuickFilteringExcludeHiddenColumns.js", "bg": "inline", "defaultCodeOpen": false}}

## Custom filtering logic

The logic used for quick filter can be switched to filter rows that contain _at least_ one of the values specified instead of testing if it contains all of them.
To do so, set `quickFilterLogicOperator` to `GridLogicOperator.Or` as follow:

```js
initialState={{
  filter: {
    filterModel: {
      items: [],
      quickFilterLogicOperator: GridLogicOperator.Or,
    },
  },
}}
```

With the default settings, quick filter will only consider columns with types `'string'`,`'number'`, and `'singleSelect'`.

- For `'string'` and `'singleSelect'` columns, the cell's formatted value must **contain** the value
- For `'number'` columns, the cell's formatted value must **equal** the value

To modify or add the quick filter operators, add the property `getApplyQuickFilterFn` to the column definition.
This function is quite similar to `getApplyFilterFn`.
This function takes as an input a value of the quick filter and returns another function that takes the cell value as an input and returns `true` if it satisfies the operator condition.

In the example below, a custom filter is created for the `date` column to check if it contains the correct year.

```ts
getApplyQuickFilterFn: (value: string) => {
  if (!value || value.length !== 4 || !/\d{4}/.test(value)) {
    // If the value is not a 4 digit string, it can not be a year so applying this filter is useless
    return null;
  }
  return (params: GridCellParams): boolean => {
    return params.value.getFullYear() === Number(value);
  };
};
```

To remove the quick filtering on a given column set `getApplyQuickFilterFn: undefined`.

In the demo below, the column "Name" is not searchable with the quick filter, and 4 digits figures will be compared to the year of column "Created on."

{{"demo": "QuickFilteringCustomLogic.js", "bg": "inline", "defaultCodeOpen": false}}

## Parsing values

The values used by the quick filter are obtained by splitting with space.
If you want to implement a more advanced logic, the `<GridToolbarQuickFilter/>` component accepts a prop `quickFilterParser`.
This function takes the string from the search text field and returns an array of values.

If you control the `quickFilterValues` either by controlling `filterModel` or with the initial state, the content of the input must be updated to reflect the new values.
By default, values are joint with a spaces. You can customize this behavior by providing `quickFilterFormatter`.
This formatter can be seen as the inverse of the `quickFilterParser`.

For example, the following parser allows to search words containing a space by using the `','` to split values.

```jsx
<GridToolbarQuickFilter
  quickFilterParser={(searchInput) =>
    searchInput.split(',').map((value) => value.trim())
  }
  quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
  debounceMs={200} // time before applying the new quick filter value
/>
```

In the following demo, the quick filter value `"Saint Martin, Saint Lucia"` will return rows with country is Saint Martin or Saint Lucia.

{{"demo": "QuickFilteringCustomizedGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [GridToolbarQuickFilter](/x/api/data-grid/grid-toolbar-quick-filter/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
