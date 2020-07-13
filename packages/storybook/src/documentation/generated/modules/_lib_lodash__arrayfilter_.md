[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_arrayFilter"](_lib_lodash__arrayfilter_.md)

# Module: "lib/lodash/\_arrayFilter"

## Index

### Functions

- [arrayFilter](_lib_lodash__arrayfilter_.md#private-arrayfilter)

## Functions

### `Private` arrayFilter

▸ **arrayFilter**(`array`: undefined | any[], `predicate`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)): _any[]_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_arrayFilter.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_arrayFilter.js#L12)_

A specialized version of `_.filter` for arrays without support for
iteratee shorthands.

**Parameters:**

| Name        | Type                                                                      | Description                         |
| ----------- | ------------------------------------------------------------------------- | ----------------------------------- |
| `array`     | undefined &#124; any[]                                                    | -                                   |
| `predicate` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function invoked per iteration. |

**Returns:** _any[]_

Returns the new filtered array.
