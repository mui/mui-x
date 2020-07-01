[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_baseIsTypedArray"](_lib_lodash__baseistypedarray_.md)

# Module: "lib/lodash/_baseIsTypedArray"

## Index

### Variables

* [argsTag](_lib_lodash__baseistypedarray_.md#argstag)
* [arrayBufferTag](_lib_lodash__baseistypedarray_.md#arraybuffertag)
* [arrayTag](_lib_lodash__baseistypedarray_.md#arraytag)
* [boolTag](_lib_lodash__baseistypedarray_.md#booltag)
* [dataViewTag](_lib_lodash__baseistypedarray_.md#dataviewtag)
* [dateTag](_lib_lodash__baseistypedarray_.md#datetag)
* [errorTag](_lib_lodash__baseistypedarray_.md#errortag)
* [float32Tag](_lib_lodash__baseistypedarray_.md#float32tag)
* [float64Tag](_lib_lodash__baseistypedarray_.md#float64tag)
* [funcTag](_lib_lodash__baseistypedarray_.md#functag)
* [int16Tag](_lib_lodash__baseistypedarray_.md#int16tag)
* [int32Tag](_lib_lodash__baseistypedarray_.md#int32tag)
* [int8Tag](_lib_lodash__baseistypedarray_.md#int8tag)
* [mapTag](_lib_lodash__baseistypedarray_.md#maptag)
* [numberTag](_lib_lodash__baseistypedarray_.md#numbertag)
* [objectTag](_lib_lodash__baseistypedarray_.md#objecttag)
* [regexpTag](_lib_lodash__baseistypedarray_.md#regexptag)
* [setTag](_lib_lodash__baseistypedarray_.md#settag)
* [stringTag](_lib_lodash__baseistypedarray_.md#stringtag)
* [typedArrayTags](_lib_lodash__baseistypedarray_.md#typedarraytags)
* [uint16Tag](_lib_lodash__baseistypedarray_.md#uint16tag)
* [uint32Tag](_lib_lodash__baseistypedarray_.md#uint32tag)
* [uint8ClampedTag](_lib_lodash__baseistypedarray_.md#uint8clampedtag)
* [uint8Tag](_lib_lodash__baseistypedarray_.md#uint8tag)
* [weakMapTag](_lib_lodash__baseistypedarray_.md#weakmaptag)

### Functions

* [baseIsTypedArray](_lib_lodash__baseistypedarray_.md#private-baseistypedarray)

## Variables

###  argsTag

• **argsTag**: *string* = "[object Arguments]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:8](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L8)*

`Object#toString` result references.

___

###  arrayBufferTag

• **arrayBufferTag**: *string* = "[object ArrayBuffer]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:22](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L22)*

___

###  arrayTag

• **arrayTag**: *string* = "[object Array]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:9](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L9)*

`Object#toString` result references.

___

###  boolTag

• **boolTag**: *string* = "[object Boolean]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:10](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L10)*

`Object#toString` result references.

___

###  dataViewTag

• **dataViewTag**: *string* = "[object DataView]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:23](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L23)*

___

###  dateTag

• **dateTag**: *string* = "[object Date]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:11](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L11)*

`Object#toString` result references.

___

###  errorTag

• **errorTag**: *string* = "[object Error]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:12](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L12)*

`Object#toString` result references.

___

###  float32Tag

• **float32Tag**: *string* = "[object Float32Array]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:24](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L24)*

___

###  float64Tag

• **float64Tag**: *string* = "[object Float64Array]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:25](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L25)*

___

###  funcTag

• **funcTag**: *string* = "[object Function]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:13](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L13)*

`Object#toString` result references.

___

###  int16Tag

• **int16Tag**: *string* = "[object Int16Array]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:27](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L27)*

___

###  int32Tag

• **int32Tag**: *string* = "[object Int32Array]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:28](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L28)*

___

###  int8Tag

• **int8Tag**: *string* = "[object Int8Array]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:26](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L26)*

___

###  mapTag

• **mapTag**: *string* = "[object Map]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:14](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L14)*

`Object#toString` result references.

___

###  numberTag

• **numberTag**: *string* = "[object Number]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:15](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L15)*

`Object#toString` result references.

___

###  objectTag

• **objectTag**: *string* = "[object Object]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:16](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L16)*

`Object#toString` result references.

___

###  regexpTag

• **regexpTag**: *string* = "[object RegExp]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:17](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L17)*

`Object#toString` result references.

___

###  setTag

• **setTag**: *string* = "[object Set]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:18](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L18)*

`Object#toString` result references.

___

###  stringTag

• **stringTag**: *string* = "[object String]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:19](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L19)*

`Object#toString` result references.

___

###  typedArrayTags

• **typedArrayTags**: *[typedArrayTags](_lib_lodash__baseistypedarray_.md#typedarraytags)*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:35](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L35)*

Used to identify `toStringTag` values of typed arrays.

___

###  uint16Tag

• **uint16Tag**: *string* = "[object Uint16Array]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:31](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L31)*

___

###  uint32Tag

• **uint32Tag**: *string* = "[object Uint32Array]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:32](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L32)*

___

###  uint8ClampedTag

• **uint8ClampedTag**: *string* = "[object Uint8ClampedArray]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:30](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L30)*

___

###  uint8Tag

• **uint8Tag**: *string* = "[object Uint8Array]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:29](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L29)*

___

###  weakMapTag

• **weakMapTag**: *string* = "[object WeakMap]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:20](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L20)*

`Object#toString` result references.

## Functions

### `Private` baseIsTypedArray

▸ **baseIsTypedArray**(`value`: any): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js:57](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L57)*

The base implementation of `_.isTypedArray` without Node.js optimizations.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to check. |

**Returns:** *boolean*

Returns `true` if `value` is a typed array, else `false`.
