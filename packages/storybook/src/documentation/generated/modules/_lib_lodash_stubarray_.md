[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/stubArray"](_lib_lodash_stubarray_.md)

# Module: "lib/lodash/stubArray"

## Index

### Util Functions

- [stubArray](_lib_lodash_stubarray_.md#stubarray)

## Util Functions

### stubArray

▸ **stubArray**(): _any[]_

_Defined in [packages/grid/x-grid-modules/lib/lodash/stubArray.js:21](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/stubArray.js#L21)_

This method returns a new empty array.

**`static`**

**`memberof`** \_

**`since`** 4.13.0

**`example`**

var arrays = _.times(2, _.stubArray);

console.log(arrays);
// => [[], []]

console.log(arrays[0] === arrays[1]);
// => false

**Returns:** _any[]_

Returns the new empty array.
