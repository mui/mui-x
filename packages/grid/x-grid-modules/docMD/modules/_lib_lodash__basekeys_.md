[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_baseKeys"](_lib_lodash__basekeys_.md)

# Module: "lib/lodash/_baseKeys"

## Index

### Variables

* [hasOwnProperty](_lib_lodash__basekeys_.md#hasownproperty)
* [objectProto](_lib_lodash__basekeys_.md#objectproto)

### Functions

* [baseKeys](_lib_lodash__basekeys_.md#private-basekeys)

## Variables

###  hasOwnProperty

• **hasOwnProperty**: *hasOwnProperty* = objectProto.hasOwnProperty

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseKeys.js:10](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseKeys.js#L10)*

Used to check objects for own properties.

___

###  objectProto

• **objectProto**: *Object* = Object.prototype

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseKeys.js:7](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseKeys.js#L7)*

Used for built-in method references.

## Functions

### `Private` baseKeys

▸ **baseKeys**(`object`: Object): *any[]*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseKeys.js:19](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseKeys.js#L19)*

The base implementation of `_.keys` which doesn't treat sparse arrays as dense.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`object` | Object | The object to query. |

**Returns:** *any[]*

Returns the array of property names.
