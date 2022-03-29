# GridFilterOperator Interface

<p class="description">Filter operator definition interface.</p>

## Import

```js
import { GridFilterOperator } from '@mui/x-data-grid-premium';
// or
import { GridFilterOperator } from '@mui/x-data-grid-pro';
// or
import { GridFilterOperator } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                                  | Type                                                                                                                                                                                                                                               | Description                                                                                                                                                           |
| :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">getApplyFilterFn</span>                                                       | <span class="prop-type">(filterItem: GridFilterItem, column: GridStateColDef&lt;R, V, F&gt;) =&gt; null \| ((params: GridCellParams&lt;V, R, F&gt;) =&gt; boolean)</span>                                                                          | The callback that generates a filtering function for a given filter item and column.<br />This function can return `null` to skip filtering for this item and column. |
| <span class="prop-name optional">InputComponent<sup><abbr title="optional">?</abbr></sup></span>      | <span class="prop-type">React.JSXElementConstructor&lt;GridFilterInputValueProps&gt; \| React.JSXElementConstructor&lt;GridFilterInputMultipleValueProps&gt; \| React.JSXElementConstructor&lt;GridFilterInputMultipleSingleSelectProps&gt;</span> | The input component to render in the filter panel for this filter operator.                                                                                           |
| <span class="prop-name optional">InputComponentProps<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">Record&lt;string, any&gt;</span>                                                                                                                                                                                           | The props to pass to the input component in the filter panel for this filter operator.                                                                                |
| <span class="prop-name optional">label<sup><abbr title="optional">?</abbr></sup></span>               | <span class="prop-type">string</span>                                                                                                                                                                                                              | The label of the filter operator.                                                                                                                                     |
| <span class="prop-name">value</span>                                                                  | <span class="prop-type">string</span>                                                                                                                                                                                                              | The name of the filter operator.<br />It will be matched with the `operatorValue` property of the filter items.                                                       |
