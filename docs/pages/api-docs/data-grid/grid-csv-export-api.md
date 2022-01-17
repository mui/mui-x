# GridCsvExportApi Interface

<p class="description">The CSV export API interface that is available in the grid apiRef.</p>

## Import

```js
import { GridCsvExportApi } from '@mui/x-data-grid-pro';
// or
import { GridCsvExportApi } from '@mui/x-data-grid';
```

## Properties

| Name                                           | Type                                                                         | Description                                                                                      |
| :--------------------------------------------- | :--------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| <span class="prop-name">exportDataAsCsv</span> | <span class="prop-type">(options?: GridCsvExportOptions) =&gt; void</span>   | Downloads and exports a CSV of the grid's data.                                                  |
| <span class="prop-name">getDataAsCsv</span>    | <span class="prop-type">(options?: GridCsvExportOptions) =&gt; string</span> | Returns the grid data as a CSV string.<br />This method is used internally by `exportDataAsCsv`. |
