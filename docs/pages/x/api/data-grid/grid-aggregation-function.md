# GridAggregationFunction Interface

<p class="description"></p>

## Import

```js
import { GridAggregationFunction } from '@mui/x-data-grid-premium';
```

## Properties

| Name                                                                                                                                                                                                         | Type                                                                                                  | Default                                  | Description                                                                                                                                                                                |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- | :--------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">apply [<span class="plan-premium" title="Premium plan"></span>](https://mui.com/store/items/material-ui-premium/)</span>                                                             | <span class="prop-type">(params: GridAggregationParams&lt;V&gt;) =&gt; AV \| null \| undefined</span> |                                          | Function that takes the current cell values and generates the aggregated value.                                                                                                            |
| <span class="prop-name optional">hasCellUnit<sup><abbr title="optional">?</abbr></sup> [<span class="plan-premium" title="Premium plan"></span>](https://mui.com/store/items/material-ui-premium/)</span>    | <span class="prop-type">boolean</span>                                                                | <span class="prop-default">`true`</span> | Indicates if the aggregated value have the same unit as the cells used to generate it.<br />It can be used to apply a custom cell renderer only if the aggregated value has the same unit. |
| <span class="prop-name optional">types<sup><abbr title="optional">?</abbr></sup> [<span class="plan-premium" title="Premium plan"></span>](https://mui.com/store/items/material-ui-premium/)</span>          | <span class="prop-type">string[]</span>                                                               |                                          | Column types supported by this aggregation function.<br />If not defined, all types are supported (in most cases this property should be defined).                                         |
| <span class="prop-name optional">valueFormatter<sup><abbr title="optional">?</abbr></sup> [<span class="plan-premium" title="Premium plan"></span>](https://mui.com/store/items/material-ui-premium/)</span> | <span class="prop-type">(params: GridValueFormatterParams&lt;AV&gt;) =&gt; FAV</span>                 |                                          | Function that allows to apply a formatter to the aggregated value.<br />If not defined, the grid will use the formatter of the column.                                                     |
