[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isObjectLike"](_lib_lodash_isobjectlike_.md)

# Module: "lib/lodash/isObjectLike"

## Index

### Lang Functions

- [isObjectLike](_lib_lodash_isobjectlike_.md#isobjectlike)

## Lang Functions

### isObjectLike

▸ **isObjectLike**(`value`: any): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/isObjectLike.js:27](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isObjectLike.js#L27)_

Checks if `value` is object-like. A value is object-like if it's not `null`
and has a `typeof` result of "object".

**`static`**

**`memberof`** \_

**`since`** 4.0.0

**`example`**

\_.isObjectLike({});
// => true

\_.isObjectLike([1, 2, 3]);
// => true

_.isObjectLike(_.noop);
// => false

\_.isObjectLike(null);
// => false

**Parameters:**

| Name    | Type | Description         |
| ------- | ---- | ------------------- |
| `value` | any  | The value to check. |

**Returns:** _boolean_

Returns `true` if `value` is object-like, else `false`.
