[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_baseIsEqual"](_lib_lodash__baseisequal_.md)

# Module: "lib/lodash/_baseIsEqual"

## Index

### Functions

* [baseIsEqual](_lib_lodash__baseisequal_.md#private-baseisequal)

## Functions

### `Private` baseIsEqual

▸ **baseIsEqual**(`value`: any, `other`: any, `bitmask`: boolean, `customizer`: undefined | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `stack`: undefined | Object): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsEqual.js:20](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsEqual.js#L20)*

The base implementation of `_.isEqual` which supports partial comparisons
and tracks traversed objects.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to compare. |
`other` | any | The other value to compare. |
`bitmask` | boolean | The bitmask flags.  1 - Unordered comparison  2 - Partial comparison |
`customizer` | undefined &#124; [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | - |
`stack` | undefined &#124; Object | - |

**Returns:** *boolean*

Returns `true` if the values are equivalent, else `false`.
