[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_equalArrays"](_lib_lodash__equalarrays_.md)

# Module: "lib/lodash/\_equalArrays"

## Index

### Variables

- [COMPARE_PARTIAL_FLAG](_lib_lodash__equalarrays_.md#compare_partial_flag)
- [COMPARE_UNORDERED_FLAG](_lib_lodash__equalarrays_.md#compare_unordered_flag)

### Functions

- [equalArrays](_lib_lodash__equalarrays_.md#private-equalarrays)

## Variables

### COMPARE_PARTIAL_FLAG

• **COMPARE_PARTIAL_FLAG**: _number_ = 1

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalArrays.js:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalArrays.js#L8)_

Used to compose bitmasks for value comparisons.

---

### COMPARE_UNORDERED_FLAG

• **COMPARE_UNORDERED_FLAG**: _number_ = 2

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalArrays.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalArrays.js#L9)_

Used to compose bitmasks for value comparisons.

## Functions

### `Private` equalArrays

▸ **equalArrays**(`array`: any[], `other`: any[], `bitmask`: number, `customizer`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `equalFunc`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `stack`: Object): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalArrays.js:24](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalArrays.js#L24)_

A specialized version of `baseIsEqualDeep` for arrays with support for
partial deep comparisons.

**Parameters:**

| Name         | Type                                                                      | Description                                            |
| ------------ | ------------------------------------------------------------------------- | ------------------------------------------------------ |
| `array`      | any[]                                                                     | The array to compare.                                  |
| `other`      | any[]                                                                     | The other array to compare.                            |
| `bitmask`    | number                                                                    | The bitmask flags. See `baseIsEqual` for more details. |
| `customizer` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to customize comparisons.                 |
| `equalFunc`  | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to determine equivalents of values.       |
| `stack`      | Object                                                                    | Tracks traversed `array` and `other` objects.          |

**Returns:** _boolean_

Returns `true` if the arrays are equivalent, else `false`.
