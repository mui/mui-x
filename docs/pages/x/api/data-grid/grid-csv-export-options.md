# GridCsvExportOptions Interface

<p class="description">The options to apply on the CSV export.</p>

## Demos

:::info
For examples and details on the usage, check the following pages:

- [CSV export](/x/react-data-grid/export/#csv-export)

:::

## Import

```js
import { GridCsvExportOptions } from '@mui/x-data-grid-premium';
// or
import { GridCsvExportOptions } from '@mui/x-data-grid-pro';
// or
import { GridCsvExportOptions } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                                         | Type                                                                                    | Default                                            | Description                                                                                                                                                    |
| :----------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- | :------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name optional">allColumns<sup><abbr title="optional">?</abbr></sup></span>                 | <span class="prop-type">boolean</span>                                                  | <span class="prop-default">false</span>            | If `true`, the hidden columns will also be exported.                                                                                                           |
| <span class="prop-name optional">delimiter<sup><abbr title="optional">?</abbr></sup></span>                  | <span class="prop-type">string</span>                                                   | <span class="prop-default">','</span>              | The character used to separate fields.                                                                                                                         |
| <span class="prop-name optional">fields<sup><abbr title="optional">?</abbr></sup></span>                     | <span class="prop-type">string[]</span>                                                 |                                                    | The columns exported.<br />This should only be used if you want to restrict the columns exports.                                                               |
| <span class="prop-name optional">fileName<sup><abbr title="optional">?</abbr></sup></span>                   | <span class="prop-type">string</span>                                                   | <span class="prop-default">`document.title`</span> | The string used as the file name.                                                                                                                              |
| <span class="prop-name optional">getRowsToExport<sup><abbr title="optional">?</abbr></sup></span>            | <span class="prop-type">(params: GridCsvGetRowsToExportParams) =&gt; GridRowId[]</span> |                                                    | Function that returns the id of the rows to export on the order they should be exported.                                                                       |
| <span class="prop-name optional">includeColumnGroupsHeaders<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">boolean</span>                                                  | <span class="prop-default">true</span>             | If `true`, the CSV will include the column groups.                                                                                                             |
| <span class="prop-name optional">includeHeaders<sup><abbr title="optional">?</abbr></sup></span>             | <span class="prop-type">boolean</span>                                                  | <span class="prop-default">true</span>             | If `true`, the CSV will include the column headers and column groups.<br />Use `includeColumnGroupsHeaders` to control whether the column groups are included. |
| <span class="prop-name optional">utf8WithBom<sup><abbr title="optional">?</abbr></sup></span>                | <span class="prop-type">boolean</span>                                                  | <span class="prop-default">false</span>            | If `true`, the UTF-8 Byte Order Mark (BOM) prefixes the exported file.<br />This can allow Excel to automatically detect file encoding as UTF-8.               |
