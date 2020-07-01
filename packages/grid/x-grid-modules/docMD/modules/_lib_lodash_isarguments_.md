[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/isArguments"](_lib_lodash_isarguments_.md)

# Module: "lib/lodash/isArguments"

## Index

### Lang Variables

* [isArguments](_lib_lodash_isarguments_.md#isarguments)

### Other Variables

* [hasOwnProperty](_lib_lodash_isarguments_.md#hasownproperty)
* [objectProto](_lib_lodash_isarguments_.md#objectproto)
* [propertyIsEnumerable](_lib_lodash_isarguments_.md#propertyisenumerable)

## Lang Variables

###  isArguments

• **isArguments**: *(Anonymous function)* = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
}

*Defined in [packages/grid/x-grid-modules/lib/lodash/isArguments.js:33](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isArguments.js#L33)*

Checks if `value` is likely an `arguments` object.

**`static`** 

**`memberof`** _

**`since`** 0.1.0

**`param`** The value to check.

**`returns`** Returns `true` if `value` is an `arguments` object,
 else `false`.

**`example`** 

_.isArguments(function() { return arguments; }());
// => true

_.isArguments([1, 2, 3]);
// => false

___

## Other Variables

###  hasOwnProperty

• **hasOwnProperty**: *hasOwnProperty* = objectProto.hasOwnProperty

*Defined in [packages/grid/x-grid-modules/lib/lodash/isArguments.js:10](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isArguments.js#L10)*

Used to check objects for own properties.

___

###  objectProto

• **objectProto**: *Object* = Object.prototype

*Defined in [packages/grid/x-grid-modules/lib/lodash/isArguments.js:7](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isArguments.js#L7)*

Used for built-in method references.

___

###  propertyIsEnumerable

• **propertyIsEnumerable**: *propertyIsEnumerable* = objectProto.propertyIsEnumerable

*Defined in [packages/grid/x-grid-modules/lib/lodash/isArguments.js:13](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/isArguments.js#L13)*

Built-in value references.
