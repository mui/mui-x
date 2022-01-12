# GridDimensions Interface

<p class="description"></p>

## Import

```js
import { GridDimensions } from '@mui/x-data-grid-pro';
// or
import { GridDimensions } from '@mui/x-data-grid';
```

## Properties

| Name                                             | Type                                       | Description                                                                                                           |
| :----------------------------------------------- | :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">hasScrollX</span>        | <span class="prop-type">boolean</span>     | Indicates if a scroll is currently needed to go from the beginning of the first column to the end of the last column. |
| <span class="prop-name">hasScrollY</span>        | <span class="prop-type">boolean</span>     | Indicates if a scroll is currently needed to go from the beginning of the first row to the end of the last row.       |
| <span class="prop-name">viewportInnerSize</span> | <span class="prop-type">ElementSize</span> | The viewport size not including scrollbars.                                                                           |
| <span class="prop-name">viewportOuterSize</span> | <span class="prop-type">ElementSize</span> | The viewport size including scrollbars.                                                                               |
