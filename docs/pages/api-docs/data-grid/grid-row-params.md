# GridRowParams Interface

<p class="description">Object passed as parameter in the row callbacks.</p>

## Import

```js
import { GridRowParams } from '@mui/x-data-grid-pro';
// or
import { GridRowParams } from '@mui/x-data-grid';
```

## Properties

| Name                                    | Type                                                                              | Description                                                |
| :-------------------------------------- | :-------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| <span class="prop-name">columns</span>  | <span class="prop-type">GridColumns</span>                                        | All grid columns.                                          |
| <span class="prop-name">getValue</span> | <span class="prop-type">(id: GridRowId, field: string) =&gt; GridCellValue</span> | Get the cell value of a row and field.                     |
| <span class="prop-name">id</span>       | <span class="prop-type">GridRowId</span>                                          | The grid row id.                                           |
| <span class="prop-name">row</span>      | <span class="prop-type">R</span>                                                  | The row model of the row that the current cell belongs to. |
