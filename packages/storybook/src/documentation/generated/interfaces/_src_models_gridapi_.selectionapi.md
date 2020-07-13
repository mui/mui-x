[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/gridApi"](../modules/_src_models_gridapi_.md) › [SelectionApi](_src_models_gridapi_.selectionapi.md)

# Interface: SelectionApi

## Hierarchy

- **SelectionApi**

## Index

### Properties

- [getSelectedRows](_src_models_gridapi_.selectionapi.md#getselectedrows)
- [onSelectedRow](_src_models_gridapi_.selectionapi.md#onselectedrow)
- [onSelectionChanged](_src_models_gridapi_.selectionapi.md#onselectionchanged)
- [selectRow](_src_models_gridapi_.selectionapi.md#selectrow)
- [selectRows](_src_models_gridapi_.selectionapi.md#selectrows)

## Properties

### getSelectedRows

• **getSelectedRows**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:37](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L37)_

#### Type declaration:

▸ (): _[RowModel](_src_models_rows_.rowmodel.md)[]_

---

### onSelectedRow

• **onSelectedRow**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:38](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L38)_

#### Type declaration:

▸ (`handler`: function): _function_

**Parameters:**

▪ **handler**: _function_

▸ (`param`: [RowSelectedParam](_src_models_gridoptions_.rowselectedparam.md)): _void_

**Parameters:**

| Name    | Type                                                             |
| ------- | ---------------------------------------------------------------- |
| `param` | [RowSelectedParam](_src_models_gridoptions_.rowselectedparam.md) |

▸ (): _void_

---

### onSelectionChanged

• **onSelectionChanged**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:39](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L39)_

#### Type declaration:

▸ (`handler`: function): _function_

**Parameters:**

▪ **handler**: _function_

▸ (`param`: [SelectionChangedParam](_src_models_gridoptions_.selectionchangedparam.md)): _void_

**Parameters:**

| Name    | Type                                                                       |
| ------- | -------------------------------------------------------------------------- |
| `param` | [SelectionChangedParam](_src_models_gridoptions_.selectionchangedparam.md) |

▸ (): _void_

---

### selectRow

• **selectRow**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:35](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L35)_

#### Type declaration:

▸ (`id`: [RowId](../modules/_src_models_rows_.md#rowid), `allowMultiple?`: undefined | false | true, `isSelected?`: undefined | false | true): _void_

**Parameters:**

| Name             | Type                                           |
| ---------------- | ---------------------------------------------- |
| `id`             | [RowId](../modules/_src_models_rows_.md#rowid) |
| `allowMultiple?` | undefined &#124; false &#124; true             |
| `isSelected?`    | undefined &#124; false &#124; true             |

---

### selectRows

• **selectRows**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:36](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L36)_

#### Type declaration:

▸ (`ids`: [RowId](../modules/_src_models_rows_.md#rowid)[], `isSelected?`: undefined | false | true, `deselectOtherRows?`: undefined | false | true): _void_

**Parameters:**

| Name                 | Type                                             |
| -------------------- | ------------------------------------------------ |
| `ids`                | [RowId](../modules/_src_models_rows_.md#rowid)[] |
| `isSelected?`        | undefined &#124; false &#124; true               |
| `deselectOtherRows?` | undefined &#124; false &#124; true               |
