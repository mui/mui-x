[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_baseIsTypedArray"](_lib_lodash__baseistypedarray_.md)

# Module: "lib/lodash/\_baseIsTypedArray"

## Index

### Variables

- [argsTag](_lib_lodash__baseistypedarray_.md#argstag)
- [arrayBufferTag](_lib_lodash__baseistypedarray_.md#arraybuffertag)
- [arrayTag](_lib_lodash__baseistypedarray_.md#arraytag)
- [boolTag](_lib_lodash__baseistypedarray_.md#booltag)
- [dataViewTag](_lib_lodash__baseistypedarray_.md#dataviewtag)
- [dateTag](_lib_lodash__baseistypedarray_.md#datetag)
- [errorTag](_lib_lodash__baseistypedarray_.md#errortag)
- [float32Tag](_lib_lodash__baseistypedarray_.md#float32tag)
- [float64Tag](_lib_lodash__baseistypedarray_.md#float64tag)
- [funcTag](_lib_lodash__baseistypedarray_.md#functag)
- [int16Tag](_lib_lodash__baseistypedarray_.md#int16tag)
- [int32Tag](_lib_lodash__baseistypedarray_.md#int32tag)
- [int8Tag](_lib_lodash__baseistypedarray_.md#int8tag)
- [mapTag](_lib_lodash__baseistypedarray_.md#maptag)
- [numberTag](_lib_lodash__baseistypedarray_.md#numbertag)
- [objectTag](_lib_lodash__baseistypedarray_.md#objecttag)
- [regexpTag](_lib_lodash__baseistypedarray_.md#regexptag)
- [setTag](_lib_lodash__baseistypedarray_.md#settag)
- [stringTag](_lib_lodash__baseistypedarray_.md#stringtag)
- [typedArrayTags](_lib_lodash__baseistypedarray_.md#typedarraytags)
- [uint16Tag](_lib_lodash__baseistypedarray_.md#uint16tag)
- [uint32Tag](_lib_lodash__baseistypedarray_.md#uint32tag)
- [uint8ClampedTag](_lib_lodash__baseistypedarray_.md#uint8clampedtag)
- [uint8Tag](_lib_lodash__baseistypedarray_.md#uint8tag)
- [weakMapTag](_lib_lodash__baseistypedarray_.md#weakmaptag)

### Functions

- [baseIsTypedArray](_lib_lodash__baseistypedarray_.md#private-baseistypedarray)

## Variables

### argsTag

• **argsTag**: _string_ = "[object Arguments]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L8)_

`Object#toString` result references.

---

### arrayBufferTag

• **arrayBufferTag**: _string_ = "[object ArrayBuffer]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L22)_

---

### arrayTag

• **arrayTag**: _string_ = "[object Array]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L9)_

`Object#toString` result references.

---

### boolTag

• **boolTag**: _string_ = "[object Boolean]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:10](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L10)_

`Object#toString` result references.

---

### dataViewTag

• **dataViewTag**: _string_ = "[object DataView]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:23](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L23)_

---

### dateTag

• **dateTag**: _string_ = "[object Date]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:11](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L11)_

`Object#toString` result references.

---

### errorTag

• **errorTag**: _string_ = "[object Error]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L12)_

`Object#toString` result references.

---

### float32Tag

• **float32Tag**: _string_ = "[object Float32Array]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:24](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L24)_

---

### float64Tag

• **float64Tag**: _string_ = "[object Float64Array]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:25](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L25)_

---

### funcTag

• **funcTag**: _string_ = "[object Function]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:13](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L13)_

`Object#toString` result references.

---

### int16Tag

• **int16Tag**: _string_ = "[object Int16Array]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:27](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L27)_

---

### int32Tag

• **int32Tag**: _string_ = "[object Int32Array]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:28](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L28)_

---

### int8Tag

• **int8Tag**: _string_ = "[object Int8Array]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:26](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L26)_

---

### mapTag

• **mapTag**: _string_ = "[object Map]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:14](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L14)_

`Object#toString` result references.

---

### numberTag

• **numberTag**: _string_ = "[object Number]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L15)_

`Object#toString` result references.

---

### objectTag

• **objectTag**: _string_ = "[object Object]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L16)_

`Object#toString` result references.

---

### regexpTag

• **regexpTag**: _string_ = "[object RegExp]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:17](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L17)_

`Object#toString` result references.

---

### setTag

• **setTag**: _string_ = "[object Set]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L18)_

`Object#toString` result references.

---

### stringTag

• **stringTag**: _string_ = "[object String]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:19](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L19)_

`Object#toString` result references.

---

### typedArrayTags

• **typedArrayTags**: _[typedArrayTags](_lib_lodash__baseistypedarray_.md#typedarraytags)_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:35](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L35)_

Used to identify `toStringTag` values of typed arrays.

---

### uint16Tag

• **uint16Tag**: _string_ = "[object Uint16Array]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:31](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L31)_

---

### uint32Tag

• **uint32Tag**: _string_ = "[object Uint32Array]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:32](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L32)_

---

### uint8ClampedTag

• **uint8ClampedTag**: _string_ = "[object Uint8ClampedArray]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:30](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L30)_

---

### uint8Tag

• **uint8Tag**: _string_ = "[object Uint8Array]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:29](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L29)_

---

### weakMapTag

• **weakMapTag**: _string_ = "[object WeakMap]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:20](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L20)_

`Object#toString` result references.

## Functions

### `Private` baseIsTypedArray

▸ **baseIsTypedArray**(`value`: any): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseIsTypedArray.js:57](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseIsTypedArray.js#L57)_

The base implementation of `_.isTypedArray` without Node.js optimizations.

**Parameters:**

| Name    | Type | Description         |
| ------- | ---- | ------------------- |
| `value` | any  | The value to check. |

**Returns:** _boolean_

Returns `true` if `value` is a typed array, else `false`.
