[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_getTag"](_lib_lodash__gettag_.md)

# Module: "lib/lodash/_getTag"

## Index

### Variables

* [dataViewCtorString](_lib_lodash__gettag_.md#dataviewctorstring)
* [dataViewTag](_lib_lodash__gettag_.md#dataviewtag)
* [getTag](_lib_lodash__gettag_.md#private-gettag)
* [mapCtorString](_lib_lodash__gettag_.md#mapctorstring)
* [mapTag](_lib_lodash__gettag_.md#maptag)
* [objectTag](_lib_lodash__gettag_.md#objecttag)
* [promiseCtorString](_lib_lodash__gettag_.md#promisectorstring)
* [promiseTag](_lib_lodash__gettag_.md#promisetag)
* [setCtorString](_lib_lodash__gettag_.md#setctorstring)
* [setTag](_lib_lodash__gettag_.md#settag)
* [weakMapCtorString](_lib_lodash__gettag_.md#weakmapctorstring)
* [weakMapTag](_lib_lodash__gettag_.md#weakmaptag)

## Variables

###  dataViewCtorString

• **dataViewCtorString**: *string* = toSource(DataView)

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:21](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L21)*

Used to detect maps, sets, and weakmaps.

___

###  dataViewTag

• **dataViewTag**: *string* = "[object DataView]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L18)*

___

### `Private` getTag

• **getTag**: *[baseGetTag](_lib_lodash__basegettag_.md#private-basegettag)* = baseGetTag

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:34](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L34)*

Gets the `toStringTag` of `value`.

**`param`** The value to query.

**`returns`** Returns the `toStringTag`.

___

###  mapCtorString

• **mapCtorString**: *string* = toSource(Map)

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L22)*

Used to detect maps, sets, and weakmaps.

___

###  mapTag

• **mapTag**: *string* = "[object Map]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L12)*

`Object#toString` result references.

___

###  objectTag

• **objectTag**: *string* = "[object Object]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:13](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L13)*

`Object#toString` result references.

___

###  promiseCtorString

• **promiseCtorString**: *string* = toSource(Promise)

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:23](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L23)*

Used to detect maps, sets, and weakmaps.

___

###  promiseTag

• **promiseTag**: *string* = "[object Promise]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:14](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L14)*

`Object#toString` result references.

___

###  setCtorString

• **setCtorString**: *string* = toSource(Set)

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:24](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L24)*

Used to detect maps, sets, and weakmaps.

___

###  setTag

• **setTag**: *string* = "[object Set]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L15)*

`Object#toString` result references.

___

###  weakMapCtorString

• **weakMapCtorString**: *string* = toSource(WeakMap)

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:25](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L25)*

Used to detect maps, sets, and weakmaps.

___

###  weakMapTag

• **weakMapTag**: *string* = "[object WeakMap]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getTag.js:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L16)*

`Object#toString` result references.
