# GridFilterApi Interface

<p class="description">The filter API interface that is available in the grid apiRef.</p>

## Import

```js
import { GridFilterApi } from '@mui/x-data-grid-pro';
// or
import { GridFilterApi } from '@mui/x-data-grid';
```

## Properties

| Name                                                 | Type                                                                       | Description                                                                                     |
| :--------------------------------------------------- | :------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| <span class="prop-name">deleteFilterItem</span>      | <span class="prop-type">(item: GridFilterItem) =&gt; void</span>           | Deletes a [GridFilterItem](/api/data-grid/grid-filter-item/).                                   |
| <span class="prop-name">getVisibleRowModels</span>   | <span class="prop-type">() =&gt; Map&lt;GridRowId, GridRowModel&gt;</span> | Returns a sorted `Map` containing only the visible rows.                                        |
| <span class="prop-name">hideFilterPanel</span>       | <span class="prop-type">() =&gt; void</span>                               | Hides the filter panel.                                                                         |
| <span class="prop-name">setFilterLinkOperator</span> | <span class="prop-type">(operator: GridLinkOperator) =&gt; void</span>     | Changes the GridLinkOperator used to connect the filters.                                       |
| <span class="prop-name">setFilterModel</span>        | <span class="prop-type">(model: GridFilterModel) =&gt; void</span>         | Sets the filter model to the one given by `model`.                                              |
| <span class="prop-name">showFilterPanel</span>       | <span class="prop-type">(targetColumnField?: string) =&gt; void</span>     | Shows the filter panel. If `targetColumnField` is given, a filter for this field is also added. |
| <span class="prop-name">upsertFilterItem</span>      | <span class="prop-type">(item: GridFilterItem) =&gt; void</span>           | Updates or inserts a [GridFilterItem](/api/data-grid/grid-filter-item/).                        |
