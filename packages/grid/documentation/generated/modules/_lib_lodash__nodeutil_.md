[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_nodeUtil"](_lib_lodash__nodeutil_.md)

# Module: "lib/lodash/_nodeUtil"

## Index

### Variables

* [freeExports](_lib_lodash__nodeutil_.md#freeexports)
* [freeModule](_lib_lodash__nodeutil_.md#freemodule)
* [freeProcess](_lib_lodash__nodeutil_.md#freeprocess)
* [moduleExports](_lib_lodash__nodeutil_.md#moduleexports)
* [nodeUtil](_lib_lodash__nodeutil_.md#nodeutil)

## Variables

###  freeExports

• **freeExports**: *any* = typeof exports == 'object' && exports && !exports.nodeType && exports

*Defined in [packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js#L6)*

Detect free variable `exports`.

___

###  freeModule

• **freeModule**: *false | NodeModule* = freeExports && typeof module == 'object' && module && !module.nodeType && module

*Defined in [packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js#L9)*

Detect free variable `module`.

___

###  freeProcess

• **freeProcess**: *any* = moduleExports && freeGlobal.process

*Defined in [packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js#L15)*

Detect free variable `process` from Node.js.

___

###  moduleExports

• **moduleExports**: *boolean* = freeModule && freeModule.exports === freeExports

*Defined in [packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js#L12)*

Detect the popular CommonJS extension `module.exports`.

___

###  nodeUtil

• **nodeUtil**: *any* = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}())

*Defined in [packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js#L18)*

Used to access faster Node.js helpers.
