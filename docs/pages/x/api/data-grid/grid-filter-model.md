# GridFilterModel Interface

<p class="description">Model describing the filters to apply to the grid.</p>

## Import

```js
import { GridFilterModel } from '@mui/x-data-grid-premium';
// or
import { GridFilterModel } from '@mui/x-data-grid-pro';
// or
import { GridFilterModel } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                                       | Type                                            | Default                                                  | Description                                                                                                                                |
| :--------------------------------------------------------------------------------------------------------- | :---------------------------------------------- | :------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">items</span>                                                                       | <span class="prop-type">GridFilterItem[]</span> | <span class="prop-default">[]</span>                     |                                                                                                                                            |
| <span class="prop-name optional">linkOperator<sup><abbr title="optional">?</abbr></sup></span>             | <span class="prop-type">GridLinkOperator</span> | <span class="prop-default">`GridLinkOperator.Or`</span>  | - `GridLinkOperator.And`: the row must pass all the filter items.<br />- `GridLinkOperator.Or`: the row must pass at least on filter item. |
| <span class="prop-name optional">quickFilterLogicOperator<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">GridLinkOperator</span> | <span class="prop-default">`GridLinkOperator.And`</span> | - `GridLinkOperator.And`: the row must pass all the values.<br />- `GridLinkOperator.Or`: the row must pass at least one value.            |
| <span class="prop-name optional">quickFilterValues<sup><abbr title="optional">?</abbr></sup></span>        | <span class="prop-type">any[]</span>            | <span class="prop-default">`[]`</span>                   | values used to quick filter rows                                                                                                           |
