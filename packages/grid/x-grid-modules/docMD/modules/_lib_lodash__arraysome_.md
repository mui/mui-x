[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_arraySome"](_lib_lodash__arraysome_.md)

# Module: "lib/lodash/_arraySome"

## Index

### Functions

* [arraySome](_lib_lodash__arraysome_.md#private-arraysome)

## Functions

### `Private` arraySome

▸ **arraySome**(`array`: undefined | any[], `predicate`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_arraySome.js:13](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_arraySome.js#L13)*

A specialized version of `_.some` for arrays without support for iteratee
shorthands.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`array` | undefined &#124; any[] | - |
`predicate` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function invoked per iteration. |

**Returns:** *boolean*

Returns `true` if any element passes the predicate check,
 else `false`.
