# GridColumnOrderChangeParams Interface

<p class="description">Object passed as parameter of the column order change event.</p>

## Import

```js
import { GridColumnOrderChangeParams } from '@mui/x-data-grid-pro';
// or
import { GridColumnOrderChangeParams } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                      | Type                                               | Description                                              |
| :---------------------------------------------------------------------------------------- | :------------------------------------------------- | :------------------------------------------------------- |
| <span class="prop-name">colDef</span>                                                     | <span class="prop-type">GridStateColDef</span>     | The column of the current header component.              |
| <span class="prop-name optional">element<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">HTMLElement \| null</span> | The HTMLElement column header element.                   |
| <span class="prop-name">field</span>                                                      | <span class="prop-type">string</span>              | The column field of the column that triggered the event. |
| <span class="prop-name">oldIndex</span>                                                   | <span class="prop-type">number</span>              | The old column index.                                    |
| <span class="prop-name">targetIndex</span>                                                | <span class="prop-type">number</span>              | The target column index.                                 |
