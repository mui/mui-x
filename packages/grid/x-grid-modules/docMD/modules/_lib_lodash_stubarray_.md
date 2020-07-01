[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/stubArray"](_lib_lodash_stubarray_.md)

# Module: "lib/lodash/stubArray"

## Index

### Util Functions

* [stubArray](_lib_lodash_stubarray_.md#stubarray)

## Util Functions

###  stubArray

▸ **stubArray**(): *any[]*

*Defined in [packages/grid/x-grid-modules/lib/lodash/stubArray.js:21](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/stubArray.js#L21)*

This method returns a new empty array.

**`static`** 

**`memberof`** _

**`since`** 4.13.0

**`example`** 

var arrays = _.times(2, _.stubArray);

console.log(arrays);
// => [[], []]

console.log(arrays[0] === arrays[1]);
// => false

**Returns:** *any[]*

Returns the new empty array.
