# GridSortApi Interface

<p class="description">The sort API interface that is available in the grid apiRef.</p>

## Import

```js
import { GridSortApi } from '@mui/x-data-grid-pro';
// or
import { GridSortApi } from '@mui/x-data-grid';
```

## Properties

| Name                                                | Type                                                                                                                          | Description                                                                                                       |
| :-------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">applySorting</span>         | <span class="prop-type">() =&gt; void</span>                                                                                  | Applies the current sort model to the rows.                                                                       |
| <span class="prop-name">getRowIdFromRowIndex</span> | <span class="prop-type">(index: number) =&gt; GridRowId</span>                                                                | Gets the `GridRowId` of a row at a specific index.<br />The index is based on the sorted but unfiltered row list. |
| <span class="prop-name">getRowIndex</span>          | <span class="prop-type">(id: GridRowId) =&gt; number</span>                                                                   | Gets the row index of a row with a given id.<br />The index is based on the sorted but unfiltered row list.       |
| <span class="prop-name">getSortedRowIds</span>      | <span class="prop-type">() =&gt; GridRowId[]</span>                                                                           | Returns all row ids sorted according to the active sort model.                                                    |
| <span class="prop-name">getSortedRows</span>        | <span class="prop-type">() =&gt; GridRowModel[]</span>                                                                        | Returns all rows sorted according to the active sort model.                                                       |
| <span class="prop-name">getSortModel</span>         | <span class="prop-type">() =&gt; GridSortModel</span>                                                                         | Returns the sort model currently applied to the grid.                                                             |
| <span class="prop-name">setSortModel</span>         | <span class="prop-type">(model: GridSortModel) =&gt; void</span>                                                              | Updates the sort model and triggers the sorting of rows.                                                          |
| <span class="prop-name">sortColumn</span>           | <span class="prop-type">(column: GridColDef, direction?: GridSortDirection, allowMultipleSorting?: boolean) =&gt; void</span> | Sorts a column.                                                                                                   |
