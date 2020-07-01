[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_isIndex"](_lib_lodash__isindex_.md)

# Module: "lib/lodash/_isIndex"

## Index

### Variables

* [MAX_SAFE_INTEGER](_lib_lodash__isindex_.md#max_safe_integer)
* [reIsUint](_lib_lodash__isindex_.md#reisuint)

### Functions

* [isIndex](_lib_lodash__isindex_.md#private-isindex)

## Variables

###  MAX_SAFE_INTEGER

• **MAX_SAFE_INTEGER**: *number* = 9007199254740991

*Defined in [packages/grid/x-grid-modules/lib/lodash/_isIndex.js:4](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_isIndex.js#L4)*

Used as references for various `Number` constants.

___

###  reIsUint

• **reIsUint**: *RegExp‹›* = /^(?:0|[1-9]\d*)$/

*Defined in [packages/grid/x-grid-modules/lib/lodash/_isIndex.js:7](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_isIndex.js#L7)*

Used to detect unsigned integer values.

## Functions

### `Private` isIndex

▸ **isIndex**(`value`: any, `length`: undefined | number): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_isIndex.js:17](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_isIndex.js#L17)*

Checks if `value` is a valid array-like index.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to check. |
`length` | undefined &#124; number | - |

**Returns:** *boolean*

Returns `true` if `value` is a valid index, else `false`.
