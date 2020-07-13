[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/colDef/colDef"](_src_models_coldef_coldef_.md)

# Module: "src/models/colDef/colDef"

## Index

### Interfaces

- [CellParams](../interfaces/_src_models_coldef_coldef_.cellparams.md)
- [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)
- [ColParams](../interfaces/_src_models_coldef_coldef_.colparams.md)
- [ColumnsMeta](../interfaces/_src_models_coldef_coldef_.columnsmeta.md)
- [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)

### Type aliases

- [Alignement](_src_models_coldef_coldef_.md#alignement)
- [CellClassFn](_src_models_coldef_coldef_.md#cellclassfn)
- [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams)
- [CellClassPropType](_src_models_coldef_coldef_.md#cellclassproptype)
- [CellClassRules](_src_models_coldef_coldef_.md#cellclassrules)
- [ColTypeDef](_src_models_coldef_coldef_.md#coltypedef)
- [ColumnLookup](_src_models_coldef_coldef_.md#columnlookup)
- [Columns](_src_models_coldef_coldef_.md#columns)
- [ValueFormatterParams](_src_models_coldef_coldef_.md#valueformatterparams)
- [ValueGetterParams](_src_models_coldef_coldef_.md#valuegetterparams)

## Type aliases

### Alignement

Ƭ **Alignement**: _"left" | "right" | "center"_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L6)_

---

### CellClassFn

Ƭ **CellClassFn**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L8)_

#### Type declaration:

▸ (`params`: [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams)): _string | string[]_

**Parameters:**

| Name     | Type                                                             |
| -------- | ---------------------------------------------------------------- |
| `params` | [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams) |

---

### CellClassParams

Ƭ **CellClassParams**: _[CellParams](../interfaces/_src_models_coldef_coldef_.cellparams.md)_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:24](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L24)_

---

### CellClassPropType

Ƭ **CellClassPropType**: _string | string[] | [CellClassFn](_src_models_coldef_coldef_.md#cellclassfn)_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L9)_

---

### CellClassRules

Ƭ **CellClassRules**: _object_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:27](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L27)_

#### Type declaration:

- \[ **cssClass**: _string_\]: function

▸ (`params`: [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams)): _boolean_

**Parameters:**

| Name     | Type                                                             |
| -------- | ---------------------------------------------------------------- |
| `params` | [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams) |

---

### ColTypeDef

Ƭ **ColTypeDef**: _Omit‹[ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md), "field"›_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:54](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L54)_

---

### ColumnLookup

Ƭ **ColumnLookup**: _object_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:61](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L61)_

#### Type declaration:

- \[ **field**: _string_\]: [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)

---

### Columns

Ƭ **Columns**: _[ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)[]_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:53](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L53)_

---

### ValueFormatterParams

Ƭ **ValueFormatterParams**: _[CellParams](../interfaces/_src_models_coldef_coldef_.cellparams.md)_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:26](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L26)_

---

### ValueGetterParams

Ƭ **ValueGetterParams**: _[CellParams](../interfaces/_src_models_coldef_coldef_.cellparams.md)_

_Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:25](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L25)_
