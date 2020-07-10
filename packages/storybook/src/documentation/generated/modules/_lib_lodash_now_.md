[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/now"](_lib_lodash_now_.md)

# Module: "lib/lodash/now"

## Index

### Date Functions

* [now](_lib_lodash_now_.md#now)

## Date Functions

###  now

▸ **now**(): *number*

*Defined in [packages/grid/x-grid-modules/lib/lodash/now.js:21](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/now.js#L21)*

Gets the timestamp of the number of milliseconds that have elapsed since
the Unix epoch (1 January 1970 00:00:00 UTC).

**`static`** 

**`memberof`** _

**`since`** 2.4.0

**`example`** 

_.defer(function(stamp) {
  console.log(_.now() - stamp);
}, _.now());
// => Logs the number of milliseconds it took for the deferred invocation.

**Returns:** *number*

Returns the timestamp.
