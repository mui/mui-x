[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/colDef/colDef"](_src_models_coldef_coldef_.md)

# Module: "src/models/colDef/colDef"

## Index

### Interfaces

* [CellParams](../interfaces/_src_models_coldef_coldef_.cellparams.md)
* [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)
* [ColParams](../interfaces/_src_models_coldef_coldef_.colparams.md)
* [ColumnsMeta](../interfaces/_src_models_coldef_coldef_.columnsmeta.md)
* [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md)

### Type aliases

* [Alignement](_src_models_coldef_coldef_.md#alignement)
* [CellClassFn](_src_models_coldef_coldef_.md#cellclassfn)
* [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams)
* [CellClassPropType](_src_models_coldef_coldef_.md#cellclassproptype)
* [CellClassRules](_src_models_coldef_coldef_.md#cellclassrules)
* [ColTypeDef](_src_models_coldef_coldef_.md#coltypedef)
* [ColumnLookup](_src_models_coldef_coldef_.md#columnlookup)
* [Columns](_src_models_coldef_coldef_.md#columns)
* [ValueFormatterParams](_src_models_coldef_coldef_.md#valueformatterparams)
* [ValueGetterParams](_src_models_coldef_coldef_.md#valuegetterparams)

## Type aliases

###  Alignement

Ƭ **Alignement**: *"left" | "right" | "center"*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:6](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L6)*

___

###  CellClassFn

Ƭ **CellClassFn**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L8)*

#### Type declaration:

▸ (`params`: [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams)): *string | string[]*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams) |

___

###  CellClassParams

Ƭ **CellClassParams**: *[CellParams](../interfaces/_src_models_coldef_coldef_.cellparams.md)*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:24](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L24)*

___

###  CellClassPropType

Ƭ **CellClassPropType**: *string | string[] | [CellClassFn](_src_models_coldef_coldef_.md#cellclassfn)*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:9](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L9)*

___

###  CellClassRules

Ƭ **CellClassRules**: *object*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:27](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L27)*

#### Type declaration:

* \[ **cssClass**: *string*\]: function

▸ (`params`: [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams) |

___

###  ColTypeDef

Ƭ **ColTypeDef**: *Omit‹[ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md), "field"›*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:54](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L54)*

___

###  ColumnLookup

Ƭ **ColumnLookup**: *object*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:61](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L61)*

#### Type declaration:

* \[ **field**: *string*\]: [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)

___

###  Columns

Ƭ **Columns**: *[ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md)[]*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:53](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L53)*

___

###  ValueFormatterParams

Ƭ **ValueFormatterParams**: *[CellParams](../interfaces/_src_models_coldef_coldef_.cellparams.md)*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:26](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L26)*

___

###  ValueGetterParams

Ƭ **ValueGetterParams**: *[CellParams](../interfaces/_src_models_coldef_coldef_.cellparams.md)*

*Defined in [packages/grid/x-grid-modules/src/models/colDef/colDef.ts:25](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/colDef/colDef.ts#L25)*
