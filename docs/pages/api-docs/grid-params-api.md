# GridParamsApi API

<p class="description"></p>

## Import

```js
import { GridParamsApi } from '@material-ui/x-grid';
// or
import { GridParamsApi } from '@material-ui/data-grid';
```

## Properties


| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| <span class="prop-name required">getCellElement<abbr title="required">*</abbr></span> | <span class="prop-type">(id: GridRowId, field: string) =&gt;  \| HTMLDivElement</span> |  | Get the cell DOM element. |
| <span class="prop-name required">getCellParams<abbr title="required">*</abbr></span> | <span class="prop-type">(id: GridRowId, field: string) =&gt; GridCellParams</span> |  | Get the cell params that are passed in events. |
| <span class="prop-name required">getCellValue<abbr title="required">*</abbr></span> | <span class="prop-type">(id: GridRowId, field: string) =&gt; GridCellValue</span> |  | Get the cell value of a row and field. |
| <span class="prop-name required">getColumnHeaderElement<abbr title="required">*</abbr></span> | <span class="prop-type">(field: string) =&gt;  \| HTMLDivElement</span> |  | Get the column header DOM element. |
| <span class="prop-name required">getColumnHeaderParams<abbr title="required">*</abbr></span> | <span class="prop-type">(field: string) =&gt; GridColumnHeaderParams</span> |  | Get the header params that are passed in events. |
| <span class="prop-name required">getRowElement<abbr title="required">*</abbr></span> | <span class="prop-type">(id: GridRowId) =&gt;  \| HTMLDivElement</span> |  | Get the row DOM element. |
| <span class="prop-name required">getRowParams<abbr title="required">*</abbr></span> | <span class="prop-type">(id: GridRowId) =&gt; GridRowParams</span> |  | Get the row params that are passed in events. |
