[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/root/useKeyboard"](_src_hooks_root_usekeyboard_.md)

# Module: "src/hooks/root/useKeyboard"

## Index

### Functions

- [getNextCellIndexes](_src_hooks_root_usekeyboard_.md#const-getnextcellindexes)
- [useKeyboard](_src_hooks_root_usekeyboard_.md#const-usekeyboard)

## Functions

### `Const` getNextCellIndexes

▸ **getNextCellIndexes**(`code`: string, `indexes`: [CellIndexCoordinates](../interfaces/_src_models_rows_.cellindexcoordinates.md)): _object_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts:29](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts#L29)_

**Parameters:**

| Name      | Type                                                                            |
| --------- | ------------------------------------------------------------------------------- |
| `code`    | string                                                                          |
| `indexes` | [CellIndexCoordinates](../interfaces/_src_models_rows_.cellindexcoordinates.md) |

**Returns:** _object_

- **colIndex**: _number_ = indexes.colIndex - 1

---

### `Const` useKeyboard

▸ **useKeyboard**(`options`: [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md), `initialised`: boolean, `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): _void_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts:47](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useKeyboard.ts#L47)_

**Parameters:**

| Name          | Type                                                                 |
| ------------- | -------------------------------------------------------------------- |
| `options`     | [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md) |
| `initialised` | boolean                                                              |
| `apiRef`      | [GridApiRef](_src_models_gridapiref_.md#gridapiref)                  |

**Returns:** _void_
