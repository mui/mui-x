# GridFilterState Interface

<p class="description"></p>

## Import

```js
import { GridFilterState } from '@mui/x-data-grid-pro';
// or
import { GridFilterState } from '@mui/x-data-grid';
```

## Properties

| Name                                                         | Type                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :----------------------------------------------------------- | :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <span class="prop-name">filteredDescendantCountLookup</span> | <span class="prop-type">Record&lt;GridRowId, number&gt;</span>                      | Amount of descendants that are passing the filters.<br />For the Tree Data, it includes all the intermediate depth levels (= amount of children + amount of grand children + ...).<br />For the Row Grouping by Column, it does not include the intermediate depth levels (= amount of descendant of maximum depth).<br />If a row is not registered in this lookup, it is supposed to have no descendant passing the filters.. |
| <span class="prop-name">filterModel</span>                   | <span class="prop-type">[GridFilterModel](/api/data-grid/grid-filter-model/)</span> |                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| <span class="prop-name">visibleRowsLookup</span>             | <span class="prop-type">Record&lt;GridRowId, boolean&gt;</span>                     | Visibility status for each row.<br />A row is visible if it is passing the filters AND if its parent is expanded.<br />If a row is not registered in this lookup, it is visible.                                                                                                                                                                                                                                                |
