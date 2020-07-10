[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_baseIsNative"](_lib_lodash__baseisnative_.md)

# Module: "lib/lodash/_baseIsNative"

## Index

### Variables

* [funcProto](_lib_lodash__baseisnative_.md#funcproto)
* [funcToString](_lib_lodash__baseisnative_.md#functostring)
* [hasOwnProperty](_lib_lodash__baseisnative_.md#hasownproperty)
* [objectProto](_lib_lodash__baseisnative_.md#objectproto)
* [reIsHostCtor](_lib_lodash__baseisnative_.md#reishostctor)
* [reIsNative](_lib_lodash__baseisnative_.md#reisnative)
* [reRegExpChar](_lib_lodash__baseisnative_.md#reregexpchar)

### Functions

* [baseIsNative](_lib_lodash__baseisnative_.md#private-baseisnative)

## Variables

###  funcProto

• **funcProto**: *[Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)* = Function.prototype

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L18)*

Used for built-in method references.

___

###  funcToString

• **funcToString**: *[toString](../interfaces/_src_utils_utils_.debouncedfunction.md#tostring)* = funcProto.toString

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L22)*

Used to resolve the decompiled source of functions.

___

###  hasOwnProperty

• **hasOwnProperty**: *hasOwnProperty* = objectProto.hasOwnProperty

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js:25](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L25)*

Used to check objects for own properties.

___

###  objectProto

• **objectProto**: *Object* = Object.prototype

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js:19](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L19)*

Used for built-in method references.

___

###  reIsHostCtor

• **reIsHostCtor**: *RegExp‹›* = /^\[object .+?Constructor\]$/

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L15)*

Used to detect host constructors (Safari).

___

###  reIsNative

• **reIsNative**: *RegExp‹›* = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
)

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js:28](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L28)*

Used to detect if a method is native.

___

###  reRegExpChar

• **reRegExpChar**: *RegExp‹›* = /[\\^$.*+?()[\]{}|]/g

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L12)*

Used to match `RegExp`
[syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).

## Functions

### `Private` baseIsNative

▸ **baseIsNative**(`value`: any): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js:41](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L41)*

The base implementation of `_.isNative` without bad shim checks.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to check. |

**Returns:** *boolean*

Returns `true` if `value` is a native function,
 else `false`.
