# GridRowScrollEndParams Interface

<p class="description">Object passed as parameter in the onRowsScrollEnd callback.</p>

## Import

```js
import { GridRowScrollEndParams } from '@mui/x-data-grid-pro';
// or
import { GridRowScrollEndParams } from '@mui/x-data-grid';
```

## Properties

| Name                                            | Type                                       | Description                                         |
| :---------------------------------------------- | :----------------------------------------- | :-------------------------------------------------- |
| <span class="prop-name">viewportPageSize</span> | <span class="prop-type">number</span>      | The number of rows that fit in the viewport.        |
| <span class="prop-name">virtualRowsCount</span> | <span class="prop-type">number</span>      | The number of rows allocated for the rendered zone. |
| <span class="prop-name">visibleColumns</span>   | <span class="prop-type">GridColumns</span> | The grid visible columns.                           |
