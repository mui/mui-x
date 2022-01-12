# GridFilterItem Interface

<p class="description">Filter item definition interface.</p>

## Import

```js
import { GridFilterItem } from '@mui/x-data-grid-pro';
// or
import { GridFilterItem } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                            | Type                                            | Description                                                                                                                             |
| :---------------------------------------------------------------------------------------------- | :---------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name">columnField</span>                                                      | <span class="prop-type">string</span>           | The column from which we want to filter the rows.                                                                                       |
| <span class="prop-name optional">id<sup><abbr title="optional">?</abbr></sup></span>            | <span class="prop-type">number \| string</span> | Must be unique.<br />Only useful when the model contains several items.                                                                 |
| <span class="prop-name optional">operatorValue<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">string</span>           | The name of the operator we want to apply.                                                                                              |
| <span class="prop-name optional">value<sup><abbr title="optional">?</abbr></sup></span>         | <span class="prop-type">any</span>              | The filtering value.<br />The operator filtering function will decide for each row if the row values is correct compared to this value. |
