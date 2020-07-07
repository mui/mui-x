[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/root/useKeyboard"](_src_hooks_root_usekeyboard_.md)

# Module: "src/hooks/root/useKeyboard"

## Index

### Functions

* [getNextCellIndexes](_src_hooks_root_usekeyboard_.md#const-getnextcellindexes)
* [useKeyboard](_src_hooks_root_usekeyboard_.md#const-usekeyboard)

## Functions

### `Const` getNextCellIndexes

▸ **getNextCellIndexes**(`code`: string, `indexes`: [CellIndexCoordinates](../interfaces/_src_models_rows_.cellindexcoordinates.md)): *object*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts:29](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`code` | string |
`indexes` | [CellIndexCoordinates](../interfaces/_src_models_rows_.cellindexcoordinates.md) |

**Returns:** *object*

* **colIndex**: *number* = indexes.colIndex - 1

___

### `Const` useKeyboard

▸ **useKeyboard**(`options`: [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md), `initialised`: boolean, `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): *void*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts:47](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md) |
`initialised` | boolean |
`apiRef` | [GridApiRef](_src_models_gridapiref_.md#gridapiref) |

**Returns:** *void*
