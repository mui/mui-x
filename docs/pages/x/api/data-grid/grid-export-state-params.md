# GridExportStateParams Interface

<p class="description"></p>

## Import

```js
import { GridExportStateParams } from '@mui/x-data-grid-premium';
// or
import { GridExportStateParams } from '@mui/x-data-grid-pro';
// or
import { GridExportStateParams } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                                       | Type                                   | Default                                 | Description                                                                                                                                                                                                                                                                                                                          |
| :--------------------------------------------------------------------------------------------------------- | :------------------------------------- | :-------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name optional">shouldExportUnusedModels<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">boolean</span> | <span class="prop-default">false</span> | By default, the grid only exports the models that are either controlled, initialized or modified.<br />For instance, if you don't control or initialize the `filterModel` and you did not apply any filter, the model won't be exported.<br />You can pass this property to `true` to force the systematic export of all the models. |
