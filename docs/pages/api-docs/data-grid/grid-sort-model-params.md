# GridSortModelParams Interface

<p class="description">Object passed as parameter of the column sorted event.</p>

## Import

```js
import { GridSortModelParams } from '@mui/x-data-grid-pro';
// or
import { GridSortModelParams } from '@mui/x-data-grid';
```

## Properties

| Name                                     | Type                                                               | Description                           |
| :--------------------------------------- | :----------------------------------------------------------------- | :------------------------------------ |
| <span class="prop-name">api</span>       | <span class="prop-type">[GridApi](/api/data-grid/grid-api/)</span> | Api that let you manipulate the grid. |
| <span class="prop-name">columns</span>   | <span class="prop-type">GridColumns</span>                         | The full set of columns.              |
| <span class="prop-name">sortModel</span> | <span class="prop-type">GridSortModel</span>                       | The sort model used to sort the grid. |
