[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_objectToString"](_lib_lodash__objecttostring_.md)

# Module: "lib/lodash/\_objectToString"

## Index

### Variables

- [nativeObjectToString](_lib_lodash__objecttostring_.md#nativeobjecttostring)
- [objectProto](_lib_lodash__objecttostring_.md#objectproto)

### Functions

- [objectToString](_lib_lodash__objecttostring_.md#private-objecttostring)

## Variables

### nativeObjectToString

• **nativeObjectToString**: _toString_ = objectProto.toString

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_objectToString.js:11](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_objectToString.js#L11)_

Used to resolve the
[`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
of values.

---

### objectProto

• **objectProto**: _Object_ = Object.prototype

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_objectToString.js:4](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_objectToString.js#L4)_

Used for built-in method references.

## Functions

### `Private` objectToString

▸ **objectToString**(`value`: any): _string_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_objectToString.js:20](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_objectToString.js#L20)_

Converts `value` to a string using `Object.prototype.toString`.

**Parameters:**

| Name    | Type | Description           |
| ------- | ---- | --------------------- |
| `value` | any  | The value to convert. |

**Returns:** _string_

Returns the converted string.
