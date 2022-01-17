# GridScrollApi Interface

<p class="description">The scroll API interface that is available in the grid apiRef.</p>

## Import

```js
import { GridScrollApi } from '@mui/x-data-grid-pro';
// or
import { GridScrollApi } from '@mui/x-data-grid';
```

## Properties

| Name                                             | Type                                                                                           | Description                                                                                                                                  |
| :----------------------------------------------- | :--------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">getScrollPosition</span> | <span class="prop-type">() =&gt; GridScrollParams</span>                                       | Returns the current scroll position.                                                                                                         |
| <span class="prop-name">scroll</span>            | <span class="prop-type">(params: Partial&lt;GridScrollParams&gt;) =&gt; void</span>            | Triggers the viewport to scroll to the given positions (in pixels).                                                                          |
| <span class="prop-name">scrollToIndexes</span>   | <span class="prop-type">(params: Partial&lt;GridCellIndexCoordinates&gt;) =&gt; boolean</span> | Triggers the viewport to scroll to the cell at indexes given by `params`.<br />Returns `true` if the grid had to scroll to reach the target. |
