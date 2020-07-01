[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_equalObjects"](_lib_lodash__equalobjects_.md)

# Module: "lib/lodash/_equalObjects"

## Index

### Variables

* [COMPARE_PARTIAL_FLAG](_lib_lodash__equalobjects_.md#compare_partial_flag)
* [hasOwnProperty](_lib_lodash__equalobjects_.md#hasownproperty)
* [objectProto](_lib_lodash__equalobjects_.md#objectproto)

### Functions

* [equalObjects](_lib_lodash__equalobjects_.md#private-equalobjects)

## Variables

###  COMPARE_PARTIAL_FLAG

• **COMPARE_PARTIAL_FLAG**: *number* = 1

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalObjects.js:6](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalObjects.js#L6)*

Used to compose bitmasks for value comparisons.

___

###  hasOwnProperty

• **hasOwnProperty**: *hasOwnProperty* = objectProto.hasOwnProperty

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalObjects.js:12](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalObjects.js#L12)*

Used to check objects for own properties.

___

###  objectProto

• **objectProto**: *Object* = Object.prototype

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalObjects.js:9](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalObjects.js#L9)*

Used for built-in method references.

## Functions

### `Private` equalObjects

▸ **equalObjects**(`object`: Object, `other`: Object, `bitmask`: number, `customizer`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `equalFunc`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `stack`: Object): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalObjects.js:27](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalObjects.js#L27)*

A specialized version of `baseIsEqualDeep` for objects with support for
partial deep comparisons.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`object` | Object | The object to compare. |
`other` | Object | The other object to compare. |
`bitmask` | number | The bitmask flags. See `baseIsEqual` for more details. |
`customizer` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to customize comparisons. |
`equalFunc` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to determine equivalents of values. |
`stack` | Object | Tracks traversed `object` and `other` objects. |

**Returns:** *boolean*

Returns `true` if the objects are equivalent, else `false`.
