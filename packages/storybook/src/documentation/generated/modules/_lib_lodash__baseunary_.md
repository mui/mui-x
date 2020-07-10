[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_baseUnary"](_lib_lodash__baseunary_.md)

# Module: "lib/lodash/_baseUnary"

## Index

### Functions

* [baseUnary](_lib_lodash__baseunary_.md#private-baseunary)

## Functions

### `Private` baseUnary

▸ **baseUnary**(`func`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)): *[Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseUnary.js:10](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseUnary.js#L10)*

The base implementation of `_.unary` without support for storing metadata.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to cap arguments for. |

**Returns:** *[Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)*

Returns the new capped function.
