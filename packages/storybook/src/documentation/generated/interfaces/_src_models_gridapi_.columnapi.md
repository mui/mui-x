[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/gridApi"](../modules/_src_models_gridapi_.md) › [ColumnApi](_src_models_gridapi_.columnapi.md)

# Interface: ColumnApi

## Hierarchy

- **ColumnApi**

## Index

### Properties

- [getAllColumns](_src_models_gridapi_.columnapi.md#getallcolumns)
- [getColumnFromField](_src_models_gridapi_.columnapi.md#getcolumnfromfield)
- [getColumnIndex](_src_models_gridapi_.columnapi.md#getcolumnindex)
- [getColumnPosition](_src_models_gridapi_.columnapi.md#getcolumnposition)
- [getColumnsMeta](_src_models_gridapi_.columnapi.md#getcolumnsmeta)
- [getVisibleColumns](_src_models_gridapi_.columnapi.md#getvisiblecolumns)
- [updateColumn](_src_models_gridapi_.columnapi.md#updatecolumn)
- [updateColumns](_src_models_gridapi_.columnapi.md#updatecolumns)

## Properties

### getAllColumns

• **getAllColumns**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:25](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L25)_

#### Type declaration:

▸ (): _[Columns](../modules/_src_models_coldef_coldef_.md#columns)_

---

### getColumnFromField

• **getColumnFromField**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:24](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L24)_

#### Type declaration:

▸ (`field`: string): _[ColDef](_src_models_coldef_coldef_.coldef.md)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `field` | string |

---

### getColumnIndex

• **getColumnIndex**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:28](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L28)_

#### Type declaration:

▸ (`field`: string): _number_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `field` | string |

---

### getColumnPosition

• **getColumnPosition**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:29](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L29)_

#### Type declaration:

▸ (`field`: string): _number_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `field` | string |

---

### getColumnsMeta

• **getColumnsMeta**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:27](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L27)_

#### Type declaration:

▸ (): _[ColumnsMeta](_src_models_coldef_coldef_.columnsmeta.md)_

---

### getVisibleColumns

• **getVisibleColumns**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:26](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L26)_

#### Type declaration:

▸ (): _[Columns](../modules/_src_models_coldef_coldef_.md#columns)_

---

### updateColumn

• **updateColumn**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:30](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L30)_

#### Type declaration:

▸ (`col`: [ColDef](_src_models_coldef_coldef_.coldef.md)): _void_

**Parameters:**

| Name  | Type                                           |
| ----- | ---------------------------------------------- |
| `col` | [ColDef](_src_models_coldef_coldef_.coldef.md) |

---

### updateColumns

• **updateColumns**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:31](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L31)_

#### Type declaration:

▸ (`cols`: [ColDef](_src_models_coldef_coldef_.coldef.md)[]): _void_

**Parameters:**

| Name   | Type                                             |
| ------ | ------------------------------------------------ |
| `cols` | [ColDef](_src_models_coldef_coldef_.coldef.md)[] |
