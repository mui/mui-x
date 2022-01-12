# GridColumnVisibilityChangeParams Interface

<p class="description">Object passed as parameter of the column visibility change event.</p>

## Import

```js
import { GridColumnVisibilityChangeParams } from '@mui/x-data-grid-pro';
// or
import { GridColumnVisibilityChangeParams } from '@mui/x-data-grid';
```

## Properties

| Name                                     | Type                                           | Description                                       |
| :--------------------------------------- | :--------------------------------------------- | :------------------------------------------------ |
| <span class="prop-name">colDef</span>    | <span class="prop-type">GridStateColDef</span> | The column of the current header component.       |
| <span class="prop-name">field</span>     | <span class="prop-type">string</span>          | The field of the column which visibility changed. |
| <span class="prop-name">isVisible</span> | <span class="prop-type">boolean</span>         | The visibility state of the column.               |
