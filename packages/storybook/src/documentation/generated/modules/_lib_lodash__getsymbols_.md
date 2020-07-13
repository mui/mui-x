[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/\_getSymbols"](_lib_lodash__getsymbols_.md)

# Module: "lib/lodash/\_getSymbols"

## Index

### Variables

- [getSymbols](_lib_lodash__getsymbols_.md#private-getsymbols)
- [nativeGetSymbols](_lib_lodash__getsymbols_.md#nativegetsymbols)
- [objectProto](_lib_lodash__getsymbols_.md#objectproto)
- [propertyIsEnumerable](_lib_lodash__getsymbols_.md#propertyisenumerable)

## Variables

### `Private` getSymbols

• **getSymbols**: _(Anonymous function)_ = !nativeGetSymbols ? stubArray : function(object) {
if (object == null) {
return [];
}
object = Object(object);
return arrayFilter(nativeGetSymbols(object), function(symbol) {
return propertyIsEnumerable.call(object, symbol);
});
}

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getSymbols.js:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getSymbols.js#L22)_

Creates an array of the own enumerable symbols of `object`.

**`param`** The object to query.

**`returns`** Returns the array of symbols.

---

### nativeGetSymbols

• **nativeGetSymbols**: _getOwnPropertySymbols_ = Object.getOwnPropertySymbols

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getSymbols.js:13](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getSymbols.js#L13)_

---

### objectProto

• **objectProto**: _Object_ = Object.prototype

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getSymbols.js:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getSymbols.js#L7)_

Used for built-in method references.

---

### propertyIsEnumerable

• **propertyIsEnumerable**: _propertyIsEnumerable_ = objectProto.propertyIsEnumerable

_Defined in [packages/grid/x-grid-modules/lib/lodash/\_getSymbols.js:10](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_getSymbols.js#L10)_

Built-in value references.
