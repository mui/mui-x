[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/utils/sortingUtils"](_src_utils_sortingutils_.md)

# Module: "src/utils/sortingUtils"

## Index

### Functions

- [dateComparer](_src_utils_sortingutils_.md#const-datecomparer)
- [isDesc](_src_utils_sortingutils_.md#const-isdesc)
- [nextSortDirection](_src_utils_sortingutils_.md#const-nextsortdirection)
- [nillComparer](_src_utils_sortingutils_.md#const-nillcomparer)
- [numberComparer](_src_utils_sortingutils_.md#const-numbercomparer)
- [stringNumberComparer](_src_utils_sortingutils_.md#const-stringnumbercomparer)

## Functions

### `Const` dateComparer

▸ **dateComparer**(`v1`: [CellValue](_src_models_rows_.md#cellvalue), `v2`: [CellValue](_src_models_rows_.md#cellvalue)): _number_

_Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:43](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L43)_

**Parameters:**

| Name | Type                                        |
| ---- | ------------------------------------------- |
| `v1` | [CellValue](_src_models_rows_.md#cellvalue) |
| `v2` | [CellValue](_src_models_rows_.md#cellvalue) |

**Returns:** _number_

---

### `Const` isDesc

▸ **isDesc**(`direction`: [SortDirection](_src_models_sortmodel_.md#sortdirection)): _boolean_

_Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L12)_

**Parameters:**

| Name        | Type                                                     |
| ----------- | -------------------------------------------------------- |
| `direction` | [SortDirection](_src_models_sortmodel_.md#sortdirection) |

**Returns:** _boolean_

---

### `Const` nextSortDirection

▸ **nextSortDirection**(`sortingOrder`: [SortDirection](_src_models_sortmodel_.md#sortdirection)[], `current?`: [SortDirection](_src_models_sortmodel_.md#sortdirection)): _undefined | null | "asc" | "desc"_

_Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:3](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L3)_

**Parameters:**

| Name           | Type                                                       |
| -------------- | ---------------------------------------------------------- |
| `sortingOrder` | [SortDirection](_src_models_sortmodel_.md#sortdirection)[] |
| `current?`     | [SortDirection](_src_models_sortmodel_.md#sortdirection)   |

**Returns:** _undefined | null | "asc" | "desc"_

---

### `Const` nillComparer

▸ **nillComparer**(`v1`: [CellValue](_src_models_rows_.md#cellvalue), `v2`: [CellValue](_src_models_rows_.md#cellvalue)): _number | null_

_Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:14](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L14)_

**Parameters:**

| Name | Type                                        |
| ---- | ------------------------------------------- |
| `v1` | [CellValue](_src_models_rows_.md#cellvalue) |
| `v2` | [CellValue](_src_models_rows_.md#cellvalue) |

**Returns:** _number | null_

---

### `Const` numberComparer

▸ **numberComparer**(`v1`: [CellValue](_src_models_rows_.md#cellvalue), `v2`: [CellValue](_src_models_rows_.md#cellvalue)): _number_

_Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:35](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L35)_

**Parameters:**

| Name | Type                                        |
| ---- | ------------------------------------------- |
| `v1` | [CellValue](_src_models_rows_.md#cellvalue) |
| `v2` | [CellValue](_src_models_rows_.md#cellvalue) |

**Returns:** _number_

---

### `Const` stringNumberComparer

▸ **stringNumberComparer**(`v1`: [CellValue](_src_models_rows_.md#cellvalue), `v2`: [CellValue](_src_models_rows_.md#cellvalue)): _number_

_Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L22)_

**Parameters:**

| Name | Type                                        |
| ---- | ------------------------------------------- |
| `v1` | [CellValue](_src_models_rows_.md#cellvalue) |
| `v2` | [CellValue](_src_models_rows_.md#cellvalue) |

**Returns:** _number_
