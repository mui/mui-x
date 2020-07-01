[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_listCacheDelete"](_lib_lodash__listcachedelete_.md)

# Module: "lib/lodash/_listCacheDelete"

## Index

### Variables

* [arrayProto](_lib_lodash__listcachedelete_.md#arrayproto)
* [splice](_lib_lodash__listcachedelete_.md#splice)

### Functions

* [listCacheDelete](_lib_lodash__listcachedelete_.md#private-listcachedelete)

## Variables

###  arrayProto

• **arrayProto**: *any[]* = Array.prototype

*Defined in [packages/grid/x-grid-modules/lib/lodash/_listCacheDelete.js:6](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_listCacheDelete.js#L6)*

Used for built-in method references.

___

###  splice

• **splice**: *splice* = arrayProto.splice

*Defined in [packages/grid/x-grid-modules/lib/lodash/_listCacheDelete.js:9](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_listCacheDelete.js#L9)*

Built-in value references.

## Functions

### `Private` listCacheDelete

▸ **listCacheDelete**(`key`: string): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_listCacheDelete.js:20](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_listCacheDelete.js#L20)*

Removes `key` and its value from the list cache.

**`name`** delete

**`memberof`** ListCache

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The key of the value to remove. |

**Returns:** *boolean*

Returns `true` if the entry was removed, else `false`.
