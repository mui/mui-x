[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/sortModel"](_src_models_sortmodel_.md)

# Module: "src/models/sortModel"

## Index

### Interfaces

- [SortItem](../interfaces/_src_models_sortmodel_.sortitem.md)

### Type aliases

- [ComparatorFn](_src_models_sortmodel_.md#comparatorfn)
- [FieldComparatorList](_src_models_sortmodel_.md#fieldcomparatorlist)
- [SortDirection](_src_models_sortmodel_.md#sortdirection)
- [SortModel](_src_models_sortmodel_.md#sortmodel)

## Type aliases

### ComparatorFn

Ƭ **ComparatorFn**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/sortModel.ts:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/sortModel.ts#L7)_

#### Type declaration:

▸ (`v1`: [CellValue](_src_models_rows_.md#cellvalue), `v2`: [CellValue](_src_models_rows_.md#cellvalue), `row1`: [RowModel](../interfaces/_src_models_rows_.rowmodel.md), `row2`: [RowModel](../interfaces/_src_models_rows_.rowmodel.md)): _number_

**Parameters:**

| Name   | Type                                                    |
| ------ | ------------------------------------------------------- |
| `v1`   | [CellValue](_src_models_rows_.md#cellvalue)             |
| `v2`   | [CellValue](_src_models_rows_.md#cellvalue)             |
| `row1` | [RowModel](../interfaces/_src_models_rows_.rowmodel.md) |
| `row2` | [RowModel](../interfaces/_src_models_rows_.rowmodel.md) |

---

### FieldComparatorList

Ƭ **FieldComparatorList**: _object[]_

_Defined in [packages/grid/x-grid-modules/src/models/sortModel.ts:5](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/sortModel.ts#L5)_

---

### SortDirection

Ƭ **SortDirection**: _"asc" | "desc" | null | undefined_

_Defined in [packages/grid/x-grid-modules/src/models/sortModel.ts:3](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/sortModel.ts#L3)_

---

### SortModel

Ƭ **SortModel**: _[SortItem](../interfaces/_src_models_sortmodel_.sortitem.md)[]_

_Defined in [packages/grid/x-grid-modules/src/models/sortModel.ts:13](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/sortModel.ts#L13)_
