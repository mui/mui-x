[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/features/usePagination"](_src_hooks_features_usepagination_.md)

# Module: "src/hooks/features/usePagination"

## Index

### Interfaces

- [PaginationProps](../interfaces/_src_hooks_features_usepagination_.paginationprops.md)
- [PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)

### Type aliases

- [PageChangedParams](_src_hooks_features_usepagination_.md#pagechangedparams)

### Variables

- [UPDATE_STATE_ACTION](_src_hooks_features_usepagination_.md#const-update_state_action)

### Functions

- [getPageCount](_src_hooks_features_usepagination_.md#const-getpagecount)
- [paginationReducer](_src_hooks_features_usepagination_.md#paginationreducer)
- [updateStateAction](_src_hooks_features_usepagination_.md#updatestateaction)
- [usePagination](_src_hooks_features_usepagination_.md#const-usepagination)

## Type aliases

### PageChangedParams

Ƭ **PageChangedParams**: _[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)_

_Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:21](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L21)_

## Variables

### `Const` UPDATE_STATE_ACTION

• **UPDATE_STATE_ACTION**: _"updateState"_ = "updateState"

_Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:29](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L29)_

## Functions

### `Const` getPageCount

▸ **getPageCount**(`pageSize`: number | undefined, `rowsCount`: number): _number_

_Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:47](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L47)_

**Parameters:**

| Name        | Type                    |
| ----------- | ----------------------- |
| `pageSize`  | number &#124; undefined |
| `rowsCount` | number                  |

**Returns:** _number_

---

### paginationReducer

▸ **paginationReducer**(`state`: [PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md), `action`: object): _object | object_

_Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:37](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L37)_

**Parameters:**

▪ **state**: _[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)_

▪ **action**: _object_

| Name       | Type                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `payload?` | Partial‹[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)› |
| `type`     | string                                                                                          |

**Returns:** _object | object_

---

### updateStateAction

▸ **updateStateAction**(`state`: Partial‹[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)›): _object_

_Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:31](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L31)_

**Parameters:**

| Name    | Type                                                                                            |
| ------- | ----------------------------------------------------------------------------------------------- |
| `state` | Partial‹[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)› |

**Returns:** _object_

- **payload**: _Partial‹[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)›_

- **type**: _"updateState"_

---

### `Const` usePagination

▸ **usePagination**(`rows`: [Rows](_src_models_rows_.md#rows), `columns`: [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md), `options`: [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md), `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): _[PaginationProps](../interfaces/_src_hooks_features_usepagination_.paginationprops.md)_

_Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:51](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L51)_

**Parameters:**

| Name      | Type                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| `rows`    | [Rows](_src_models_rows_.md#rows)                                              |
| `columns` | [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md) |
| `options` | [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md)           |
| `apiRef`  | [GridApiRef](_src_models_gridapiref_.md#gridapiref)                            |

**Returns:** _[PaginationProps](../interfaces/_src_hooks_features_usepagination_.paginationprops.md)_
