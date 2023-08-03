# GridFilterOperator Interface

<p class="description">Filter operator definition interface.</p>

## Demos

:::info
For examples and details on the usage, check the following pages:

- [Custom filter operator](/x/react-data-grid/filtering/customization/#create-a-custom-operator)

:::

## Import

```js
import { GridFilterOperator } from '@mui/x-data-grid-premium';
// or
import { GridFilterOperator } from '@mui/x-data-grid-pro';
// or
import { GridFilterOperator } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                                  | Type                                                                         | Default                                | Description                                                                                                                                                                                                               |
| :---------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <span class="prop-name">getApplyFilterFn</span>                                                       | <span class="prop-type">GetApplyFilterFnLegacy&lt;R, V, F&gt;</span>         |                                        | The callback that generates a filtering function for a given filter item and column.<br />This function can return `null` to skip filtering for this item and column.                                                     |
| <span class="prop-name optional">getApplyFilterFnV7<sup><abbr title="optional">?</abbr></sup></span>  | <span class="prop-type">GetApplyFilterFnV7&lt;R, V, F&gt;</span>             |                                        | The callback that generates a filtering function for a given filter item and column.<br />This function can return `null` to skip filtering for this item and column.<br />This function uses the more performant v7 API. |
| <span class="prop-name optional">getValueAsString<sup><abbr title="optional">?</abbr></sup></span>    | <span class="prop-type">(value: GridFilterItem['value']) =&gt; string</span> |                                        | Converts the value of a filter item to a human-readable form.                                                                                                                                                             |
| <span class="prop-name optional">headerLabel<sup><abbr title="optional">?</abbr></sup></span>         | <span class="prop-type">string</span>                                        |                                        | The label of the filter shown in header filter row.                                                                                                                                                                       |
| <span class="prop-name optional">InputComponent<sup><abbr title="optional">?</abbr></sup></span>      | <span class="prop-type">React.JSXElementConstructor&lt;any&gt;</span>        |                                        | The input component to render in the filter panel for this filter operator.                                                                                                                                               |
| <span class="prop-name optional">InputComponentProps<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">Record&lt;string, any&gt;</span>                     |                                        | The props to pass to the input component in the filter panel for this filter operator.                                                                                                                                    |
| <span class="prop-name optional">label<sup><abbr title="optional">?</abbr></sup></span>               | <span class="prop-type">string</span>                                        |                                        | The label of the filter operator.                                                                                                                                                                                         |
| <span class="prop-name optional">requiresFilterValue<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">boolean</span>                                       | <span class="prop-default">true</span> | If `false`, filter operator doesn't require user-entered value to work.<br />Usually should be set to `false` for filter operators that don't have `InputComponent` (for example `isEmpty`)                               |
| <span class="prop-name">value</span>                                                                  | <span class="prop-type">string</span>                                        |                                        | The name of the filter operator.<br />It will be matched with the `operator` property of the filter items.                                                                                                                |
