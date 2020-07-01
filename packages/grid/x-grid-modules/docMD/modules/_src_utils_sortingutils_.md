[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/utils/sortingUtils"](_src_utils_sortingutils_.md)

# Module: "src/utils/sortingUtils"

## Index

### Functions

* [dateComparer](_src_utils_sortingutils_.md#const-datecomparer)
* [isDesc](_src_utils_sortingutils_.md#const-isdesc)
* [nextSortDirection](_src_utils_sortingutils_.md#const-nextsortdirection)
* [nillComparer](_src_utils_sortingutils_.md#const-nillcomparer)
* [numberComparer](_src_utils_sortingutils_.md#const-numbercomparer)
* [stringNumberComparer](_src_utils_sortingutils_.md#const-stringnumbercomparer)

## Functions

### `Const` dateComparer

▸ **dateComparer**(`v1`: [CellValue](_src_models_rows_.md#cellvalue), `v2`: [CellValue](_src_models_rows_.md#cellvalue)): *number*

*Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:43](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | [CellValue](_src_models_rows_.md#cellvalue) |
`v2` | [CellValue](_src_models_rows_.md#cellvalue) |

**Returns:** *number*

___

### `Const` isDesc

▸ **isDesc**(`direction`: [SortDirection](_src_models_sortmodel_.md#sortdirection)): *boolean*

*Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:12](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`direction` | [SortDirection](_src_models_sortmodel_.md#sortdirection) |

**Returns:** *boolean*

___

### `Const` nextSortDirection

▸ **nextSortDirection**(`sortingOrder`: [SortDirection](_src_models_sortmodel_.md#sortdirection)[], `current?`: [SortDirection](_src_models_sortmodel_.md#sortdirection)): *undefined | null | "asc" | "desc"*

*Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:3](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`sortingOrder` | [SortDirection](_src_models_sortmodel_.md#sortdirection)[] |
`current?` | [SortDirection](_src_models_sortmodel_.md#sortdirection) |

**Returns:** *undefined | null | "asc" | "desc"*

___

### `Const` nillComparer

▸ **nillComparer**(`v1`: [CellValue](_src_models_rows_.md#cellvalue), `v2`: [CellValue](_src_models_rows_.md#cellvalue)): *number | null*

*Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:14](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | [CellValue](_src_models_rows_.md#cellvalue) |
`v2` | [CellValue](_src_models_rows_.md#cellvalue) |

**Returns:** *number | null*

___

### `Const` numberComparer

▸ **numberComparer**(`v1`: [CellValue](_src_models_rows_.md#cellvalue), `v2`: [CellValue](_src_models_rows_.md#cellvalue)): *number*

*Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:35](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | [CellValue](_src_models_rows_.md#cellvalue) |
`v2` | [CellValue](_src_models_rows_.md#cellvalue) |

**Returns:** *number*

___

### `Const` stringNumberComparer

▸ **stringNumberComparer**(`v1`: [CellValue](_src_models_rows_.md#cellvalue), `v2`: [CellValue](_src_models_rows_.md#cellvalue)): *number*

*Defined in [packages/grid/x-grid-modules/src/utils/sortingUtils.ts:22](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/sortingUtils.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`v1` | [CellValue](_src_models_rows_.md#cellvalue) |
`v2` | [CellValue](_src_models_rows_.md#cellvalue) |

**Returns:** *number*
