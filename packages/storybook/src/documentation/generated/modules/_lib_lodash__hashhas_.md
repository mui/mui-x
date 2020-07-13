[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_hashHas"](_lib_lodash__hashhas_.md)

# Module: "lib/lodash/\_hashHas"

## Index

### Variables

- [hasOwnProperty](_lib_lodash__hashhas_.md#hasownproperty)
- [objectProto](_lib_lodash__hashhas_.md#objectproto)

### Functions

- [hashHas](_lib_lodash__hashhas_.md#private-hashhas)

## Variables

### hasOwnProperty

• **hasOwnProperty**: _hasOwnProperty_ = objectProto.hasOwnProperty

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_hashHas.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_hashHas.js#L9)_

Used to check objects for own properties.

---

### objectProto

• **objectProto**: _Object_ = Object.prototype

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_hashHas.js:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_hashHas.js#L6)_

Used for built-in method references.

## Functions

### `Private` hashHas

▸ **hashHas**(`key`: string): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_hashHas.js:20](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_hashHas.js#L20)_

Checks if a hash value for `key` exists.

**`name`** has

**`memberof`** Hash

**Parameters:**

| Name  | Type   | Description                    |
| ----- | ------ | ------------------------------ |
| `key` | string | The key of the entry to check. |

**Returns:** _boolean_

Returns `true` if an entry for `key` exists, else `false`.
