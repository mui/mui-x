[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_toSource"](_lib_lodash__tosource_.md)

# Module: "lib/lodash/\_toSource"

## Index

### Variables

- [funcProto](_lib_lodash__tosource_.md#funcproto)
- [funcToString](_lib_lodash__tosource_.md#functostring)

### Functions

- [toSource](_lib_lodash__tosource_.md#private-tosource)

## Variables

### funcProto

• **funcProto**: _[Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)_ = Function.prototype

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_toSource.js:4](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_toSource.js#L4)_

Used for built-in method references.

---

### funcToString

• **funcToString**: _[toString](../interfaces/_src_utils_utils_.debouncedfunction.md#tostring)_ = funcProto.toString

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_toSource.js:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_toSource.js#L7)_

Used to resolve the decompiled source of functions.

## Functions

### `Private` toSource

▸ **toSource**(`func`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)): _string_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_toSource.js:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_toSource.js#L16)_

Converts `func` to its source code.

**Parameters:**

| Name   | Type                                                                      | Description              |
| ------ | ------------------------------------------------------------------------- | ------------------------ |
| `func` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to convert. |

**Returns:** _string_

Returns the source code.
