# GridExportStateParams Interface

<p class="description">Object passed as parameter in the `exportState()` grid API method.</p>

## Demos

:::info
For examples and details on the usage, check the following pages:

- [Restore state with `apiRef`](/x/react-data-grid/state/#restore-the-state-with-apiref)

:::

## Import

```js
import { GridExportStateParams } from '@mui/x-data-grid-premium';
// or
import { GridExportStateParams } from '@mui/x-data-grid-pro';
// or
import { GridExportStateParams } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                                    | Type                                   | Default                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :------------------------------------------------------------------------------------------------------ | :------------------------------------- | :-------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name optional">exportOnlyDirtyModels<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">boolean</span> | <span class="prop-default">false</span> | By default, the grid exports all the models.<br />You can switch this property to `true` to only exports models that are either controlled, initialized or modified.<br />For instance, with this property, if you don't control or initialize the `filterModel` and you did not apply any filter, the model won't be exported.<br />Note that the column dimensions are not a model. The grid only exports the dimensions of the modified columns even when `exportOnlyDirtyModels` is false. |
