# GridRowParams Interface

<p class="description">Object passed as parameter in the column [[GridColDef]] cell renderer.</p>

## Import

```js
import { GridRowParams } from '@material-ui/x-grid';
// or
import { GridRowParams } from '@material-ui/data-grid';
```

## Properties

| Name                                                                             | Type                                                               | Default | Description                                                |
| :------------------------------------------------------------------------------- | :----------------------------------------------------------------- | :------ | :--------------------------------------------------------- |
| <span class="prop-name required">api<abbr title="required">\*</abbr></span>      | <span class="prop-type">any</span>                                 |         | GridApiRef that let you manipulate the grid.               |
| <span class="prop-name required">columns<abbr title="required">\*</abbr></span>  | <span class="prop-type">any</span>                                 |         | All grid columns.                                          |
| <span class="prop-name">element</span>                                           | <span class="prop-type"> \| HTMLElement</span>                     |         | The HTMLElement row element.                               |
| <span class="prop-name required">getValue<abbr title="required">\*</abbr></span> | <span class="prop-type">(field: string) =&gt; GridCellValue</span> |         | A function that let you get data from other columns.       |
| <span class="prop-name required">id<abbr title="required">\*</abbr></span>       | <span class="prop-type">GridRowId</span>                           |         | The grid row id.                                           |
| <span class="prop-name required">row<abbr title="required">\*</abbr></span>      | <span class="prop-type">GridRowData</span>                         |         | The row model of the row that the current cell belongs to. |
| <span class="prop-name required">rowIndex<abbr title="required">\*</abbr></span> | <span class="prop-type">number</span>                              |         | The row index of the row that the current cell belongs to. |
