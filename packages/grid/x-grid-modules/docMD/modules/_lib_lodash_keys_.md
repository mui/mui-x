[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/keys"](_lib_lodash_keys_.md)

# Module: "lib/lodash/keys"

## Index

### Object Functions

* [keys](_lib_lodash_keys_.md#keys)

## Object Functions

###  keys

▸ **keys**(`object`: Object): *any[]*

*Defined in [packages/grid/x-grid-modules/lib/lodash/keys.js:35](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/keys.js#L35)*

Creates an array of the own enumerable property names of `object`.

**Note:** Non-object values are coerced to objects. See the
[ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
for more details.

**`static`** 

**`since`** 0.1.0

**`memberof`** _

**`example`** 

function Foo() {
  this.a = 1;
  this.b = 2;
}

Foo.prototype.c = 3;

_.keys(new Foo);
// => ['a', 'b'] (iteration order is not guaranteed)

_.keys('hi');
// => ['0', '1']

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`object` | Object | The object to query. |

**Returns:** *any[]*

Returns the array of property names.
