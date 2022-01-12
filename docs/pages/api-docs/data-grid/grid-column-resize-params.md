# GridColumnResizeParams Interface

<p class="description">Object passed as parameter of the column resize event.</p>

## Import

```js
import { GridColumnResizeParams } from '@mui/x-data-grid-pro';
// or
import { GridColumnResizeParams } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                      | Type                                               | Description                                 |
| :---------------------------------------------------------------------------------------- | :------------------------------------------------- | :------------------------------------------ |
| <span class="prop-name">colDef</span>                                                     | <span class="prop-type">GridStateColDef</span>     | The column of the current header component. |
| <span class="prop-name optional">element<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">HTMLElement \| null</span> | The HTMLElement column header element.      |
| <span class="prop-name">width</span>                                                      | <span class="prop-type">number</span>              | The width of the column.                    |
