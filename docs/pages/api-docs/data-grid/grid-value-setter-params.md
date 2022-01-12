# GridValueSetterParams Interface

<p class="description">Object passed as parameter in the column <a href="/api/data-grid/grid-col-def/">GridColDef</a> value setter callback.</p>

## Import

```js
import { GridValueSetterParams } from '@mui/x-data-grid-pro';
// or
import { GridValueSetterParams } from '@mui/x-data-grid';
```

## Properties

| Name                                 | Type                                         | Description                   |
| :----------------------------------- | :------------------------------------------- | :---------------------------- |
| <span class="prop-name">row</span>   | <span class="prop-type">GridRowModel</span>  | The row that is being edited. |
| <span class="prop-name">value</span> | <span class="prop-type">GridCellValue</span> | The new cell value.           |
