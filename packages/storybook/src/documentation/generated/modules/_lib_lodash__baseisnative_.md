[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_baseIsNative"](_lib_lodash__baseisnative_.md)

# Module: "lib/lodash/\_baseIsNative"

## Index

### Variables

- [funcProto](_lib_lodash__baseisnative_.md#funcproto)
- [funcToString](_lib_lodash__baseisnative_.md#functostring)
- [hasOwnProperty](_lib_lodash__baseisnative_.md#hasownproperty)
- [objectProto](_lib_lodash__baseisnative_.md#objectproto)
- [reIsHostCtor](_lib_lodash__baseisnative_.md#reishostctor)
- [reIsNative](_lib_lodash__baseisnative_.md#reisnative)
- [reRegExpChar](_lib_lodash__baseisnative_.md#reregexpchar)

### Functions

- [baseIsNative](_lib_lodash__baseisnative_.md#private-baseisnative)

## Variables

### funcProto

• **funcProto**: _[Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)_ = Function.prototype

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsNative.js:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L18)_

Used for built-in method references.

---

### funcToString

• **funcToString**: _[toString](../interfaces/_src_utils_utils_.debouncedfunction.md#tostring)_ = funcProto.toString

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsNative.js:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L22)_

Used to resolve the decompiled source of functions.

---

### hasOwnProperty

• **hasOwnProperty**: _hasOwnProperty_ = objectProto.hasOwnProperty

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsNative.js:25](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L25)_

Used to check objects for own properties.

---

### objectProto

• **objectProto**: _Object_ = Object.prototype

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsNative.js:19](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L19)_

Used for built-in method references.

---

### reIsHostCtor

• **reIsHostCtor**: _RegExp‹›_ = /^\[object .+?Constructor\]\$/

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsNative.js:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L15)_

Used to detect host constructors (Safari).

---

### reIsNative

• **reIsNative**: _RegExp‹›_ = RegExp('^' +
funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.\*?') + '\$'
)

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsNative.js:28](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L28)_

Used to detect if a method is native.

---

### reRegExpChar

• **reRegExpChar**: _RegExp‹›_ = /[\\^\$.\*+?()[\]{}|]/g

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsNative.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L12)_

Used to match `RegExp`
[syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).

## Functions

### `Private` baseIsNative

▸ **baseIsNative**(`value`: any): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsNative.js:41](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsNative.js#L41)_

The base implementation of `_.isNative` without bad shim checks.

**Parameters:**

| Name    | Type | Description         |
| ------- | ---- | ------------------- |
| `value` | any  | The value to check. |

**Returns:** _boolean_

Returns `true` if `value` is a native function,
else `false`.
