# GridSelectionApi Interface

<p class="description">The selection API interface that is available in the grid apiRef.</p>

## Import

```js
import { GridSelectionApi } from '@material-ui/x-grid';
// or
import { GridSelectionApi } from '@material-ui/data-grid';
```

## Properties

| Name                                             | Type                                                                                                            | Description                                                     |
| :----------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| <span class="prop-name">getSelectedRows</span>   | <span class="prop-type">() =&gt; Map&lt;GridRowId, GridRowData&gt;</span>                                       | Get an array of selected rows.                                  |
| <span class="prop-name">selectRow</span>         | <span class="prop-type">(id: GridRowId, isSelected?: boolean, allowMultiple?: boolean) =&gt; void</span>        | Toggle the row selected state.                                  |
| <span class="prop-name">selectRows</span>        | <span class="prop-type">(ids: GridRowId[], isSelected?: boolean, deselectOtherRows?: boolean) =&gt; void</span> | Batch toggle rows selected state.                               |
| <span class="prop-name">setSelectionModel</span> | <span class="prop-type">(rowIds: GridRowId[]) =&gt; void</span>                                                 | Reset the selected rows to the array of ids passed in parameter |
