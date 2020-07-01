[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_baseIsEqualDeep"](_lib_lodash__baseisequaldeep_.md)

# Module: "lib/lodash/_baseIsEqualDeep"

## Index

### Variables

* [COMPARE_PARTIAL_FLAG](_lib_lodash__baseisequaldeep_.md#compare_partial_flag)
* [argsTag](_lib_lodash__baseisequaldeep_.md#argstag)
* [arrayTag](_lib_lodash__baseisequaldeep_.md#arraytag)
* [hasOwnProperty](_lib_lodash__baseisequaldeep_.md#hasownproperty)
* [objectProto](_lib_lodash__baseisequaldeep_.md#objectproto)
* [objectTag](_lib_lodash__baseisequaldeep_.md#objecttag)

### Functions

* [baseIsEqualDeep](_lib_lodash__baseisequaldeep_.md#private-baseisequaldeep)

## Variables

###  COMPARE_PARTIAL_FLAG

• **COMPARE_PARTIAL_FLAG**: *number* = 1

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js:13](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js#L13)*

Used to compose bitmasks for value comparisons.

___

###  argsTag

• **argsTag**: *string* = "[object Arguments]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js:16](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js#L16)*

`Object#toString` result references.

___

###  arrayTag

• **arrayTag**: *string* = "[object Array]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js:17](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js#L17)*

`Object#toString` result references.

___

###  hasOwnProperty

• **hasOwnProperty**: *hasOwnProperty* = objectProto.hasOwnProperty

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js:24](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js#L24)*

Used to check objects for own properties.

___

###  objectProto

• **objectProto**: *Object* = Object.prototype

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js:21](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js#L21)*

Used for built-in method references.

___

###  objectTag

• **objectTag**: *string* = "[object Object]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js:18](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js#L18)*

`Object#toString` result references.

## Functions

### `Private` baseIsEqualDeep

▸ **baseIsEqualDeep**(`object`: Object, `other`: Object, `bitmask`: number, `customizer`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `equalFunc`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `stack`: undefined | Object): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js:40](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsEqualDeep.js#L40)*

A specialized version of `baseIsEqual` for arrays and objects which performs
deep comparisons and tracks traversed objects enabling objects with circular
references to be compared.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`object` | Object | The object to compare. |
`other` | Object | The other object to compare. |
`bitmask` | number | The bitmask flags. See `baseIsEqual` for more details. |
`customizer` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to customize comparisons. |
`equalFunc` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to determine equivalents of values. |
`stack` | undefined &#124; Object | - |

**Returns:** *boolean*

Returns `true` if the objects are equivalent, else `false`.
