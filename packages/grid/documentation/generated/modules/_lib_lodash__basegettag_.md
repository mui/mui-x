[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_baseGetTag"](_lib_lodash__basegettag_.md)

# Module: "lib/lodash/_baseGetTag"

## Index

### Variables

* [nullTag](_lib_lodash__basegettag_.md#nulltag)
* [symToStringTag](_lib_lodash__basegettag_.md#symtostringtag)
* [undefinedTag](_lib_lodash__basegettag_.md#undefinedtag)

### Functions

* [baseGetTag](_lib_lodash__basegettag_.md#private-basegettag)

## Variables

###  nullTag

• **nullTag**: *string* = "[object Null]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js#L8)*

`Object#toString` result references.

___

###  symToStringTag

• **symToStringTag**: *any* = Symbol ? Symbol.toStringTag : undefined

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js#L12)*

Built-in value references.

___

###  undefinedTag

• **undefinedTag**: *string* = "[object Undefined]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js#L9)*

`Object#toString` result references.

## Functions

### `Private` baseGetTag

▸ **baseGetTag**(`value`: any): *string*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js:21](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js#L21)*

The base implementation of `getTag` without fallbacks for buggy environments.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to query. |

**Returns:** *string*

Returns the `toStringTag`.
