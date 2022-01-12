# GridExportOptions Interface

<p class="description">The options to apply an export.</p>

## Import

```js
import { GridExportOptions } from '@mui/x-data-grid-pro';
// or
import { GridExportOptions } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                         | Type                                    | Default                                 | Description                                                                                      |
| :------------------------------------------------------------------------------------------- | :-------------------------------------- | :-------------------------------------- | :----------------------------------------------------------------------------------------------- |
| <span class="prop-name optional">allColumns<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">boolean</span>  | <span class="prop-default">false</span> | If `true`, the hidden columns will also be exported.                                             |
| <span class="prop-name optional">fields<sup><abbr title="optional">?</abbr></sup></span>     | <span class="prop-type">string[]</span> |                                         | The columns exported.<br />This should only be used if you want to restrict the columns exports. |
