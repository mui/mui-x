[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_isIndex"](_lib_lodash__isindex_.md)

# Module: "lib/lodash/\_isIndex"

## Index

### Variables

- [MAX_SAFE_INTEGER](_lib_lodash__isindex_.md#max_safe_integer)
- [reIsUint](_lib_lodash__isindex_.md#reisuint)

### Functions

- [isIndex](_lib_lodash__isindex_.md#private-isindex)

## Variables

### MAX_SAFE_INTEGER

• **MAX_SAFE_INTEGER**: _number_ = 9007199254740991

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_isIndex.js:4](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_isIndex.js#L4)_

Used as references for various `Number` constants.

---

### reIsUint

• **reIsUint**: _RegExp‹›_ = /^(?:0|[1-9]\d\*)\$/

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_isIndex.js:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_isIndex.js#L7)_

Used to detect unsigned integer values.

## Functions

### `Private` isIndex

▸ **isIndex**(`value`: any, `length`: undefined | number): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_isIndex.js:17](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_isIndex.js#L17)_

Checks if `value` is a valid array-like index.

**Parameters:**

| Name     | Type                    | Description         |
| -------- | ----------------------- | ------------------- |
| `value`  | any                     | The value to check. |
| `length` | undefined &#124; number | -                   |

**Returns:** _boolean_

Returns `true` if `value` is a valid index, else `false`.
