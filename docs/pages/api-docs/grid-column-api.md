# GridColumnApi API

<p class="description">The column API interface that is available in the grid [[apiRef]].</p>

## Import

```js
import { GridColumnApi } from '@material-ui/x-grid';
// or
import { GridColumnApi } from '@material-ui/data-grid';
```

## Properties


| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| <span class="prop-name required">getAllColumns<abbr title="required">*</abbr></span> | <span class="prop-type">() =&gt; GridColumns</span> |  | Get all the [[GridColumns]]. |
| <span class="prop-name required">getColumnFromField<abbr title="required">*</abbr></span> | <span class="prop-type">(field: string) =&gt; GridColDef</span> |  | Retrieve a column from its field. |
| <span class="prop-name required">getColumnIndex<abbr title="required">*</abbr></span> | <span class="prop-type">(field: string, useVisibleColumns?: boolean) =&gt; number</span> |  | Get the index position of the column in the array of [[GridColDef]]. |
| <span class="prop-name required">getColumnPosition<abbr title="required">*</abbr></span> | <span class="prop-type">(field: string) =&gt; number</span> |  | Get the column left position in pixel relative to the left grid inner border. |
| <span class="prop-name required">getColumnsMeta<abbr title="required">*</abbr></span> | <span class="prop-type">() =&gt; GridColumnsMeta</span> |  | Get the columns meta data. |
| <span class="prop-name required">getVisibleColumns<abbr title="required">*</abbr></span> | <span class="prop-type">() =&gt; GridColumns</span> |  | Get the currently visible columns. |
| <span class="prop-name required">setColumnIndex<abbr title="required">*</abbr></span> | <span class="prop-type">(field: string, targetIndexPosition: number) =&gt; void</span> |  | Allows to move a column to another position in the column array. |
| <span class="prop-name required">setColumnWidth<abbr title="required">*</abbr></span> | <span class="prop-type">(field: string, width: number) =&gt; void</span> |  | Allows to set target column width. |
| <span class="prop-name required">toggleColumn<abbr title="required">*</abbr></span> | <span class="prop-type">(field: string, forceHide?: boolean) =&gt; void</span> |  | Allows to toggle a column. |
| <span class="prop-name required">updateColumn<abbr title="required">*</abbr></span> | <span class="prop-type">(col: GridColDef) =&gt; void</span> |  | Allows to update a column [[GridColDef]] model. |
| <span class="prop-name required">updateColumns<abbr title="required">*</abbr></span> | <span class="prop-type">(cols: GridColDef[], resetColumnState?: boolean) =&gt; void</span> |  | Allows to batch update multiple columns at the same time. |
