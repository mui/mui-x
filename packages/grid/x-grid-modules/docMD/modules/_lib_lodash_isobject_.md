[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isObject"](_lib_lodash_isobject_.md)

# Module: "lib/lodash/isObject"

## Index

### Lang Functions

* [isObject](_lib_lodash_isobject_.md#isobject)

## Lang Functions

###  isObject

▸ **isObject**(`value`: any): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/isObject.js:28](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isObject.js#L28)*

Checks if `value` is the
[language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)

**`static`** 

**`memberof`** _

**`since`** 0.1.0

**`example`** 

_.isObject({});
// => true

_.isObject([1, 2, 3]);
// => true

_.isObject(_.noop);
// => true

_.isObject(null);
// => false

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | The value to check. |

**Returns:** *boolean*

Returns `true` if `value` is an object, else `false`.
