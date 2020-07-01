[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isBuffer"](_lib_lodash_isbuffer_.md)

# Module: "lib/lodash/isBuffer"

## Index

### Lang Variables

* [isBuffer](_lib_lodash_isbuffer_.md#isbuffer)

### Other Variables

* [Buffer](_lib_lodash_isbuffer_.md#buffer)
* [freeExports](_lib_lodash_isbuffer_.md#freeexports)
* [freeModule](_lib_lodash_isbuffer_.md#freemodule)
* [moduleExports](_lib_lodash_isbuffer_.md#moduleexports)
* [nativeIsBuffer](_lib_lodash_isbuffer_.md#nativeisbuffer)

## Lang Variables

###  isBuffer

• **isBuffer**: *[stubFalse](_lib_lodash_stubfalse_.md#stubfalse)* = nativeIsBuffer || stubFalse

*Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:38](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L38)*

Checks if `value` is a buffer.

**`static`** 

**`memberof`** _

**`since`** 4.3.0

**`param`** The value to check.

**`returns`** Returns `true` if `value` is a buffer, else `false`.

**`example`** 

_.isBuffer(new Buffer(2));
// => true

_.isBuffer(new Uint8Array(2));
// => false

___

## Other Variables

###  Buffer

• **Buffer**: *any* = moduleExports ? root.Buffer : undefined

*Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:16](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L16)*

Built-in value references.

___

###  freeExports

• **freeExports**: *any* = typeof exports == 'object' && exports && !exports.nodeType && exports

*Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:7](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L7)*

Detect free variable `exports`.

___

###  freeModule

• **freeModule**: *false | NodeModule* = freeExports && typeof module == 'object' && module && !module.nodeType && module

*Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:10](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L10)*

Detect free variable `module`.

___

###  moduleExports

• **moduleExports**: *boolean* = freeModule && freeModule.exports === freeExports

*Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:13](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L13)*

Detect the popular CommonJS extension `module.exports`.

___

###  nativeIsBuffer

• **nativeIsBuffer**: *any* = Buffer ? Buffer.isBuffer : undefined

*Defined in [packages/grid/x-grid-modules/lib/lodash/isBuffer.js:19](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isBuffer.js#L19)*
