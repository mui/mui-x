[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_isMasked"](_lib_lodash__ismasked_.md)

# Module: "lib/lodash/_isMasked"

## Index

### Variables

* [maskSrcKey](_lib_lodash__ismasked_.md#masksrckey)

### Functions

* [isMasked](_lib_lodash__ismasked_.md#private-ismasked)

## Variables

###  maskSrcKey

• **maskSrcKey**: *string* = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}())

*Defined in [packages/grid/x-grid-modules/lib/lodash/_isMasked.js:6](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_isMasked.js#L6)*

Used to detect methods masquerading as native.

## Functions

### `Private` isMasked

▸ **isMasked**(`func`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_isMasked.js:18](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_isMasked.js#L18)*

Checks if `func` has its source masked.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to check. |

**Returns:** *boolean*

Returns `true` if `func` is masked, else `false`.
