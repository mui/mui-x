[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_stackSet"](_lib_lodash__stackset_.md)

# Module: "lib/lodash/_stackSet"

## Index

### Variables

* [LARGE_ARRAY_SIZE](_lib_lodash__stackset_.md#large_array_size)

### Functions

* [stackSet](_lib_lodash__stackset_.md#private-stackset)

## Variables

###  LARGE_ARRAY_SIZE

• **LARGE_ARRAY_SIZE**: *number* = 200

*Defined in [packages/grid/x-grid-modules/lib/lodash/_stackSet.js:8](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_stackSet.js#L8)*

Used as the size to enable large array optimizations.

## Functions

### `Private` stackSet

▸ **stackSet**(`key`: string, `value`: any): *Object*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_stackSet.js:20](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_stackSet.js#L20)*

Sets the stack `key` to `value`.

**`name`** set

**`memberof`** Stack

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The key of the value to set. |
`value` | any | The value to set. |

**Returns:** *Object*

Returns the stack cache instance.
