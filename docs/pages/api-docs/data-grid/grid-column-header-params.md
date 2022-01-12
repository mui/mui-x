# GridColumnHeaderParams Interface

<p class="description">Object passed as parameter in the column <a href="/api/data-grid/grid-col-def/">GridColDef</a> header renderer.</p>

## Import

```js
import { GridColumnHeaderParams } from '@mui/x-data-grid-pro';
// or
import { GridColumnHeaderParams } from '@mui/x-data-grid';
```

## Properties

| Name                                  | Type                                           | Description                                             |
| :------------------------------------ | :--------------------------------------------- | :------------------------------------------------------ |
| <span class="prop-name">colDef</span> | <span class="prop-type">GridStateColDef</span> | The column of the current header component.             |
| <span class="prop-name">field</span>  | <span class="prop-type">string</span>          | The column field of the column that triggered the event |
