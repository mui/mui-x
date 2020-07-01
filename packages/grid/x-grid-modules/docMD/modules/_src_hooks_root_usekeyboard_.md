[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/root/useKeyboard"](_src_hooks_root_usekeyboard_.md)

# Module: "src/hooks/root/useKeyboard"

## Index

### Functions

* [getNextCellIndexes](_src_hooks_root_usekeyboard_.md#const-getnextcellindexes)
* [useKeyboard](_src_hooks_root_usekeyboard_.md#const-usekeyboard)

## Functions

### `Const` getNextCellIndexes

▸ **getNextCellIndexes**(`code`: string, `indexes`: [CellIndexCoordinates](../interfaces/_src_models_rows_.cellindexcoordinates.md)): *object*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts:25](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts#L25)*

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

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts:43](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md) |
`initialised` | boolean |
`apiRef` | [GridApiRef](_src_models_gridapiref_.md#gridapiref) |

**Returns:** *void*
