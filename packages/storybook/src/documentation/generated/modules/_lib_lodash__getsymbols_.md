[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_getSymbols"](_lib_lodash__getsymbols_.md)

# Module: "lib/lodash/_getSymbols"

## Index

### Variables

* [getSymbols](_lib_lodash__getsymbols_.md#private-getsymbols)
* [nativeGetSymbols](_lib_lodash__getsymbols_.md#nativegetsymbols)
* [objectProto](_lib_lodash__getsymbols_.md#objectproto)
* [propertyIsEnumerable](_lib_lodash__getsymbols_.md#propertyisenumerable)

## Variables

### `Private` getSymbols

• **getSymbols**: *(Anonymous function)* = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
}

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getSymbols.js:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getSymbols.js#L22)*

Creates an array of the own enumerable symbols of `object`.

**`param`** The object to query.

**`returns`** Returns the array of symbols.

___

###  nativeGetSymbols

• **nativeGetSymbols**: *getOwnPropertySymbols* = Object.getOwnPropertySymbols

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getSymbols.js:13](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getSymbols.js#L13)*

___

###  objectProto

• **objectProto**: *Object* = Object.prototype

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getSymbols.js:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getSymbols.js#L7)*

Used for built-in method references.

___

###  propertyIsEnumerable

• **propertyIsEnumerable**: *propertyIsEnumerable* = objectProto.propertyIsEnumerable

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getSymbols.js:10](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getSymbols.js#L10)*

Built-in value references.
