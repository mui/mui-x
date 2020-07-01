[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isEqual"](_lib_lodash_isequal_.md)

# Module: "lib/lodash/isEqual"

## Index

### Lang Functions

* [isEqual](_lib_lodash_isequal_.md#isequal)

## Lang Functions

###  isEqual

▸ **isEqual**(`value`: any, `other`: any): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/isEqual.js:41](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isEqual.js#L41)*

Performs a deep comparison between two values to determine if they are
equivalent.

**Note:** This method supports comparing arrays, array buffers, booleans,
date objects, error objects, maps, numbers, `Object` objects, regexes,
sets, strings, symbols, and typed arrays. `Object` objects are compared
by their own, not inherited, enumerable properties. Functions and DOM
nodes are compared by strict equality, i.e. `===`.

**`static`** 

**`memberof`** _

**`since`** 0.1.0

**`example`** 

var object = { 'a': 1 };
var other = { 'a': 1 };

_.isEqual(object, other);
// => true

object === other;
// => false

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to compare. |
`other` | any | The other value to compare. |

**Returns:** *boolean*

Returns `true` if the values are equivalent, else `false`.
