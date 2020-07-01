[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/gridApi"](../modules/_src_models_gridapi_.md) › [SelectionApi](_src_models_gridapi_.selectionapi.md)

# Interface: SelectionApi

## Hierarchy

* **SelectionApi**

## Index

### Properties

* [getSelectedRows](_src_models_gridapi_.selectionapi.md#getselectedrows)
* [onSelectedRow](_src_models_gridapi_.selectionapi.md#onselectedrow)
* [onSelectionChanged](_src_models_gridapi_.selectionapi.md#onselectionchanged)
* [selectRow](_src_models_gridapi_.selectionapi.md#selectrow)
* [selectRows](_src_models_gridapi_.selectionapi.md#selectrows)

## Properties

###  getSelectedRows

• **getSelectedRows**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:37](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L37)*

#### Type declaration:

▸ (): *[RowModel](_src_models_rows_.rowmodel.md)[]*

___

###  onSelectedRow

• **onSelectedRow**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:38](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L38)*

#### Type declaration:

▸ (`handler`: function): *function*

**Parameters:**

▪ **handler**: *function*

▸ (`param`: [RowSelectedParam](_src_models_gridoptions_.rowselectedparam.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`param` | [RowSelectedParam](_src_models_gridoptions_.rowselectedparam.md) |

▸ (): *void*

___

###  onSelectionChanged

• **onSelectionChanged**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:39](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L39)*

#### Type declaration:

▸ (`handler`: function): *function*

**Parameters:**

▪ **handler**: *function*

▸ (`param`: [SelectionChangedParam](_src_models_gridoptions_.selectionchangedparam.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`param` | [SelectionChangedParam](_src_models_gridoptions_.selectionchangedparam.md) |

▸ (): *void*

___

###  selectRow

• **selectRow**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:35](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L35)*

#### Type declaration:

▸ (`id`: [RowId](../modules/_src_models_rows_.md#rowid), `allowMultiple?`: undefined | false | true, `isSelected?`: undefined | false | true): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | [RowId](../modules/_src_models_rows_.md#rowid) |
`allowMultiple?` | undefined &#124; false &#124; true |
`isSelected?` | undefined &#124; false &#124; true |

___

###  selectRows

• **selectRows**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:36](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L36)*

#### Type declaration:

▸ (`ids`: [RowId](../modules/_src_models_rows_.md#rowid)[], `isSelected?`: undefined | false | true, `deselectOtherRows?`: undefined | false | true): *void*

**Parameters:**

Name | Type |
------ | ------ |
`ids` | [RowId](../modules/_src_models_rows_.md#rowid)[] |
`isSelected?` | undefined &#124; false &#124; true |
`deselectOtherRows?` | undefined &#124; false &#124; true |
