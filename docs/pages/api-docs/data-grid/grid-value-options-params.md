# GridValueOptionsParams Interface

<p class="description">Object passed as parameter of the valueOptions function for singleSelect column.</p>

## Import

```js
import { GridValueOptionsParams } from '@mui/x-data-grid-pro';
// or
import { GridValueOptionsParams } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                  | Type                                        | Description                                                |
| :------------------------------------------------------------------------------------ | :------------------------------------------ | :--------------------------------------------------------- |
| <span class="prop-name">field</span>                                                  | <span class="prop-type">string</span>       | The field of the column to which options will be provided  |
| <span class="prop-name optional">id<sup><abbr title="optional">?</abbr></sup></span>  | <span class="prop-type">GridRowId</span>    | The grid row id.                                           |
| <span class="prop-name optional">row<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">GridRowModel</span> | The row model of the row that the current cell belongs to. |
