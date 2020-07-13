[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isFunction"](_lib_lodash_isfunction_.md)

# Module: "lib/lodash/isFunction"

## Index

### Variables

- [asyncTag](_lib_lodash_isfunction_.md#asynctag)
- [funcTag](_lib_lodash_isfunction_.md#functag)
- [genTag](_lib_lodash_isfunction_.md#gentag)
- [proxyTag](_lib_lodash_isfunction_.md#proxytag)

### Lang Functions

- [isFunction](_lib_lodash_isfunction_.md#isfunction)

## Variables

### asyncTag

• **asyncTag**: _string_ = "[object AsyncFunction]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/isFunction.js:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isFunction.js#L7)_

`Object#toString` result references.

---

### funcTag

• **funcTag**: _string_ = "[object Function]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/isFunction.js:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isFunction.js#L8)_

`Object#toString` result references.

---

### genTag

• **genTag**: _string_ = "[object GeneratorFunction]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/isFunction.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isFunction.js#L9)_

`Object#toString` result references.

---

### proxyTag

• **proxyTag**: _string_ = "[object Proxy]"

_Defined in [packages/grid/x-grid-modules/lib/lodash/isFunction.js:10](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isFunction.js#L10)_

`Object#toString` result references.

## Lang Functions

### isFunction

▸ **isFunction**(`value`: any): _boolean_

_Defined in [packages/grid/x-grid-modules/lib/lodash/isFunction.js:29](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isFunction.js#L29)_

Checks if `value` is classified as a `Function` object.

**`static`**

**`memberof`** \_

**`since`** 0.1.0

**`example`**

_.isFunction(_);
// => true

\_.isFunction(/abc/);
// => false

**Parameters:**

| Name    | Type | Description         |
| ------- | ---- | ------------------- |
| `value` | any  | The value to check. |

**Returns:** _boolean_

Returns `true` if `value` is a function, else `false`.
