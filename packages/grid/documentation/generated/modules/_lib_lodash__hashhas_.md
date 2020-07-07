[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_hashHas"](_lib_lodash__hashhas_.md)

# Module: "lib/lodash/_hashHas"

## Index

### Variables

* [hasOwnProperty](_lib_lodash__hashhas_.md#hasownproperty)
* [objectProto](_lib_lodash__hashhas_.md#objectproto)

### Functions

* [hashHas](_lib_lodash__hashhas_.md#private-hashhas)

## Variables

###  hasOwnProperty

• **hasOwnProperty**: *hasOwnProperty* = objectProto.hasOwnProperty

*Defined in [packages/grid/x-grid-modules/lib/lodash/_hashHas.js:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_hashHas.js#L9)*

Used to check objects for own properties.

___

###  objectProto

• **objectProto**: *Object* = Object.prototype

*Defined in [packages/grid/x-grid-modules/lib/lodash/_hashHas.js:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_hashHas.js#L6)*

Used for built-in method references.

## Functions

### `Private` hashHas

▸ **hashHas**(`key`: string): *boolean*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_hashHas.js:20](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/_hashHas.js#L20)*

Checks if a hash value for `key` exists.

**`name`** has

**`memberof`** Hash

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The key of the entry to check. |

**Returns:** *boolean*

Returns `true` if an entry for `key` exists, else `false`.
