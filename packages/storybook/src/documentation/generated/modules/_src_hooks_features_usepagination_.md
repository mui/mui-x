[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/features/usePagination"](_src_hooks_features_usepagination_.md)

# Module: "src/hooks/features/usePagination"

## Index

### Interfaces

* [PaginationProps](../interfaces/_src_hooks_features_usepagination_.paginationprops.md)
* [PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)

### Type aliases

* [PageChangedParams](_src_hooks_features_usepagination_.md#pagechangedparams)

### Variables

* [UPDATE_STATE_ACTION](_src_hooks_features_usepagination_.md#const-update_state_action)

### Functions

* [getPageCount](_src_hooks_features_usepagination_.md#const-getpagecount)
* [paginationReducer](_src_hooks_features_usepagination_.md#paginationreducer)
* [updateStateAction](_src_hooks_features_usepagination_.md#updatestateaction)
* [usePagination](_src_hooks_features_usepagination_.md#const-usepagination)

## Type aliases

###  PageChangedParams

Ƭ **PageChangedParams**: *[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)*

*Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:21](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L21)*

## Variables

### `Const` UPDATE_STATE_ACTION

• **UPDATE_STATE_ACTION**: *"updateState"* = "updateState"

*Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:29](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L29)*

## Functions

### `Const` getPageCount

▸ **getPageCount**(`pageSize`: number | undefined, `rowsCount`: number): *number*

*Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:47](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`pageSize` | number &#124; undefined |
`rowsCount` | number |

**Returns:** *number*

___

###  paginationReducer

▸ **paginationReducer**(`state`: [PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md), `action`: object): *object | object*

*Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:37](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L37)*

**Parameters:**

▪ **state**: *[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)*

▪ **action**: *object*

Name | Type |
------ | ------ |
`payload?` | Partial‹[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)› |
`type` | string |

**Returns:** *object | object*

___

###  updateStateAction

▸ **updateStateAction**(`state`: Partial‹[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)›): *object*

*Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:31](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | Partial‹[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)› |

**Returns:** *object*

* **payload**: *Partial‹[PaginationState](../interfaces/_src_hooks_features_usepagination_.paginationstate.md)›*

* **type**: *"updateState"*

___

### `Const` usePagination

▸ **usePagination**(`rows`: [Rows](_src_models_rows_.md#rows), `columns`: [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md), `options`: [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md), `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): *[PaginationProps](../interfaces/_src_hooks_features_usepagination_.paginationprops.md)*

*Defined in [packages/grid/x-grid-modules/src/hooks/features/usePagination.ts:51](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/features/usePagination.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`rows` | [Rows](_src_models_rows_.md#rows) |
`columns` | [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md) |
`options` | [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md) |
`apiRef` | [GridApiRef](_src_models_gridapiref_.md#gridapiref) |

**Returns:** *[PaginationProps](../interfaces/_src_hooks_features_usepagination_.paginationprops.md)*
