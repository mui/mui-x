[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_root"](_lib_lodash__root_.md)

# Module: "lib/lodash/_root"

## Index

### Variables

* [freeSelf](_lib_lodash__root_.md#freeself)
* [root](_lib_lodash__root_.md#root)

## Variables

###  freeSelf

• **freeSelf**: *false | Window & globalThis* = typeof self == 'object' && self && self.Object === Object && self

*Defined in [packages/grid/x-grid-modules/lib/lodash/_root.js:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_root.js#L6)*

Detect free variable `self`.

___

###  root

• **root**: *any* = freeGlobal || freeSelf || Function('return this')()

*Defined in [packages/grid/x-grid-modules/lib/lodash/_root.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_root.js#L9)*

Used as a reference to the global object.
