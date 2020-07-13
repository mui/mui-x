[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isTypedArray"](_lib_lodash_istypedarray_.md)

# Module: "lib/lodash/isTypedArray"

## Index

### Lang Variables

- [isTypedArray](_lib_lodash_istypedarray_.md#istypedarray)

### Other Variables

- [nodeIsTypedArray](_lib_lodash_istypedarray_.md#nodeistypedarray)

## Lang Variables

### isTypedArray

• **isTypedArray**: _[Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)_ = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray

_Defined in [packages/grid/x-grid-modules/lib/lodash/isTypedArray.js:27](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isTypedArray.js#L27)_

Checks if `value` is classified as a typed array.

**`static`**

**`memberof`** \_

**`since`** 3.0.0

**`param`** The value to check.

**`returns`** Returns `true` if `value` is a typed array, else `false`.

**`example`**

\_.isTypedArray(new Uint8Array);
// => true

\_.isTypedArray([]);
// => false

---

## Other Variables

### nodeIsTypedArray

• **nodeIsTypedArray**: _any_ = nodeUtil && nodeUtil.isTypedArray

_Defined in [packages/grid/x-grid-modules/lib/lodash/isTypedArray.js:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isTypedArray.js#L8)_
