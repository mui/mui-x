[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_getRawTag"](_lib_lodash__getrawtag_.md)

# Module: "lib/lodash/_getRawTag"

## Index

### Variables

* [hasOwnProperty](_lib_lodash__getrawtag_.md#hasownproperty)
* [nativeObjectToString](_lib_lodash__getrawtag_.md#nativeobjecttostring)
* [objectProto](_lib_lodash__getrawtag_.md#objectproto)
* [symToStringTag](_lib_lodash__getrawtag_.md#symtostringtag)

### Functions

* [getRawTag](_lib_lodash__getrawtag_.md#private-getrawtag)

## Variables

###  hasOwnProperty

• **hasOwnProperty**: *hasOwnProperty* = objectProto.hasOwnProperty

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getRawTag.js:9](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_getRawTag.js#L9)*

Used to check objects for own properties.

___

###  nativeObjectToString

• **nativeObjectToString**: *toString* = objectProto.toString

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getRawTag.js:16](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_getRawTag.js#L16)*

Used to resolve the
[`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
of values.

___

###  objectProto

• **objectProto**: *Object* = Object.prototype

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getRawTag.js:6](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_getRawTag.js#L6)*

Used for built-in method references.

___

###  symToStringTag

• **symToStringTag**: *any* = Symbol ? Symbol.toStringTag : undefined

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getRawTag.js:19](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_getRawTag.js#L19)*

Built-in value references.

## Functions

### `Private` getRawTag

▸ **getRawTag**(`value`: any): *string*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getRawTag.js:28](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_getRawTag.js#L28)*

A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to query. |

**Returns:** *string*

Returns the raw `toStringTag`.
