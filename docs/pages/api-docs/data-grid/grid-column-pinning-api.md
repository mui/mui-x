# GridColumnPinningApi Interface

<p class="description">The column pinning API interface that is available in the grid apiRef.</p>

## Import

```js
import { GridColumnPinningApi } from '@mui/x-data-grid-pro';
// or
import { GridColumnPinningApi } from '@mui/x-data-grid';
```

## Properties

| Name                                            | Type                                                                                | Description                                          |
| :---------------------------------------------- | :---------------------------------------------------------------------------------- | :--------------------------------------------------- |
| <span class="prop-name">getPinnedColumns</span> | <span class="prop-type">() =&gt; GridPinnedColumns</span>                           | Returns which columns are pinned.                    |
| <span class="prop-name">isColumnPinned</span>   | <span class="prop-type">(field: string) =&gt; GridPinnedPosition \| false</span>    | Returns which side a column is pinned to.            |
| <span class="prop-name">pinColumn</span>        | <span class="prop-type">(field: string, side: GridPinnedPosition) =&gt; void</span> | Pins a column to the left or right side of the grid. |
| <span class="prop-name">setPinnedColumns</span> | <span class="prop-type">(pinnedColumns: GridPinnedColumns) =&gt; void</span>        | Changes the pinned columns.                          |
| <span class="prop-name">unpinColumn</span>      | <span class="prop-type">(field: string) =&gt; void</span>                           | Unpins a column.                                     |
