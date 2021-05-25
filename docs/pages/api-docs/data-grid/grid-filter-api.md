# GridFilterApi Interface

<p class="description">The filter API interface that is available in the grid apiRef.</p>

## Import

```js
import { GridFilterApi } from '@material-ui/x-grid';
// or
import { GridFilterApi } from '@material-ui/data-grid';
```

## Properties

| Name                                                   | Type                                                                                              | Description                                                                                       |
| :----------------------------------------------------- | :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------ |
| <span class="prop-name">applyFilter</span>             | <span class="prop-type">(item: GridFilterItem, linkOperator?: GridLinkOperator) =&gt; void</span> | Applies a GridFilterItem on alls rows. If no `linkOperator` is given, the "AND" operator is used. |
| <span class="prop-name">applyFilterLinkOperator</span> | <span class="prop-type">(operator: GridLinkOperator) =&gt; void</span>                            | Changes the GridLinkOperator used to connect the filters.                                         |
| <span class="prop-name">applyFilters</span>            | <span class="prop-type">() =&gt; void</span>                                                      | Applies all filters on all rows.                                                                  |
| <span class="prop-name">deleteFilter</span>            | <span class="prop-type">(item: GridFilterItem) =&gt; void</span>                                  | Deletes a GridFilterItem.                                                                         |
| <span class="prop-name">getVisibleRowModels</span>     | <span class="prop-type">() =&gt; Map&lt;GridRowId, GridRowData&gt;</span>                         | Returns a sorted `Map` containing only the visible rows.                                          |
| <span class="prop-name">hideFilterPanel</span>         | <span class="prop-type">() =&gt; void</span>                                                      | Hides the filter panel.                                                                           |
| <span class="prop-name">setFilterModel</span>          | <span class="prop-type">(model: GridFilterModelState) =&gt; void</span>                           | Sets the filter model.                                                                            |
| <span class="prop-name">showFilterPanel</span>         | <span class="prop-type">(targetColumnField?: string) =&gt; void</span>                            | Shows the filter panel. If `targetColumnField` is given, a filter for this field is also added.   |
| <span class="prop-name">upsertFilter</span>            | <span class="prop-type">(item: GridFilterItem) =&gt; void</span>                                  | Updates or inserts a GridFilterItem.                                                              |
