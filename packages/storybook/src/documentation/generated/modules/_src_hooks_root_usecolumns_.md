[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/root/useColumns"](_src_hooks_root_usecolumns_.md)

# Module: "src/hooks/root/useColumns"

## Index

### Functions

- [filterVisible](_src_hooks_root_usecolumns_.md#filtervisible)
- [getUpdatedColumnState](_src_hooks_root_usecolumns_.md#const-getupdatedcolumnstate)
- [hydrateColumns](_src_hooks_root_usecolumns_.md#hydratecolumns)
- [resetState](_src_hooks_root_usecolumns_.md#const-resetstate)
- [toLookup](_src_hooks_root_usecolumns_.md#tolookup)
- [toMeta](_src_hooks_root_usecolumns_.md#tometa)
- [useColumns](_src_hooks_root_usecolumns_.md#usecolumns)

### Object literals

- [initialState](_src_hooks_root_usecolumns_.md#const-initialstate)

## Functions

### filterVisible

▸ **filterVisible**(`logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `allColumns`: [Columns](_src_models_coldef_coldef_.md#columns)): _[ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)[]_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:72](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L72)_

**Parameters:**

| Name         | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `logger`     | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) |
| `allColumns` | [Columns](_src_models_coldef_coldef_.md#columns)              |

**Returns:** _[ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)[]_

---

### `Const` getUpdatedColumnState

▸ **getUpdatedColumnState**(`logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `state`: [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md), `columnUpdates`: [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)[]): _[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:113](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L113)_

**Parameters:**

| Name            | Type                                                                           |
| --------------- | ------------------------------------------------------------------------------ |
| `logger`        | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md)                  |
| `state`         | [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md) |
| `columnUpdates` | [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)[]                 |

**Returns:** _[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)_

---

### hydrateColumns

▸ **hydrateColumns**(`columns`: [Columns](_src_models_coldef_coldef_.md#columns), `withCheckboxSelection`: boolean, `logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): _[Columns](_src_models_coldef_coldef_.md#columns)_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:30](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L30)_

**Parameters:**

| Name                    | Type                                                          |
| ----------------------- | ------------------------------------------------------------- |
| `columns`               | [Columns](_src_models_coldef_coldef_.md#columns)              |
| `withCheckboxSelection` | boolean                                                       |
| `logger`                | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) |
| `apiRef`                | [GridApiRef](_src_models_gridapiref_.md#gridapiref)           |

**Returns:** _[Columns](_src_models_coldef_coldef_.md#columns)_

---

### `Const` resetState

▸ **resetState**(`columns`: [Columns](_src_models_coldef_coldef_.md#columns), `withCheckboxSelection`: boolean, `logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): _[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:89](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L89)_

**Parameters:**

| Name                    | Type                                                          |
| ----------------------- | ------------------------------------------------------------- |
| `columns`               | [Columns](_src_models_coldef_coldef_.md#columns)              |
| `withCheckboxSelection` | boolean                                                       |
| `logger`                | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) |
| `apiRef`                | [GridApiRef](_src_models_gridapiref_.md#gridapiref)           |

**Returns:** _[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)_

---

### toLookup

▸ **toLookup**(`logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `allColumns`: [Columns](_src_models_coldef_coldef_.md#columns)): _object_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:64](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L64)_

**Parameters:**

| Name         | Type                                                          |
| ------------ | ------------------------------------------------------------- |
| `logger`     | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) |
| `allColumns` | [Columns](_src_models_coldef_coldef_.md#columns)              |

**Returns:** _object_

- \[ **key**: _string_\]: [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)

---

### toMeta

▸ **toMeta**(`logger`: [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md), `visibleColumns`: [Columns](_src_models_coldef_coldef_.md#columns)): _[ColumnsMeta](../interfaces/_src_models_coldef_coldef_.columnsmeta.md)_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:77](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L77)_

**Parameters:**

| Name             | Type                                                          |
| ---------------- | ------------------------------------------------------------- |
| `logger`         | [Logger](../interfaces/_src_hooks_utils_uselogger_.logger.md) |
| `visibleColumns` | [Columns](_src_models_coldef_coldef_.md#columns)              |

**Returns:** _[ColumnsMeta](../interfaces/_src_models_coldef_coldef_.columnsmeta.md)_

---

### useColumns

▸ **useColumns**(`options`: [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md), `columns`: [Columns](_src_models_coldef_coldef_.md#columns), `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): _[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:140](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L140)_

**Parameters:**

| Name      | Type                                                                 |
| --------- | -------------------------------------------------------------------- |
| `options` | [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md) |
| `columns` | [Columns](_src_models_coldef_coldef_.md#columns)                     |
| `apiRef`  | [GridApiRef](_src_models_gridapiref_.md#gridapiref)                  |

**Returns:** _[InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)_

## Object literals

### `Const` initialState

### ▪ **initialState**: _object_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:21](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L21)_

### all

• **all**: _never[]_ = []

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:23](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L23)_

### hasColumns

• **hasColumns**: _false_ = false

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:26](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L26)_

### hasVisibleColumns

• **hasVisibleColumns**: _false_ = false

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:25](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L25)_

### lookup

• **lookup**: _object_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:24](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L24)_

#### Type declaration:

### visible

• **visible**: _never[]_ = []

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L22)_

▪ **meta**: _object_

_Defined in [packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx:27](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/hooks/root/useColumns.tsx#L27)_

- **positions**: _never[]_ = []

- **totalWidth**: _number_ = 0
