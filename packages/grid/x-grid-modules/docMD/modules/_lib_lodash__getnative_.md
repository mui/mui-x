[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/_getNative"](_lib_lodash__getnative_.md)

# Module: "lib/lodash/_getNative"

## Index

### Functions

* [getNative](_lib_lodash__getnative_.md#private-getnative)

## Functions

### `Private` getNative

▸ **getNative**(`object`: Object, `key`: string): *any*

*Defined in [packages/grid/x-grid-modules/lib/lodash/_getNative.js:14](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/_getNative.js#L14)*

Gets the native function at `key` of `object`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`object` | Object | The object to query. |
`key` | string | The key of the method to get. |

**Returns:** *any*

Returns the function if it's native, else `undefined`.
