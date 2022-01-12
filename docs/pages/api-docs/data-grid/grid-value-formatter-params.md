# GridValueFormatterParams Interface

<p class="description">Object passed as parameter in the column <a href="/api/data-grid/grid-col-def/">GridColDef</a> value formatter callback.</p>

## Import

```js
import { GridValueFormatterParams } from '@mui/x-data-grid-pro';
// or
import { GridValueFormatterParams } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                 | Type                                                               | Description                                                                                       |
| :----------------------------------------------------------------------------------- | :----------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| <span class="prop-name">api</span>                                                   | <span class="prop-type">[GridApi](/api/data-grid/grid-api/)</span> | GridApi that let you manipulate the grid.                                                         |
| <span class="prop-name">field</span>                                                 | <span class="prop-type">string</span>                              | The column field of the cell that triggered the event                                             |
| <span class="prop-name optional">id<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">GridRowId</span>                           | The grid row id.<br />It is not available when the value formatter is called by the filter panel. |
| <span class="prop-name">value</span>                                                 | <span class="prop-type">GridCellValue</span>                       | The cell value, but if the column has valueGetter, use getValue.                                  |
