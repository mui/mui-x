[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/colDef/numericColDef"](_src_models_coldef_numericcoldef_.md)

# Module: "src/models/colDef/numericColDef"

## Index

### Object literals

* [NUMERIC_COL_DEF](_src_models_coldef_numericcoldef_.md#const-numeric_col_def)

## Object literals

### `Const` NUMERIC_COL_DEF

### ▪ **NUMERIC_COL_DEF**: *object*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:5](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L5)*

###  align

• **align**: *"right"* = "right"

*Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:8](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L8)*

###  sortComparator

• **sortComparator**: *function* = numberComparer

*Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:10](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L10)*

#### Type declaration:

▸ (`v1`: [CellValue](_src_models_rows_.md#cellvalue), `v2`: [CellValue](_src_models_rows_.md#cellvalue), `row1`: [RowModel](../interfaces/_src_models_rows_.rowmodel.md), `row2`: [RowModel](../interfaces/_src_models_rows_.rowmodel.md)): *number*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | [CellValue](_src_models_rows_.md#cellvalue) |
`v2` | [CellValue](_src_models_rows_.md#cellvalue) |
`row1` | [RowModel](../interfaces/_src_models_rows_.rowmodel.md) |
`row2` | [RowModel](../interfaces/_src_models_rows_.rowmodel.md) |

###  type

• **type**: *string* = "number"

*Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:7](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L7)*

###  width

• **width**: *number* = 80

*Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:9](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L9)*

###  valueFormatter

▸ **valueFormatter**(`__namedParameters`: object): *undefined | null | string | number | false | true | object*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:11](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L11)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`value` | undefined &#124; null &#124; string &#124; number &#124; false &#124; true &#124; object &#124; Date |

**Returns:** *undefined | null | string | number | false | true | object*
