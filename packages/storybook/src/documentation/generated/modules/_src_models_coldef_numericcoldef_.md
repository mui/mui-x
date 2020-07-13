[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/colDef/numericColDef"](_src_models_coldef_numericcoldef_.md)

# Module: "src/models/colDef/numericColDef"

## Index

### Object literals

- [NUMERIC_COL_DEF](_src_models_coldef_numericcoldef_.md#const-numeric_col_def)

## Object literals

### `Const` NUMERIC_COL_DEF

### ▪ **NUMERIC_COL_DEF**: _object_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:5](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L5)_

### align

• **align**: _"right"_ = "right"

_Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L8)_

### sortComparator

• **sortComparator**: _function_ = numberComparer

_Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:10](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L10)_

#### Type declaration:

▸ (`v1`: [CellValue](_src_models_rows_.md#cellvalue), `v2`: [CellValue](_src_models_rows_.md#cellvalue), `row1`: [RowModel](../interfaces/_src_models_rows_.rowmodel.md), `row2`: [RowModel](../interfaces/_src_models_rows_.rowmodel.md)): _number_

**Parameters:**

| Name   | Type                                                    |
| ------ | ------------------------------------------------------- |
| `v1`   | [CellValue](_src_models_rows_.md#cellvalue)             |
| `v2`   | [CellValue](_src_models_rows_.md#cellvalue)             |
| `row1` | [RowModel](../interfaces/_src_models_rows_.rowmodel.md) |
| `row2` | [RowModel](../interfaces/_src_models_rows_.rowmodel.md) |

### type

• **type**: _string_ = "number"

_Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L7)_

### width

• **width**: _number_ = 80

_Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L9)_

### valueFormatter

▸ **valueFormatter**(`__namedParameters`: object): _undefined | null | string | number | false | true | object_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts:11](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/numericColDef.ts#L11)_

**Parameters:**

▪ **\_\_namedParameters**: _object_

| Name    | Type                                                                                                 |
| ------- | ---------------------------------------------------------------------------------------------------- |
| `value` | undefined &#124; null &#124; string &#124; number &#124; false &#124; true &#124; object &#124; Date |

**Returns:** _undefined | null | string | number | false | true | object_
