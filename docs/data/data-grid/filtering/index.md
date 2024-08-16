# Data Grid - Filtering

<p class="description">Easily filter your rows based on one or several criteria.</p>

The filters can be modified through the data grid interface in several ways:

- By opening the column menu and clicking the _Filter_ menu item.
- By clicking the _Filters_ button in the data grid toolbar (if enabled).

Each column type has its own filter operators.
The demo below lets you explore all the operators for each built-in column type.

_See [the dedicated section](/x/react-data-grid/filtering/customization/) to learn how to create your own custom filter operator._

{{"demo": "BasicExampleDataGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Single and multi-filters

:::warning
The Data Grid can only filter the rows according to one criterion at the time.

To use [multi-filters](/x/react-data-grid/filtering/multi-filters/), you need to upgrade to the [Pro plan](/x/introduction/licensing/#pro-plan) or above.
:::

## Pass filters to the Data Grid

### Structure of the model

The full typing details can be found on the [GridFilterModel API page](/x/api/data-grid/grid-filter-model/).

The filter model is composed of a list of `items` and a `logicOperator`:

#### The `items`

A filter item represents a filtering rule and is composed of several elements:

- `filterItem.field`: the field on which the rule applies.
- `filterItem.value`: the value to look for.
- `filterItem.operator`: name of the operator method to use (for example _contains_), matches the `value` key of the operator object.
- `filterItem.id` ([<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')): required when multiple filter items are used.

:::info
Some operators do not need any value (for instance the `isEmpty` operator of the `string` column).
:::

#### The `logicOperator` [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

The `logicOperator` tells the data grid if a row should satisfy all (`AND`) filter items or at least one (`OR`) in order to be considered valid.

```ts
// Example 1: get rows with rating > 4 OR isAdmin = true
const filterModel: GridFilterModel = {
  items: [
    { id: 1, field: 'rating', operator: '>', value: '4' },
    { id: 2, field: 'isAdmin', operator: 'is', value: 'true' },
  ],
  logicOperator: GridLogicOperator.Or,
};

// Example 2: get rows with rating > 4 AND isAdmin = true
const filterModel: GridFilterModel = {
  items: [
    { id: 1, field: 'rating', operator: '>', value: '4' },
    { id: 2, field: 'isAdmin', operator: 'is', value: 'true' },
  ],
  logicOperator: GridLogicOperator.And,
};
```

If no `logicOperator` is provided, the data grid will use `GridLogicOperator.Or` by default.

### Initialize the filters

To initialize the filters without controlling them, provide the model to the `initialState` prop.

```jsx
<DataGrid
  initialState={{
    filter: {
      filterModel: {
        items: [{ field: 'rating', operator: '>', value: '2.5' }],
      },
    },
  }}
/>
```

{{"demo": "InitialFilters.js", "bg": "inline", "defaultCodeOpen": false}}

### Controlled filters

Use the `filterModel` prop to control the filter applied on the rows.

You can use the `onFilterModelChange` prop to listen to changes to the filters and update the prop accordingly.

```jsx
<DataGrid
  filterModel={{
    items: [{ field: 'rating', operator: '>', value: '2.5' }],
  }}
/>
```

{{"demo": "ControlledFilters.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable the filters

### For all columns

Filters are enabled by default, but you can easily disable this feature by setting the `disableColumnFilter` prop.

```jsx
<DataGrid disableColumnFilter />
```

{{"demo": "DisableFilteringGridAllColumns.js", "bg": "inline", "defaultCodeOpen": false}}

### For some columns

To disable the filter of a single column, set the `filterable` property in `GridColDef` to `false`.

In the example below, the _rating_ column cannot be filtered.

```js
<DataGrid columns={[...columns, { field: 'rating', filterable: false }]} />
```

{{"demo": "DisableFilteringGridSomeColumns.js", "bg": "inline", "defaultCodeOpen": false}}

### Filter non-filterable columns programmatically

You can initialize the `filterModel`, set the `filterModel` prop, or use the API method `apiRef.current.setFilterModel` to set the filters for non-filterable columns. These filters will be applied but will be read-only on the UI and the user won't be able to change them.

```jsx
const columns = [
  { field: 'name', filterable: false },
  ...otherColumns,
]

<DataGrid
  filterModel={{
    items: [{ field: 'name', operator: 'contains', value: 'a' }],
  }}
  columns={columns}
/>
```

{{"demo": "ReadOnlyFilters.js", "bg": "inline", "defaultCodeOpen": false}}

## Ignore diacritics (accents)

You can ignore diacritics (accents) when filtering the rows. See [Quick filter - Ignore diacritics (accents)](/x/react-data-grid/filtering/quick-filter/#ignore-diacritics-accents).

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

:::warning
Only use this API as the last option. Give preference to the props to control the Data Grid.
:::

{{"demo": "FilterApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Filtering"}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state)

## API

- [GridFilterForm](/x/api/data-grid/grid-filter-form/)
- [GridFilterItem](/x/api/data-grid/grid-filter-item/)
- [GridFilterModel](/x/api/data-grid/grid-filter-model/)
- [GridFilterOperator](/x/api/data-grid/grid-filter-operator/)
- [GridFilterPanel](/x/api/data-grid/grid-filter-panel/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
