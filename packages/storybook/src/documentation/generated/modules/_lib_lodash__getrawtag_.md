[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_getRawTag"](_lib_lodash__getrawtag_.md)

# Module: "lib/lodash/\_getRawTag"

## Index

### Variables

- [hasOwnProperty](_lib_lodash__getrawtag_.md#hasownproperty)
- [nativeObjectToString](_lib_lodash__getrawtag_.md#nativeobjecttostring)
- [objectProto](_lib_lodash__getrawtag_.md#objectproto)
- [symToStringTag](_lib_lodash__getrawtag_.md#symtostringtag)

### Functions

- [getRawTag](_lib_lodash__getrawtag_.md#private-getrawtag)

## Variables

### hasOwnProperty

• **hasOwnProperty**: _hasOwnProperty_ = objectProto.hasOwnProperty

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getRawTag.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getRawTag.js#L9)_

Used to check objects for own properties.

---

### nativeObjectToString

• **nativeObjectToString**: _toString_ = objectProto.toString

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getRawTag.js:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getRawTag.js#L16)_

Used to resolve the
[`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
of values.

---

### objectProto

• **objectProto**: _Object_ = Object.prototype

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getRawTag.js:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getRawTag.js#L6)_

Used for built-in method references.

---

### symToStringTag

• **symToStringTag**: _any_ = Symbol ? Symbol.toStringTag : undefined

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getRawTag.js:19](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getRawTag.js#L19)_

Built-in value references.

## Functions

### `Private` getRawTag

▸ **getRawTag**(`value`: any): _string_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getRawTag.js:28](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getRawTag.js#L28)_

A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.

**Parameters:**

| Name    | Type | Description         |
| ------- | ---- | ------------------- |
| `value` | any  | The value to query. |

**Returns:** _string_

Returns the raw `toStringTag`.
