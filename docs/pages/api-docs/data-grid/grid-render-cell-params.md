# GridRenderCellParams Interface

<p class="description">GridCellParams containing api.</p>

## Import

```js
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
// or
import { GridRenderCellParams } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                         | Type                                                                                              | Description                                                      |
| :------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------- |
| <span class="prop-name">api</span>                                                           | <span class="prop-type">[GridApi](/api/data-grid/grid-api/)</span>                                | GridApi that let you manipulate the grid.                        |
| <span class="prop-name">cellMode</span>                                                      | <span class="prop-type">GridCellMode</span>                                                       | The mode of the cell.                                            |
| <span class="prop-name">colDef</span>                                                        | <span class="prop-type">GridStateColDef</span>                                                    | The column of the row that the current cell belongs to.          |
| <span class="prop-name">field</span>                                                         | <span class="prop-type">string</span>                                                             | The column field of the cell that triggered the event.           |
| <span class="prop-name">formattedValue</span>                                                | <span class="prop-type">F</span>                                                                  | The cell value formatted with the column valueFormatter.         |
| <span class="prop-name">getValue</span>                                                      | <span class="prop-type">(id: GridRowId, field: string) =&gt; GridCellValue</span>                 | Get the cell value of a row and field.                           |
| <span class="prop-name">hasFocus</span>                                                      | <span class="prop-type">boolean</span>                                                            | If true, the cell is the active element.                         |
| <span class="prop-name">id</span>                                                            | <span class="prop-type">GridRowId</span>                                                          | The grid row id.                                                 |
| <span class="prop-name optional">isEditable<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">boolean</span>                                                            | If true, the cell is editable.                                   |
| <span class="prop-name">row</span>                                                           | <span class="prop-type">GridRowModel&lt;R&gt;</span>                                              | The row model of the row that the current cell belongs to.       |
| <span class="prop-name">rowNode</span>                                                       | <span class="prop-type">[GridRowTreeNodeConfig](/api/data-grid/grid-row-tree-node-config/)</span> | The node of the row that the current cell belongs to.            |
| <span class="prop-name">tabIndex</span>                                                      | <span class="prop-type">0 \| -1</span>                                                            | the tabIndex value.                                              |
| <span class="prop-name">value</span>                                                         | <span class="prop-type">V</span>                                                                  | The cell value, but if the column has valueGetter, use getValue. |
