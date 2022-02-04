# GridExcelExportOptions Interface

<p class="description">The options to apply on the Excel export.</p>

## Import

```js
import { GridExcelExportOptions } from '@mui/x-data-grid-pro';
// or
import { GridExcelExportOptions } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                                 | Type                                                                                             | Default                                            | Description                                                                                      |
| :--------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- | :------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| <span class="prop-name optional">allColumns<sup><abbr title="optional">?</abbr></sup></span>         | <span class="prop-type">boolean</span>                                                           | <span class="prop-default">false</span>            | If `true`, the hidden columns will also be exported.                                             |
| <span class="prop-name optional">exceljsPostprocess<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">(processInput: GridExceljsProcessInput) =&gt; Promise&lt;void&gt;</span> |                                                    |                                                                                                  |
| <span class="prop-name optional">exceljsPreprocess<sup><abbr title="optional">?</abbr></sup></span>  | <span class="prop-type">(processInput: GridExceljsProcessInput) =&gt; Promise&lt;void&gt;</span> |                                                    |                                                                                                  |
| <span class="prop-name optional">fields<sup><abbr title="optional">?</abbr></sup></span>             | <span class="prop-type">string[]</span>                                                          |                                                    | The columns exported.<br />This should only be used if you want to restrict the columns exports. |
| <span class="prop-name optional">fileName<sup><abbr title="optional">?</abbr></sup></span>           | <span class="prop-type">string</span>                                                            | <span class="prop-default">`document.title`</span> | The string used as the file name.                                                                |
| <span class="prop-name optional">getRowsToExport<sup><abbr title="optional">?</abbr></sup></span>    | <span class="prop-type">(params: GridGetRowsToExportParams) =&gt; GridRowId[]</span>             |                                                    | Function that returns the id of the rows to export on the order they should be exported.         |
| <span class="prop-name optional">includeHeaders<sup><abbr title="optional">?</abbr></sup></span>     | <span class="prop-type">boolean</span>                                                           | <span class="prop-default">true</span>             | If `true`, the first row of the file will include the headers of the grid.                       |
