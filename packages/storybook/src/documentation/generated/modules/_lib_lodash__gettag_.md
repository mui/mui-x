[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_getTag"](_lib_lodash__gettag_.md)

# Module: "lib/lodash/\_getTag"

## Index

### Variables

- [dataViewCtorString](_lib_lodash__gettag_.md#dataviewctorstring)
- [dataViewTag](_lib_lodash__gettag_.md#dataviewtag)
- [getTag](_lib_lodash__gettag_.md#private-gettag)
- [mapCtorString](_lib_lodash__gettag_.md#mapctorstring)
- [mapTag](_lib_lodash__gettag_.md#maptag)
- [objectTag](_lib_lodash__gettag_.md#objecttag)
- [promiseCtorString](_lib_lodash__gettag_.md#promisectorstring)
- [promiseTag](_lib_lodash__gettag_.md#promisetag)
- [setCtorString](_lib_lodash__gettag_.md#setctorstring)
- [setTag](_lib_lodash__gettag_.md#settag)
- [weakMapCtorString](_lib_lodash__gettag_.md#weakmapctorstring)
- [weakMapTag](_lib_lodash__gettag_.md#weakmaptag)

## Variables

### dataViewCtorString

• **dataViewCtorString**: _string_ = toSource(DataView)

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:21](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L21)_

Used to detect maps, sets, and weakmaps.

---

### dataViewTag

• **dataViewTag**: _string_ = "[object DataView]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L18)_

---

### `Private` getTag

• **getTag**: _[baseGetTag](_lib_lodash__basegettag_.md#private-basegettag)_ = baseGetTag

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:34](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L34)_

Gets the `toStringTag` of `value`.

**`param`** The value to query.

**`returns`** Returns the `toStringTag`.

---

### mapCtorString

• **mapCtorString**: _string_ = toSource(Map)

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L22)_

Used to detect maps, sets, and weakmaps.

---

### mapTag

• **mapTag**: _string_ = "[object Map]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L12)_

`Object#toString` result references.

---

### objectTag

• **objectTag**: _string_ = "[object Object]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:13](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L13)_

`Object#toString` result references.

---

### promiseCtorString

• **promiseCtorString**: _string_ = toSource(Promise)

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:23](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L23)_

Used to detect maps, sets, and weakmaps.

---

### promiseTag

• **promiseTag**: _string_ = "[object Promise]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:14](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L14)_

`Object#toString` result references.

---

### setCtorString

• **setCtorString**: _string_ = toSource(Set)

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:24](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L24)_

Used to detect maps, sets, and weakmaps.

---

### setTag

• **setTag**: _string_ = "[object Set]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L15)_

`Object#toString` result references.

---

### weakMapCtorString

• **weakMapCtorString**: _string_ = toSource(WeakMap)

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:25](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L25)_

Used to detect maps, sets, and weakmaps.

---

### weakMapTag

• **weakMapTag**: _string_ = "[object WeakMap]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getTag.js:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getTag.js#L16)_

`Object#toString` result references.
