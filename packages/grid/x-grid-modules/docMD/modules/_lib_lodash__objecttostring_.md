[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_objectToString"](_lib_lodash__objecttostring_.md)

# Module: "lib/lodash/_objectToString"

## Index

### Variables

* [nativeObjectToString](_lib_lodash__objecttostring_.md#nativeobjecttostring)
* [objectProto](_lib_lodash__objecttostring_.md#objectproto)

### Functions

* [objectToString](_lib_lodash__objecttostring_.md#private-objecttostring)

## Variables

###  nativeObjectToString

• **nativeObjectToString**: *toString* = objectProto.toString

*Defined in [packages/grid/x-grid-modules/lib/lodash/_objectToString.js:11](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_objectToString.js#L11)*

Used to resolve the
[`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
of values.

___

###  objectProto

• **objectProto**: *Object* = Object.prototype

*Defined in [packages/grid/x-grid-modules/lib/lodash/_objectToString.js:4](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_objectToString.js#L4)*

Used for built-in method references.

## Functions

### `Private` objectToString

▸ **objectToString**(`value`: any): *string*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_objectToString.js:20](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_objectToString.js#L20)*

Converts `value` to a string using `Object.prototype.toString`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to convert. |

**Returns:** *string*

Returns the converted string.
