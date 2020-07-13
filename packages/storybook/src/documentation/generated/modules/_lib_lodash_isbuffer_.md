[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isBuffer"](_lib_lodash_isbuffer_.md)

# Module: "lib/lodash/isBuffer"

## Index

### Lang Variables

- [isBuffer](_lib_lodash_isbuffer_.md#isbuffer)

### Other Variables

- [Buffer](_lib_lodash_isbuffer_.md#buffer)
- [freeExports](_lib_lodash_isbuffer_.md#freeexports)
- [freeModule](_lib_lodash_isbuffer_.md#freemodule)
- [moduleExports](_lib_lodash_isbuffer_.md#moduleexports)
- [nativeIsBuffer](_lib_lodash_isbuffer_.md#nativeisbuffer)

## Lang Variables

### isBuffer

• **isBuffer**: _[stubFalse](_lib_lodash_stubfalse_.md#stubfalse)_ = nativeIsBuffer || stubFalse

_Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:38](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L38)_

Checks if `value` is a buffer.

**`static`**

**`memberof`** \_

**`since`** 4.3.0

**`param`** The value to check.

**`returns`** Returns `true` if `value` is a buffer, else `false`.

**`example`**

\_.isBuffer(new Buffer(2));
// => true

\_.isBuffer(new Uint8Array(2));
// => false

---

## Other Variables

### Buffer

• **Buffer**: _any_ = moduleExports ? root.Buffer : undefined

_Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L16)_

Built-in value references.

---

### freeExports

• **freeExports**: _any_ = typeof exports == 'object' && exports && !exports.nodeType && exports

_Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L7)_

Detect free variable `exports`.

---

### freeModule

• **freeModule**: _false | NodeModule_ = freeExports && typeof module == 'object' && module && !module.nodeType && module

_Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:10](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L10)_

Detect free variable `module`.

---

### moduleExports

• **moduleExports**: _boolean_ = freeModule && freeModule.exports === freeExports

_Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:13](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L13)_

Detect the popular CommonJS extension `module.exports`.

---

### nativeIsBuffer

• **nativeIsBuffer**: _any_ = Buffer ? Buffer.isBuffer : undefined

_Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:19](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L19)_
