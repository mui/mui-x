# GridCellParams Interface

<p class="description">Object passed as parameter in the column [[GridColDef]] cell renderer.</p>

## Import

```js
import { GridCellParams } from '@material-ui/x-grid';
// or
import { GridCellParams } from '@material-ui/data-grid';
```

## Properties

| Name                                                                                   | Type                                                               | Default | Description                                                      |
| :------------------------------------------------------------------------------------- | :----------------------------------------------------------------- | :------ | :--------------------------------------------------------------- |
| <span class="prop-name required">api<abbr title="required">\*</abbr></span>            | <span class="prop-type">any</span>                                 |         | GridApi that let you manipulate the grid.                        |
| <span class="prop-name required">cellMode<abbr title="required">\*</abbr></span>       | <span class="prop-type">GridCellMode</span>                        |         | The mode of the cell.                                            |
| <span class="prop-name required">colDef<abbr title="required">\*</abbr></span>         | <span class="prop-type">any</span>                                 |         | The column of the row that the current cell belongs to.          |
| <span class="prop-name required">colIndex<abbr title="required">\*</abbr></span>       | <span class="prop-type">number</span>                              |         | The column index that the current cell belongs to.               |
| <span class="prop-name">element</span>                                                 | <span class="prop-type"> \| HTMLElement</span>                     |         | The HTMLElement cell element.                                    |
| <span class="prop-name required">field<abbr title="required">\*</abbr></span>          | <span class="prop-type">string</span>                              |         | The column field of the cell that triggered the event            |
| <span class="prop-name required">formattedValue<abbr title="required">\*</abbr></span> | <span class="prop-type">GridCellValue</span>                       |         | The cell value formatted with the column valueFormatter.         |
| <span class="prop-name required">getValue<abbr title="required">\*</abbr></span>       | <span class="prop-type">(field: string) =&gt; GridCellValue</span> |         | A function that let you get data from other columns.             |
| <span class="prop-name required">id<abbr title="required">\*</abbr></span>             | <span class="prop-type">GridRowId</span>                           |         | The grid row id.                                                 |
| <span class="prop-name">isEditable</span>                                              | <span class="prop-type">boolean</span>                             |         | If true, the cell is editable.                                   |
| <span class="prop-name required">row<abbr title="required">\*</abbr></span>            | <span class="prop-type">GridRowData</span>                         |         | The row model of the row that the current cell belongs to.       |
| <span class="prop-name required">rowIndex<abbr title="required">\*</abbr></span>       | <span class="prop-type">number</span>                              |         | The row index of the row that the current cell belongs to.       |
| <span class="prop-name required">value<abbr title="required">\*</abbr></span>          | <span class="prop-type">GridCellValue</span>                       |         | The cell value, but if the column has valueGetter, use getValue. |
