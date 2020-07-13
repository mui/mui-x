[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_baseTimes"](_lib_lodash__basetimes_.md)

# Module: "lib/lodash/\_baseTimes"

## Index

### Functions

- [baseTimes](_lib_lodash__basetimes_.md#private-basetimes)

## Functions

### `Private` baseTimes

▸ **baseTimes**(`n`: number, `iteratee`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)): _any[]_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseTimes.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseTimes.js#L12)_

The base implementation of `_.times` without support for iteratee shorthands
or max array length checks.

**Parameters:**

| Name       | Type                                                                      | Description                               |
| ---------- | ------------------------------------------------------------------------- | ----------------------------------------- |
| `n`        | number                                                                    | The number of times to invoke `iteratee`. |
| `iteratee` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function invoked per iteration.       |

**Returns:** _any[]_

Returns the array of results.
