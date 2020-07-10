[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/root/useColumns"](_src_hooks_root_usecolumns_.md)

# Module: "src/hooks/root/useColumns"

## Index

### Functions

* [filterVisible](_src_hooks_root_usecolumns_.md#filtervisible)
* [getUpdatedColumnState](_src_hooks_root_usecolumns_.md#const-getupdatedcolumnstate)
* [hydrateColumns](_src_hooks_root_usecolumns_.md#hydratecolumns)
* [resetState](_src_hooks_root_usecolumns_.md#const-resetstate)
* [toLookup](_src_hooks_root_usecolumns_.md#tolookup)
* [toMeta](_src_hooks_root_usecolumns_.md#tometa)
* [useColumns](_src_hooks_root_usecolumns_.md#usecolumns)

### Object literals

* [initialState](_src_hooks_root_usecolumns_.md#const-initialstate)

## Functions

###  filterVisible

▸ **filterVisible**(`logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `allColumns`: [Columns](_src_models_coldef_coldef_.md#columns)): *[ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)[]*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:72](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`logger` | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) |
`allColumns` | [Columns](_src_models_coldef_coldef_.md#columns) |

**Returns:** *[ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)[]*

___

### `Const` getUpdatedColumnState

▸ **getUpdatedColumnState**(`logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `state`: [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md), `columnUpdates`: [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)[]): *[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:113](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`logger` | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) |
`state` | [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md) |
`columnUpdates` | [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)[] |

**Returns:** *[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)*

___

###  hydrateColumns

▸ **hydrateColumns**(`columns`: [Columns](_src_models_coldef_coldef_.md#columns), `withCheckboxSelection`: boolean, `logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): *[Columns](_src_models_coldef_coldef_.md#columns)*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:30](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`columns` | [Columns](_src_models_coldef_coldef_.md#columns) |
`withCheckboxSelection` | boolean |
`logger` | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) |
`apiRef` | [GridApiRef](_src_models_gridapiref_.md#gridapiref) |

**Returns:** *[Columns](_src_models_coldef_coldef_.md#columns)*

___

### `Const` resetState

▸ **resetState**(`columns`: [Columns](_src_models_coldef_coldef_.md#columns), `withCheckboxSelection`: boolean, `logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): *[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:89](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L89)*

**Parameters:**

Name | Type |
------ | ------ |
`columns` | [Columns](_src_models_coldef_coldef_.md#columns) |
`withCheckboxSelection` | boolean |
`logger` | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) |
`apiRef` | [GridApiRef](_src_models_gridapiref_.md#gridapiref) |

**Returns:** *[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)*

___

###  toLookup

▸ **toLookup**(`logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `allColumns`: [Columns](_src_models_coldef_coldef_.md#columns)): *object*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:64](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L64)*

**Parameters:**

Name | Type |
------ | ------ |
`logger` | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) |
`allColumns` | [Columns](_src_models_coldef_coldef_.md#columns) |

**Returns:** *object*

* \[ **key**: *string*\]: [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)

___

###  toMeta

▸ **toMeta**(`logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `visibleColumns`: [Columns](_src_models_coldef_coldef_.md#columns)): *[ColumnsMeta](../interfaces/_src_models_coldef_coldef_.columnsmeta.md)*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:77](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`logger` | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) |
`visibleColumns` | [Columns](_src_models_coldef_coldef_.md#columns) |

**Returns:** *[ColumnsMeta](../interfaces/_src_models_coldef_coldef_.columnsmeta.md)*

___

###  useColumns

▸ **useColumns**(`options`: [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md), `columns`: [Columns](_src_models_coldef_coldef_.md#columns), `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): *[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:140](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L140)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md) |
`columns` | [Columns](_src_models_coldef_coldef_.md#columns) |
`apiRef` | [GridApiRef](_src_models_gridapiref_.md#gridapiref) |

**Returns:** *[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)*

## Object literals

### `Const` initialState

### ▪ **initialState**: *object*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:21](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L21)*

###  all

• **all**: *never[]* = []

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:23](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L23)*

###  hasColumns

• **hasColumns**: *false* = false

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:26](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L26)*

###  hasVisibleColumns

• **hasVisibleColumns**: *false* = false

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:25](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L25)*

###  lookup

• **lookup**: *object*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:24](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L24)*

#### Type declaration:

###  visible

• **visible**: *never[]* = []

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L22)*

▪ **meta**: *object*

*Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:27](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L27)*

* **positions**: *never[]* = []

* **totalWidth**: *number* = 0
