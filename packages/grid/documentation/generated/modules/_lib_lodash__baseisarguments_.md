[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_baseIsArguments"](_lib_lodash__baseisarguments_.md)

# Module: "lib/lodash/_baseIsArguments"

## Index

### Variables

* [argsTag](_lib_lodash__baseisarguments_.md#argstag)

### Functions

* [baseIsArguments](_lib_lodash__baseisarguments_.md#private-baseisarguments)

## Variables

###  argsTag

• **argsTag**: *string* = "[object Arguments]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsArguments.js:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsArguments.js#L7)*

`Object#toString` result references.

## Functions

### `Private` baseIsArguments

▸ **baseIsArguments**(`value`: any): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsArguments.js:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsArguments.js#L16)*

The base implementation of `_.isArguments`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to check. |

**Returns:** *boolean*

Returns `true` if `value` is an `arguments` object,
