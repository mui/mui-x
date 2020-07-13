[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_listCacheDelete"](_lib_lodash__listcachedelete_.md)

# Module: "lib/lodash/\_listCacheDelete"

## Index

### Variables

- [arrayProto](_lib_lodash__listcachedelete_.md#arrayproto)
- [splice](_lib_lodash__listcachedelete_.md#splice)

### Functions

- [listCacheDelete](_lib_lodash__listcachedelete_.md#private-listcachedelete)

## Variables

### arrayProto

• **arrayProto**: _any[]_ = Array.prototype

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_listCacheDelete.js:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_listCacheDelete.js#L6)_

Used for built-in method references.

---

### splice

• **splice**: _splice_ = arrayProto.splice

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_listCacheDelete.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_listCacheDelete.js#L9)_

Built-in value references.

## Functions

### `Private` listCacheDelete

▸ **listCacheDelete**(`key`: string): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_listCacheDelete.js:20](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_listCacheDelete.js#L20)_

Removes `key` and its value from the list cache.

**`name`** delete

**`memberof`** ListCache

**Parameters:**

| Name  | Type   | Description                     |
| ----- | ------ | ------------------------------- |
| `key` | string | The key of the value to remove. |

**Returns:** _boolean_

Returns `true` if the entry was removed, else `false`.
