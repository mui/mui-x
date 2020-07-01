[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/eq"](_lib_lodash_eq_.md)

# Module: "lib/lodash/eq"

## Index

### Lang Functions

* [eq](_lib_lodash_eq_.md#eq)

## Lang Functions

###  eq

▸ **eq**(`value`: any, `other`: any): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/eq.js:35](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/eq.js#L35)*

Performs a
[`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
comparison between two values to determine if they are equivalent.

**`static`** 

**`memberof`** _

**`since`** 4.0.0

**`example`** 

var object = { 'a': 1 };
var other = { 'a': 1 };

_.eq(object, object);
// => true

_.eq(object, other);
// => false

_.eq('a', 'a');
// => true

_.eq('a', Object('a'));
// => false

_.eq(NaN, NaN);
// => true

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to compare. |
`other` | any | The other value to compare. |

**Returns:** *boolean*

Returns `true` if the values are equivalent, else `false`.
