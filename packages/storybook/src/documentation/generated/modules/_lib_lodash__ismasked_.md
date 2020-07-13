[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_isMasked"](_lib_lodash__ismasked_.md)

# Module: "lib/lodash/\_isMasked"

## Index

### Variables

- [maskSrcKey](_lib_lodash__ismasked_.md#masksrckey)

### Functions

- [isMasked](_lib_lodash__ismasked_.md#private-ismasked)

## Variables

### maskSrcKey

• **maskSrcKey**: _string_ = (function() {
var uid = /[^.]+\$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
return uid ? ('Symbol(src)\_1.' + uid) : '';
}())

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_isMasked.js:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_isMasked.js#L6)_

Used to detect methods masquerading as native.

## Functions

### `Private` isMasked

▸ **isMasked**(`func`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_isMasked.js:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_isMasked.js#L18)_

Checks if `func` has its source masked.

**Parameters:**

| Name   | Type                                                                      | Description            |
| ------ | ------------------------------------------------------------------------- | ---------------------- |
| `func` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to check. |

**Returns:** _boolean_

Returns `true` if `func` is masked, else `false`.
