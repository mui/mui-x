[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isFunction"](_lib_lodash_isfunction_.md)

# Module: "lib/lodash/isFunction"

## Index

### Variables

* [asyncTag](_lib_lodash_isfunction_.md#asynctag)
* [funcTag](_lib_lodash_isfunction_.md#functag)
* [genTag](_lib_lodash_isfunction_.md#gentag)
* [proxyTag](_lib_lodash_isfunction_.md#proxytag)

### Lang Functions

* [isFunction](_lib_lodash_isfunction_.md#isfunction)

## Variables

###  asyncTag

• **asyncTag**: *string* = "[object AsyncFunction]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/isFunction.js:7](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isFunction.js#L7)*

`Object#toString` result references.

___

###  funcTag

• **funcTag**: *string* = "[object Function]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/isFunction.js:8](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isFunction.js#L8)*

`Object#toString` result references.

___

###  genTag

• **genTag**: *string* = "[object GeneratorFunction]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/isFunction.js:9](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isFunction.js#L9)*

`Object#toString` result references.

___

###  proxyTag

• **proxyTag**: *string* = "[object Proxy]"

*Defined in [packages/grid/x-grid-modules/lib/lodash/isFunction.js:10](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isFunction.js#L10)*

`Object#toString` result references.

## Lang Functions

###  isFunction

▸ **isFunction**(`value`: any): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/isFunction.js:29](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isFunction.js#L29)*

Checks if `value` is classified as a `Function` object.

**`static`** 

**`memberof`** _

**`since`** 0.1.0

**`example`** 

_.isFunction(_);
// => true

_.isFunction(/abc/);
// => false

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to check. |

**Returns:** *boolean*

Returns `true` if `value` is a function, else `false`.
