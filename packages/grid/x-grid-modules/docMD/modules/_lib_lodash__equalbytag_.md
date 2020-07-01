[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_equalByTag"](_lib_lodash__equalbytag_.md)

# Module: "lib/lodash/_equalByTag"

## Index

### Variables

* [COMPARE_PARTIAL_FLAG](_lib_lodash__equalbytag_.md#compare_partial_flag)
* [COMPARE_UNORDERED_FLAG](_lib_lodash__equalbytag_.md#compare_unordered_flag)
* [arrayBufferTag](_lib_lodash__equalbytag_.md#arraybuffertag)
* [boolTag](_lib_lodash__equalbytag_.md#booltag)
* [dataViewTag](_lib_lodash__equalbytag_.md#dataviewtag)
* [dateTag](_lib_lodash__equalbytag_.md#datetag)
* [errorTag](_lib_lodash__equalbytag_.md#errortag)
* [mapTag](_lib_lodash__equalbytag_.md#maptag)
* [numberTag](_lib_lodash__equalbytag_.md#numbertag)
* [regexpTag](_lib_lodash__equalbytag_.md#regexptag)
* [setTag](_lib_lodash__equalbytag_.md#settag)
* [stringTag](_lib_lodash__equalbytag_.md#stringtag)
* [symbolProto](_lib_lodash__equalbytag_.md#symbolproto)
* [symbolTag](_lib_lodash__equalbytag_.md#symboltag)
* [symbolValueOf](_lib_lodash__equalbytag_.md#symbolvalueof)

### Functions

* [equalByTag](_lib_lodash__equalbytag_.md#private-equalbytag)

## Variables

###  COMPARE_PARTIAL_FLAG

• **COMPARE_PARTIAL_FLAG**: *number* = 1

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:11](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L11)*

Used to compose bitmasks for value comparisons.

___

###  COMPARE_UNORDERED_FLAG

• **COMPARE_UNORDERED_FLAG**: *number* = 2

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:12](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L12)*

Used to compose bitmasks for value comparisons.

___

###  arrayBufferTag

• **arrayBufferTag**: *string* = "[object ArrayBuffer]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:25](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L25)*

___

###  boolTag

• **boolTag**: *string* = "[object Boolean]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:15](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L15)*

`Object#toString` result references.

___

###  dataViewTag

• **dataViewTag**: *string* = "[object DataView]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:26](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L26)*

___

###  dateTag

• **dateTag**: *string* = "[object Date]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:16](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L16)*

`Object#toString` result references.

___

###  errorTag

• **errorTag**: *string* = "[object Error]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:17](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L17)*

`Object#toString` result references.

___

###  mapTag

• **mapTag**: *string* = "[object Map]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:18](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L18)*

`Object#toString` result references.

___

###  numberTag

• **numberTag**: *string* = "[object Number]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:19](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L19)*

`Object#toString` result references.

___

###  regexpTag

• **regexpTag**: *string* = "[object RegExp]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:20](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L20)*

`Object#toString` result references.

___

###  setTag

• **setTag**: *string* = "[object Set]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:21](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L21)*

`Object#toString` result references.

___

###  stringTag

• **stringTag**: *string* = "[object String]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:22](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L22)*

`Object#toString` result references.

___

###  symbolProto

• **symbolProto**: *any* = Symbol ? Symbol.prototype : undefined

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:29](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L29)*

Used to convert symbols to primitives and strings.

___

###  symbolTag

• **symbolTag**: *string* = "[object Symbol]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:23](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L23)*

`Object#toString` result references.

___

###  symbolValueOf

• **symbolValueOf**: *any* = symbolProto ? symbolProto.valueOf : undefined

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:30](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L30)*

Used to convert symbols to primitives and strings.

## Functions

### `Private` equalByTag

▸ **equalByTag**(`object`: Object, `other`: Object, `tag`: string, `bitmask`: number, `customizer`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `equalFunc`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `stack`: Object): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_equalByTag.js:49](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L49)*

A specialized version of `baseIsEqualDeep` for comparing objects of
the same `toStringTag`.

**Note:** This function only supports comparing values with tags of
`Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`object` | Object | The object to compare. |
`other` | Object | The other object to compare. |
`tag` | string | The `toStringTag` of the objects to compare. |
`bitmask` | number | The bitmask flags. See `baseIsEqual` for more details. |
`customizer` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to customize comparisons. |
`equalFunc` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to determine equivalents of values. |
`stack` | Object | Tracks traversed `object` and `other` objects. |

**Returns:** *boolean*

Returns `true` if the objects are equivalent, else `false`.
