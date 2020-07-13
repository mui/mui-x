[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isLength"](_lib_lodash_islength_.md)

# Module: "lib/lodash/isLength"

## Index

### Variables

- [MAX_SAFE_INTEGER](_lib_lodash_islength_.md#max_safe_integer)

### Lang Functions

- [isLength](_lib_lodash_islength_.md#islength)

## Variables

### MAX_SAFE_INTEGER

• **MAX_SAFE_INTEGER**: _number_ = 9007199254740991

_Defined in [packages/grid/x-grid-modules/lib/lodash/isLength.js:4](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isLength.js#L4)_

Used as references for various `Number` constants.

## Lang Functions

### isLength

▸ **isLength**(`value`: any): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/isLength.js:32](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isLength.js#L32)_

Checks if `value` is a valid array-like length.

**Note:** This method is loosely based on
[`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).

**`static`**

**`memberof`** \_

**`since`** 4.0.0

**`example`**

\_.isLength(3);
// => true

\_.isLength(Number.MIN_VALUE);
// => false

\_.isLength(Infinity);
// => false

\_.isLength('3');
// => false

**Parameters:**

| Name    | Type | Description         |
| ------- | ---- | ------------------- |
| `value` | any  | The value to check. |

**Returns:** _boolean_

Returns `true` if `value` is a valid length, else `false`.
