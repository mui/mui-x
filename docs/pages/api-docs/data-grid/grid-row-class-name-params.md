# GridRowClassNameParams Interface

<p class="description">Object passed as parameter in the row `getRowClassName` callback prop.</p>

## Import

```js
import { GridRowClassNameParams } from '@mui/x-data-grid-pro';
// or
import { GridRowClassNameParams } from '@mui/x-data-grid';
```

## Properties

| Name                                          | Type                                                                    | Description                                                |
| :-------------------------------------------- | :---------------------------------------------------------------------- | :--------------------------------------------------------- |
| <span class="prop-name">columns</span>        | <span class="prop-type">GridColumns</span>                              | All grid columns.                                          |
| <span class="prop-name">getValue</span>       | <span class="prop-type">(id: GridRowId, field: string) =&gt; any</span> | Get the cell value of a row and field.                     |
| <span class="prop-name">id</span>             | <span class="prop-type">GridRowId</span>                                | The grid row id.                                           |
| <span class="prop-name">isFirstVisible</span> | <span class="prop-type">boolean</span>                                  | Whether this row is the first visible or not.              |
| <span class="prop-name">isLastVisible</span>  | <span class="prop-type">boolean</span>                                  | Whether this row is the last visible or not.               |
| <span class="prop-name">row</span>            | <span class="prop-type">R</span>                                        | The row model of the row that the current cell belongs to. |
