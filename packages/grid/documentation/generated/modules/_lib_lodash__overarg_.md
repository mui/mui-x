[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_overArg"](_lib_lodash__overarg_.md)

# Module: "lib/lodash/_overArg"

## Index

### Functions

* [overArg](_lib_lodash__overarg_.md#private-overarg)

## Functions

### `Private` overArg

▸ **overArg**(`func`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `transform`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)): *[Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_overArg.js:11](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_overArg.js#L11)*

Creates a unary function that invokes `func` with its argument transformed.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to wrap. |
`transform` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The argument transform. |

**Returns:** *[Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)*

Returns the new function.
