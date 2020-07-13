[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_hashGet"](_lib_lodash__hashget_.md)

# Module: "lib/lodash/\_hashGet"

## Index

### Variables

- [HASH_UNDEFINED](_lib_lodash__hashget_.md#hash_undefined)
- [hasOwnProperty](_lib_lodash__hashget_.md#hasownproperty)
- [objectProto](_lib_lodash__hashget_.md#objectproto)

### Functions

- [hashGet](_lib_lodash__hashget_.md#private-hashget)

## Variables

### HASH_UNDEFINED

• **HASH_UNDEFINED**: _string_ = "**lodash_hash_undefined**"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_hashGet.js:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_hashGet.js#L6)_

Used to stand-in for `undefined` hash values.

---

### hasOwnProperty

• **hasOwnProperty**: _hasOwnProperty_ = objectProto.hasOwnProperty

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_hashGet.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_hashGet.js#L12)_

Used to check objects for own properties.

---

### objectProto

• **objectProto**: _Object_ = Object.prototype

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_hashGet.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_hashGet.js#L9)_

Used for built-in method references.

## Functions

### `Private` hashGet

▸ **hashGet**(`key`: string): _any_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_hashGet.js:23](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_hashGet.js#L23)_

Gets the hash value for `key`.

**`name`** get

**`memberof`** Hash

**Parameters:**

| Name  | Type   | Description                  |
| ----- | ------ | ---------------------------- |
| `key` | string | The key of the value to get. |

**Returns:** _any_

Returns the entry value.
