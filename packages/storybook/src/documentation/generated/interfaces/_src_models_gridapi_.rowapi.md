[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/gridApi"](../modules/_src_models_gridapi_.md) › [RowApi](_src_models_gridapi_.rowapi.md)

# Interface: RowApi

## Hierarchy

- **RowApi**

## Index

### Properties

- [getAllRowIds](_src_models_gridapi_.rowapi.md#getallrowids)
- [getRowFromId](_src_models_gridapi_.rowapi.md#getrowfromid)
- [getRowIdFromRowIndex](_src_models_gridapi_.rowapi.md#getrowidfromrowindex)
- [getRowIndexFromId](_src_models_gridapi_.rowapi.md#getrowindexfromid)
- [getRowModels](_src_models_gridapi_.rowapi.md#getrowmodels)
- [getRowsCount](_src_models_gridapi_.rowapi.md#getrowscount)
- [setRowModels](_src_models_gridapi_.rowapi.md#setrowmodels)
- [updateRowData](_src_models_gridapi_.rowapi.md#updaterowdata)
- [updateRowModels](_src_models_gridapi_.rowapi.md#updaterowmodels)

## Properties

### getAllRowIds

• **getAllRowIds**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:14](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L14)_

#### Type declaration:

▸ (): _[RowId](../modules/_src_models_rows_.md#rowid)[]_

---

### getRowFromId

• **getRowFromId**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:20](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L20)_

#### Type declaration:

▸ (`id`: [RowId](../modules/_src_models_rows_.md#rowid)): _[RowModel](_src_models_rows_.rowmodel.md)_

**Parameters:**

| Name | Type                                           |
| ---- | ---------------------------------------------- |
| `id` | [RowId](../modules/_src_models_rows_.md#rowid) |

---

### getRowIdFromRowIndex

• **getRowIdFromRowIndex**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L18)_

#### Type declaration:

▸ (`index`: number): _[RowId](../modules/_src_models_rows_.md#rowid)_

**Parameters:**

| Name    | Type   |
| ------- | ------ |
| `index` | number |

---

### getRowIndexFromId

• **getRowIndexFromId**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:19](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L19)_

#### Type declaration:

▸ (`id`: [RowId](../modules/_src_models_rows_.md#rowid)): _number_

**Parameters:**

| Name | Type                                           |
| ---- | ---------------------------------------------- |
| `id` | [RowId](../modules/_src_models_rows_.md#rowid) |

---

### getRowModels

• **getRowModels**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L12)_

#### Type declaration:

▸ (): _[Rows](../modules/_src_models_rows_.md#rows)_

---

### getRowsCount

• **getRowsCount**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:13](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L13)_

#### Type declaration:

▸ (): _number_

---

### setRowModels

• **setRowModels**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L15)_

#### Type declaration:

▸ (`rows`: [Rows](../modules/_src_models_rows_.md#rows)): _void_

**Parameters:**

| Name   | Type                                         |
| ------ | -------------------------------------------- |
| `rows` | [Rows](../modules/_src_models_rows_.md#rows) |

---

### updateRowData

• **updateRowData**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:17](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L17)_

#### Type declaration:

▸ (`updates`: [RowData](_src_models_rows_.rowdata.md)[]): _void_

**Parameters:**

| Name      | Type                                      |
| --------- | ----------------------------------------- |
| `updates` | [RowData](_src_models_rows_.rowdata.md)[] |

---

### updateRowModels

• **updateRowModels**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L16)_

#### Type declaration:

▸ (`updates`: Partial‹[RowModel](_src_models_rows_.rowmodel.md)›[]): _void_

**Parameters:**

| Name      | Type                                                 |
| --------- | ---------------------------------------------------- |
| `updates` | Partial‹[RowModel](_src_models_rows_.rowmodel.md)›[] |
