[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_equalByTag"](_lib_lodash__equalbytag_.md)

# Module: "lib/lodash/\_equalByTag"

## Index

### Variables

- [COMPARE_PARTIAL_FLAG](_lib_lodash__equalbytag_.md#compare_partial_flag)
- [COMPARE_UNORDERED_FLAG](_lib_lodash__equalbytag_.md#compare_unordered_flag)
- [arrayBufferTag](_lib_lodash__equalbytag_.md#arraybuffertag)
- [boolTag](_lib_lodash__equalbytag_.md#booltag)
- [dataViewTag](_lib_lodash__equalbytag_.md#dataviewtag)
- [dateTag](_lib_lodash__equalbytag_.md#datetag)
- [errorTag](_lib_lodash__equalbytag_.md#errortag)
- [mapTag](_lib_lodash__equalbytag_.md#maptag)
- [numberTag](_lib_lodash__equalbytag_.md#numbertag)
- [regexpTag](_lib_lodash__equalbytag_.md#regexptag)
- [setTag](_lib_lodash__equalbytag_.md#settag)
- [stringTag](_lib_lodash__equalbytag_.md#stringtag)
- [symbolProto](_lib_lodash__equalbytag_.md#symbolproto)
- [symbolTag](_lib_lodash__equalbytag_.md#symboltag)
- [symbolValueOf](_lib_lodash__equalbytag_.md#symbolvalueof)

### Functions

- [equalByTag](_lib_lodash__equalbytag_.md#private-equalbytag)

## Variables

### COMPARE_PARTIAL_FLAG

• **COMPARE_PARTIAL_FLAG**: _number_ = 1

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:11](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L11)_

Used to compose bitmasks for value comparisons.

---

### COMPARE_UNORDERED_FLAG

• **COMPARE_UNORDERED_FLAG**: _number_ = 2

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L12)_

Used to compose bitmasks for value comparisons.

---

### arrayBufferTag

• **arrayBufferTag**: _string_ = "[object ArrayBuffer]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:25](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L25)_

---

### boolTag

• **boolTag**: _string_ = "[object Boolean]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L15)_

`Object#toString` result references.

---

### dataViewTag

• **dataViewTag**: _string_ = "[object DataView]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:26](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L26)_

---

### dateTag

• **dateTag**: _string_ = "[object Date]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L16)_

`Object#toString` result references.

---

### errorTag

• **errorTag**: _string_ = "[object Error]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:17](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L17)_

`Object#toString` result references.

---

### mapTag

• **mapTag**: _string_ = "[object Map]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L18)_

`Object#toString` result references.

---

### numberTag

• **numberTag**: _string_ = "[object Number]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:19](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L19)_

`Object#toString` result references.

---

### regexpTag

• **regexpTag**: _string_ = "[object RegExp]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:20](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L20)_

`Object#toString` result references.

---

### setTag

• **setTag**: _string_ = "[object Set]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:21](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L21)_

`Object#toString` result references.

---

### stringTag

• **stringTag**: _string_ = "[object String]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L22)_

`Object#toString` result references.

---

### symbolProto

• **symbolProto**: _any_ = Symbol ? Symbol.prototype : undefined

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:29](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L29)_

Used to convert symbols to primitives and strings.

---

### symbolTag

• **symbolTag**: _string_ = "[object Symbol]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:23](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L23)_

`Object#toString` result references.

---

### symbolValueOf

• **symbolValueOf**: _any_ = symbolProto ? symbolProto.valueOf : undefined

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:30](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L30)_

Used to convert symbols to primitives and strings.

## Functions

### `Private` equalByTag

▸ **equalByTag**(`object`: Object, `other`: Object, `tag`: string, `bitmask`: number, `customizer`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `equalFunc`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `stack`: Object): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_equalByTag.js:49](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_equalByTag.js#L49)_

A specialized version of `baseIsEqualDeep` for comparing objects of
the same `toStringTag`.

**Note:** This function only supports comparing values with tags of
`Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.

**Parameters:**

| Name         | Type                                                                      | Description                                            |
| ------------ | ------------------------------------------------------------------------- | ------------------------------------------------------ |
| `object`     | Object                                                                    | The object to compare.                                 |
| `other`      | Object                                                                    | The other object to compare.                           |
| `tag`        | string                                                                    | The `toStringTag` of the objects to compare.           |
| `bitmask`    | number                                                                    | The bitmask flags. See `baseIsEqual` for more details. |
| `customizer` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to customize comparisons.                 |
| `equalFunc`  | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to determine equivalents of values.       |
| `stack`      | Object                                                                    | Tracks traversed `object` and `other` objects.         |

**Returns:** _boolean_

Returns `true` if the objects are equivalent, else `false`.
