[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isArray"](_lib_lodash_isarray_.md)

# Module: "lib/lodash/isArray"

## Index

### Lang Variables

- [isArray](_lib_lodash_isarray_.md#isarray)

## Lang Variables

### isArray

• **isArray**: _isArray_ = Array.isArray

_Defined in [packages/grid/x-grid-modules/lib/lodash/isArray.js:26](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isArray.js#L26)_

Checks if `value` is classified as an `Array` object.

**`static`**

**`memberof`** \_

**`since`** 0.1.0

**`param`** The value to check.

**`returns`** Returns `true` if `value` is an array, else `false`.

**`example`**

\_.isArray([1, 2, 3]);
// => true

\_.isArray(document.body.children);
// => false

\_.isArray('abc');
// => false

_.isArray(_.noop);
// => false
