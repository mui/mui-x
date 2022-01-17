# GridEditRowApi Interface

<p class="description">The editing API interface that is available in the grid `apiRef`.</p>

## Import

```js
import { GridEditRowApi } from '@mui/x-data-grid-pro';
// or
import { GridEditRowApi } from '@mui/x-data-grid';
```

## Properties

| Name                                            | Type                                                                                                                              | Description                                                                         |
| :---------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| <span class="prop-name">commitCellChange</span> | <span class="prop-type">(params: GridCommitCellChangeParams, event?: MuiBaseEvent) =&gt; boolean \| Promise&lt;boolean&gt;</span> | Updates the field at the given id with the value stored in the edit row model.      |
| <span class="prop-name">commitRowChange</span>  | <span class="prop-type">(id: GridRowId, event?: MuiBaseEvent) =&gt; boolean \| Promise&lt;boolean&gt;</span>                      | Updates the row at the given id with the values stored in the edit row model.       |
| <span class="prop-name">getCellMode</span>      | <span class="prop-type">(id: GridRowId, field: string) =&gt; GridCellMode</span>                                                  | Gets the mode of a cell.                                                            |
| <span class="prop-name">getEditRowsModel</span> | <span class="prop-type">() =&gt; GridEditRowsModel</span>                                                                         | Gets the edit rows model of the grid.                                               |
| <span class="prop-name">getRowMode</span>       | <span class="prop-type">(id: GridRowId) =&gt; GridRowMode</span>                                                                  | Gets the mode of a row.                                                             |
| <span class="prop-name">isCellEditable</span>   | <span class="prop-type">(params: GridCellParams) =&gt; boolean</span>                                                             | Controls if a cell is editable.                                                     |
| <span class="prop-name">setCellMode</span>      | <span class="prop-type">(id: GridRowId, field: string, mode: GridCellMode) =&gt; void</span>                                      | Sets the mode of a cell.                                                            |
| <span class="prop-name">setEditCellValue</span> | <span class="prop-type">(params: GridEditCellValueParams, event?: MuiBaseEvent) =&gt; void</span>                                 | Sets the value of the edit cell.<br />Commonly used inside the edit cell component. |
| <span class="prop-name">setEditRowsModel</span> | <span class="prop-type">(model: GridEditRowsModel) =&gt; void</span>                                                              | Set the edit rows model of the grid.                                                |
| <span class="prop-name">setRowMode</span>       | <span class="prop-type">(id: GridRowId, mode: GridRowMode) =&gt; void</span>                                                      | Sets the mode of a row.                                                             |
