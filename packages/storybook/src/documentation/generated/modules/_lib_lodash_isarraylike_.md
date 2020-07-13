[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isArrayLike"](_lib_lodash_isarraylike_.md)

# Module: "lib/lodash/isArrayLike"

## Index

### Lang Functions

- [isArrayLike](_lib_lodash_isarraylike_.md#isarraylike)

## Lang Functions

### isArrayLike

▸ **isArrayLike**(`value`: any): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/isArrayLike.js:31](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isArrayLike.js#L31)_

Checks if `value` is array-like. A value is considered array-like if it's
not a function and has a `value.length` that's an integer greater than or
equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.

**`static`**

**`memberof`** \_

**`since`** 4.0.0

**`example`**

\_.isArrayLike([1, 2, 3]);
// => true

\_.isArrayLike(document.body.children);
// => true

\_.isArrayLike('abc');
// => true

_.isArrayLike(_.noop);
// => false

**Parameters:**

| Name    | Type | Description         |
| ------- | ---- | ------------------- |
| `value` | any  | The value to check. |

**Returns:** _boolean_

Returns `true` if `value` is array-like, else `false`.
