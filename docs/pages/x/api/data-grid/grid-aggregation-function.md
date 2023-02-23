# GridAggregationFunction Interface

<p class="description">Grid aggregation function definition interface.</p>

## Demos

:::info
For examples and details on the usage, check the following pages:

- [Aggregation functions](/x/react-data-grid/aggregation/#aggregation-functions)

:::

## Import

```js
import { GridAggregationFunction } from '@mui/x-data-grid-premium';
```

## Properties

| Name                                                                                                                                                                                                | Type                                                                                                  | Default                                                                                                       | Description                                                                                                                                                                                |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">apply [<span class="plan-premium" title="Premium plan"></span>](/x/introduction/licensing/#premium-plan)</span>                                                             | <span class="prop-type">(params: GridAggregationParams&lt;V&gt;) =&gt; AV \| null \| undefined</span> |                                                                                                               | Function that takes the current cell values and generates the aggregated value.                                                                                                            |
| <span class="prop-name optional">columnTypes<sup><abbr title="optional">?</abbr></sup> [<span class="plan-premium" title="Premium plan"></span>](/x/introduction/licensing/#premium-plan)</span>    | <span class="prop-type">string[]</span>                                                               |                                                                                                               | Column types supported by this aggregation function.<br />If not defined, all types are supported (in most cases this property should be defined).                                         |
| <span class="prop-name optional">getCellValue<sup><abbr title="optional">?</abbr></sup> [<span class="plan-premium" title="Premium plan"></span>](/x/introduction/licensing/#premium-plan)</span>   | <span class="prop-type">(params: GridAggregationGetCellValueParams) =&gt; V</span>                    |                                                                                                               | Function that allows to transform the value of the cell passed to the aggregation function applier.<br />Useful for aggregating data from multiple row fields.                             |
| <span class="prop-name optional">hasCellUnit<sup><abbr title="optional">?</abbr></sup> [<span class="plan-premium" title="Premium plan"></span>](/x/introduction/licensing/#premium-plan)</span>    | <span class="prop-type">boolean</span>                                                                | <span class="prop-default">`true`</span>                                                                      | Indicates if the aggregated value have the same unit as the cells used to generate it.<br />It can be used to apply a custom cell renderer only if the aggregated value has the same unit. |
| <span class="prop-name optional">label<sup><abbr title="optional">?</abbr></sup> [<span class="plan-premium" title="Premium plan"></span>](/x/introduction/licensing/#premium-plan)</span>          | <span class="prop-type">string</span>                                                                 | <span class="prop-default">`apiRef.current.getLocaleText('aggregationFunctionLabel{capitalize(name)})`</span> | Label of the aggregation function.<br />Will be used to add a label on the footer of the grouping column when this aggregation function is the only one being used.                        |
| <span class="prop-name optional">valueFormatter<sup><abbr title="optional">?</abbr></sup> [<span class="plan-premium" title="Premium plan"></span>](/x/introduction/licensing/#premium-plan)</span> | <span class="prop-type">(params: GridValueFormatterParams&lt;AV&gt;) =&gt; FAV</span>                 |                                                                                                               | Function that allows to apply a formatter to the aggregated value.<br />If not defined, the grid will use the formatter of the column.                                                     |
