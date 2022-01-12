# GridValueGetterFullParams Interface

<p class="description">Parameters passed when calling `colDef.valueGetter` in the rendering sequence.</p>

## Import

```js
import { GridValueGetterFullParams } from '@mui/x-data-grid-pro';
// or
import { GridValueGetterFullParams } from '@mui/x-data-grid';
```

## Properties

| Name                                    | Type                                                               | Description                                                      |
| :-------------------------------------- | :----------------------------------------------------------------- | :--------------------------------------------------------------- |
| <span class="prop-name">api</span>      | <span class="prop-type">[GridApi](/api/data-grid/grid-api/)</span> | GridApi that let you manipulate the grid.                        |
| <span class="prop-name">cellMode</span> | <span class="prop-type">any</span>                                 | The mode of the cell.                                            |
| <span class="prop-name">colDef</span>   | <span class="prop-type">any</span>                                 | The column of the row that the current cell belongs to.          |
| <span class="prop-name">field</span>    | <span class="prop-type">any</span>                                 | The column field of the cell that triggered the event.           |
| <span class="prop-name">getValue</span> | <span class="prop-type">any</span>                                 | Get the cell value of a row and field.                           |
| <span class="prop-name">hasFocus</span> | <span class="prop-type">any</span>                                 | If true, the cell is the active element.                         |
| <span class="prop-name">id</span>       | <span class="prop-type">any</span>                                 | The grid row id.                                                 |
| <span class="prop-name">row</span>      | <span class="prop-type">any</span>                                 | The row model of the row that the current cell belongs to.       |
| <span class="prop-name">rowNode</span>  | <span class="prop-type">any</span>                                 | The node of the row that the current cell belongs to.            |
| <span class="prop-name">tabIndex</span> | <span class="prop-type">any</span>                                 | the tabIndex value.                                              |
| <span class="prop-name">value</span>    | <span class="prop-type">any</span>                                 | The cell value, but if the column has valueGetter, use getValue. |
