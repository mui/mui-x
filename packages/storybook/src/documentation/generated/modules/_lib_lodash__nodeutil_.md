[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_nodeUtil"](_lib_lodash__nodeutil_.md)

# Module: "lib/lodash/\_nodeUtil"

## Index

### Variables

- [freeExports](_lib_lodash__nodeutil_.md#freeexports)
- [freeModule](_lib_lodash__nodeutil_.md#freemodule)
- [freeProcess](_lib_lodash__nodeutil_.md#freeprocess)
- [moduleExports](_lib_lodash__nodeutil_.md#moduleexports)
- [nodeUtil](_lib_lodash__nodeutil_.md#nodeutil)

## Variables

### freeExports

• **freeExports**: _any_ = typeof exports == 'object' && exports && !exports.nodeType && exports

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_nodeUtil.js:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js#L6)_

Detect free variable `exports`.

---

### freeModule

• **freeModule**: _false | NodeModule_ = freeExports && typeof module == 'object' && module && !module.nodeType && module

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_nodeUtil.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js#L9)_

Detect free variable `module`.

---

### freeProcess

• **freeProcess**: _any_ = moduleExports && freeGlobal.process

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_nodeUtil.js:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js#L15)_

Detect free variable `process` from Node.js.

---

### moduleExports

• **moduleExports**: _boolean_ = freeModule && freeModule.exports === freeExports

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_nodeUtil.js:12](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js#L12)_

Detect the popular CommonJS extension `module.exports`.

---

### nodeUtil

• **nodeUtil**: _any_ = (function() {
try {
return freeProcess && freeProcess.binding && freeProcess.binding('util');
} catch (e) {}
}())

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_nodeUtil.js:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_nodeUtil.js#L18)_

Used to access faster Node.js helpers.
