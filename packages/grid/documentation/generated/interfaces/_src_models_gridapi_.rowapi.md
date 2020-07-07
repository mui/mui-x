[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/gridApi"](../modules/_src_models_gridapi_.md) › [RowApi](_src_models_gridapi_.rowapi.md)

# Interface: RowApi

## Hierarchy

* **RowApi**

## Index

### Properties

* [getAllRowIds](_src_models_gridapi_.rowapi.md#getallrowids)
* [getRowFromId](_src_models_gridapi_.rowapi.md#getrowfromid)
* [getRowIdFromRowIndex](_src_models_gridapi_.rowapi.md#getrowidfromrowindex)
* [getRowIndexFromId](_src_models_gridapi_.rowapi.md#getrowindexfromid)
* [getRowModels](_src_models_gridapi_.rowapi.md#getrowmodels)
* [getRowsCount](_src_models_gridapi_.rowapi.md#getrowscount)
* [setRowModels](_src_models_gridapi_.rowapi.md#setrowmodels)
* [updateRowData](_src_models_gridapi_.rowapi.md#updaterowdata)
* [updateRowModels](_src_models_gridapi_.rowapi.md#updaterowmodels)

## Properties

###  getAllRowIds

• **getAllRowIds**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:14](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L14)*

#### Type declaration:

▸ (): *[RowId](../modules/_src_models_rows_.md#rowid)[]*

___

###  getRowFromId

• **getRowFromId**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:20](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L20)*

#### Type declaration:

▸ (`id`: [RowId](../modules/_src_models_rows_.md#rowid)): *[RowModel](_src_models_rows_.rowmodel.md)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | [RowId](../modules/_src_models_rows_.md#rowid) |

___

###  getRowIdFromRowIndex

• **getRowIdFromRowIndex**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L18)*

#### Type declaration:

▸ (`index`: number): *[RowId](../modules/_src_models_rows_.md#rowid)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

___

###  getRowIndexFromId

• **getRowIndexFromId**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:19](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L19)*

#### Type declaration:

▸ (`id`: [RowId](../modules/_src_models_rows_.md#rowid)): *number*

**Parameters:**

Name | Type |
------ | ------ |
`id` | [RowId](../modules/_src_models_rows_.md#rowid) |

___

###  getRowModels

• **getRowModels**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L12)*

#### Type declaration:

▸ (): *[Rows](../modules/_src_models_rows_.md#rows)*

___

###  getRowsCount

• **getRowsCount**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:13](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L13)*

#### Type declaration:

▸ (): *number*

___

###  setRowModels

• **setRowModels**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L15)*

#### Type declaration:

▸ (`rows`: [Rows](../modules/_src_models_rows_.md#rows)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`rows` | [Rows](../modules/_src_models_rows_.md#rows) |

___

###  updateRowData

• **updateRowData**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:17](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L17)*

#### Type declaration:

▸ (`updates`: [RowData](_src_models_rows_.rowdata.md)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`updates` | [RowData](_src_models_rows_.rowdata.md)[] |

___

###  updateRowModels

• **updateRowModels**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L16)*

#### Type declaration:

▸ (`updates`: Partial‹[RowModel](_src_models_rows_.rowmodel.md)›[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`updates` | Partial‹[RowModel](_src_models_rows_.rowmodel.md)›[] |
