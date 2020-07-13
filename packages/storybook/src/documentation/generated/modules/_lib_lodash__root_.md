[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_root"](_lib_lodash__root_.md)

# Module: "lib/lodash/\_root"

## Index

### Variables

- [freeSelf](_lib_lodash__root_.md#freeself)
- [root](_lib_lodash__root_.md#root)

## Variables

### freeSelf

• **freeSelf**: _false | Window & globalThis_ = typeof self == 'object' && self && self.Object === Object && self

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_root.js:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_root.js#L6)_

Detect free variable `self`.

---

### root

• **root**: _any_ = freeGlobal || freeSelf || Function('return this')()

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_root.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_root.js#L9)_

Used as a reference to the global object.
