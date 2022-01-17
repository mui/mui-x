# GridSelectionApi Interface

<p class="description">The selection API interface that is available in the grid apiRef.</p>

## Import

```js
import { GridSelectionApi } from '@mui/x-data-grid-pro';
// or
import { GridSelectionApi } from '@mui/x-data-grid';
```

## Properties

| Name                                             | Type                                                                                                                                        | Description                                                                                                              |
| :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">getSelectedRows</span>   | <span class="prop-type">() =&gt; Map&lt;GridRowId, GridRowModel&gt;</span>                                                                  | Returns an array of the selected rows.                                                                                   |
| <span class="prop-name">isRowSelected</span>     | <span class="prop-type">(id: GridRowId) =&gt; boolean</span>                                                                                | Determines if a row is selected or not.                                                                                  |
| <span class="prop-name">selectRow</span>         | <span class="prop-type">(id: GridRowId, isSelected?: boolean, resetSelection?: boolean) =&gt; void</span>                                   | Change the selection state of a row.                                                                                     |
| <span class="prop-name">selectRowRange</span>    | <span class="prop-type">(range: { startId: GridRowId; endId: GridRowId }, isSelected?: boolean, resetSelection?: boolean) =&gt; void</span> | Change the selection state of all the selectable rows in a range.                                                        |
| <span class="prop-name">selectRows</span>        | <span class="prop-type">(ids: GridRowId[], isSelected?: boolean, resetSelection?: boolean) =&gt; void</span>                                | Change the selection state of multiple rows.                                                                             |
| <span class="prop-name">setSelectionModel</span> | <span class="prop-type">(rowIds: GridRowId[]) =&gt; void</span>                                                                             | Updates the selected rows to be those passed to the `rowIds` argument.<br />Any row already selected will be unselected. |
