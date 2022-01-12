# GridRowsState Interface

<p class="description"></p>

## Import

```js
import { GridRowsState } from '@mui/x-data-grid-pro';
// or
import { GridRowsState } from '@mui/x-data-grid';
```

## Properties

| Name                                                 | Type                                             | Description                                                                                                                                                                                                |
| :--------------------------------------------------- | :----------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">groupingName</span>          | <span class="prop-type">string</span>            | Name of the algorithm used to group the rows<br />It is useful to decide which filtering / sorting algorithm to apply, to avoid applying tree-data filtering on a grouping-by-column dataset for instance. |
| <span class="prop-name">idRowsLookup</span>          | <span class="prop-type">GridRowsLookup</span>    |                                                                                                                                                                                                            |
| <span class="prop-name">ids</span>                   | <span class="prop-type">GridRowId[]</span>       |                                                                                                                                                                                                            |
| <span class="prop-name">totalRowCount</span>         | <span class="prop-type">number</span>            | Amount of rows before applying the filtering.<br />It also count the expanded and collapsed children rows.                                                                                                 |
| <span class="prop-name">totalTopLevelRowCount</span> | <span class="prop-type">number</span>            | Amount of rows before applying the filtering.<br />It does not count the expanded children rows.                                                                                                           |
| <span class="prop-name">tree</span>                  | <span class="prop-type">GridRowTreeConfig</span> |                                                                                                                                                                                                            |
| <span class="prop-name">treeDepth</span>             | <span class="prop-type">number</span>            |                                                                                                                                                                                                            |
