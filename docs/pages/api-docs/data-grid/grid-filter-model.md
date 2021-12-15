# GridFilterModel Interface

<p class="description">Model describing the filters to apply to the grid.</p>

## Import

```js

```

## Properties

| Name                                                                                           | Type                                            | Default                                                 | Description                                                                                                                                |
| :--------------------------------------------------------------------------------------------- | :---------------------------------------------- | :------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">items</span>                                                           | <span class="prop-type">GridFilterItem[]</span> | <span class="prop-default">[]</span>                    |                                                                                                                                            |
| <span class="prop-name optional">linkOperator<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">GridLinkOperator</span> | <span class="prop-default">`GridLinkOperator.Or`</span> | - `GridLinkOperator.And`: the row must pass all the filter items.<br />- `GridLinkOperator.Or`: the row must pass at least on filter item. |

## GridFilterItem

| Name                                                                                            | Type                                            | Description                                                                                                                             |
| :---------------------------------------------------------------------------------------------- | :---------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">columnField</span>                                                      | <span class="prop-type">string</span>           | The column from which we want to filter the rows.                                                                                       |
| <span class="prop-name optional">id<sup><abbr title="optional">?</abbr></sup></span>            | <span class="prop-type">number \| string</span> | Must be uniq.<br />Only useful when the model contains several items.                                                                   |
| <span class="prop-name optional">operatorValue<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">string</span>           | The name of the operator we want to apply.                                                                                              |
| <span class="prop-name optional">value<sup><abbr title="optional">?</abbr></sup></span>         | <span class="prop-type">any</span>              | The filtering value.<br />The operator filtering function will decide for each row if the row values is correct compared to this value. |
