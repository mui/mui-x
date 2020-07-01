[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/gridApi"](../modules/_src_models_gridapi_.md) › [ColumnApi](_src_models_gridapi_.columnapi.md)

# Interface: ColumnApi

## Hierarchy

* **ColumnApi**

## Index

### Properties

* [getAllColumns](_src_models_gridapi_.columnapi.md#getallcolumns)
* [getColumnFromField](_src_models_gridapi_.columnapi.md#getcolumnfromfield)
* [getColumnIndex](_src_models_gridapi_.columnapi.md#getcolumnindex)
* [getColumnPosition](_src_models_gridapi_.columnapi.md#getcolumnposition)
* [getColumnsMeta](_src_models_gridapi_.columnapi.md#getcolumnsmeta)
* [getVisibleColumns](_src_models_gridapi_.columnapi.md#getvisiblecolumns)
* [updateColumn](_src_models_gridapi_.columnapi.md#updatecolumn)
* [updateColumns](_src_models_gridapi_.columnapi.md#updatecolumns)

## Properties

###  getAllColumns

• **getAllColumns**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:25](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L25)*

#### Type declaration:

▸ (): *[Columns](../modules/_src_models_coldef_coldef_.md#columns)*

___

###  getColumnFromField

• **getColumnFromField**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:24](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L24)*

#### Type declaration:

▸ (`field`: string): *[ColDef](_src_models_coldef_coldef_.coldef.md)*

**Parameters:**

Name | Type |
------ | ------ |
`field` | string |

___

###  getColumnIndex

• **getColumnIndex**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:28](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L28)*

#### Type declaration:

▸ (`field`: string): *number*

**Parameters:**

Name | Type |
------ | ------ |
`field` | string |

___

###  getColumnPosition

• **getColumnPosition**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:29](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L29)*

#### Type declaration:

▸ (`field`: string): *number*

**Parameters:**

Name | Type |
------ | ------ |
`field` | string |

___

###  getColumnsMeta

• **getColumnsMeta**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:27](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L27)*

#### Type declaration:

▸ (): *[ColumnsMeta](_src_models_coldef_coldef_.columnsmeta.md)*

___

###  getVisibleColumns

• **getVisibleColumns**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:26](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L26)*

#### Type declaration:

▸ (): *[Columns](../modules/_src_models_coldef_coldef_.md#columns)*

___

###  updateColumn

• **updateColumn**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:30](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L30)*

#### Type declaration:

▸ (`col`: [ColDef](_src_models_coldef_coldef_.coldef.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`col` | [ColDef](_src_models_coldef_coldef_.coldef.md) |

___

###  updateColumns

• **updateColumns**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:31](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L31)*

#### Type declaration:

▸ (`cols`: [ColDef](_src_models_coldef_coldef_.coldef.md)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`cols` | [ColDef](_src_models_coldef_coldef_.coldef.md)[] |
