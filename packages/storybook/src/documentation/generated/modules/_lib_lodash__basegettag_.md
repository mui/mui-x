[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_baseGetTag"](_lib_lodash__basegettag_.md)

# Module: "lib/lodash/\_baseGetTag"

## Index

### Variables

- [nullTag](_lib_lodash__basegettag_.md#nulltag)
- [symToStringTag](_lib_lodash__basegettag_.md#symtostringtag)
- [undefinedTag](_lib_lodash__basegettag_.md#undefinedtag)

### Functions

- [baseGetTag](_lib_lodash__basegettag_.md#private-basegettag)

## Variables

### nullTag

• **nullTag**: _string_ = "[object Null]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseGetTag.js:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js#L8)_

`Object#toString` result references.

---

### symToStringTag

• **symToStringTag**: _any_ = Symbol ? Symbol.toStringTag : undefined

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseGetTag.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js#L12)_

Built-in value references.

---

### undefinedTag

• **undefinedTag**: _string_ = "[object Undefined]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseGetTag.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js#L9)_

`Object#toString` result references.

## Functions

### `Private` baseGetTag

▸ **baseGetTag**(`value`: any): _string_

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_baseGetTag.js:21](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_baseGetTag.js#L21)_

The base implementation of `getTag` without fallbacks for buggy environments.

**Parameters:**

| Name    | Type | Description         |
| ------- | ---- | ------------------- |
| `value` | any  | The value to query. |

**Returns:** _string_

Returns the `toStringTag`.
