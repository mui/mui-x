[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_baseGetAllKeys"](_lib_lodash__basegetallkeys_.md)

# Module: "lib/lodash/_baseGetAllKeys"

## Index

### Functions

* [baseGetAllKeys](_lib_lodash__basegetallkeys_.md#private-basegetallkeys)

## Functions

### `Private` baseGetAllKeys

▸ **baseGetAllKeys**(`object`: Object, `keysFunc`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `symbolsFunc`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)): *any[]*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseGetAllKeys.js:17](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseGetAllKeys.js#L17)*

The base implementation of `getAllKeys` and `getAllKeysIn` which uses
`keysFunc` and `symbolsFunc` to get the enumerable property names and
symbols of `object`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`object` | Object | The object to query. |
`keysFunc` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to get the keys of `object`. |
`symbolsFunc` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to get the symbols of `object`. |

**Returns:** *any[]*

Returns the array of property names and symbols.
