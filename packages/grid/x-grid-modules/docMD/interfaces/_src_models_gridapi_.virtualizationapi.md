[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/gridApi"](../modules/_src_models_gridapi_.md) › [VirtualizationApi](_src_models_gridapi_.virtualizationapi.md)

# Interface: VirtualizationApi

## Hierarchy

* **VirtualizationApi**

## Index

### Properties

* [getContainerPropsState](_src_models_gridapi_.virtualizationapi.md#getcontainerpropsstate)
* [getRenderContextState](_src_models_gridapi_.virtualizationapi.md#getrendercontextstate)
* [isColumnVisibleInWindow](_src_models_gridapi_.virtualizationapi.md#iscolumnvisibleinwindow)
* [renderPage](_src_models_gridapi_.virtualizationapi.md#renderpage)
* [scroll](_src_models_gridapi_.virtualizationapi.md#scroll)
* [scrollToIndexes](_src_models_gridapi_.virtualizationapi.md#scrolltoindexes)

## Properties

###  getContainerPropsState

• **getContainerPropsState**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:59](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L59)*

#### Type declaration:

▸ (): *[ContainerProps](_src_models_containerprops_.containerprops.md) | null*

___

###  getRenderContextState

• **getRenderContextState**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:60](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L60)*

#### Type declaration:

▸ (): *Partial‹[RenderContextProps](../modules/_src_models_rendercontextprops_.md#rendercontextprops)› | undefined*

___

###  isColumnVisibleInWindow

• **isColumnVisibleInWindow**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:58](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L58)*

#### Type declaration:

▸ (`colIndex`: number): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`colIndex` | number |

___

###  renderPage

• **renderPage**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:61](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L61)*

#### Type declaration:

▸ (`page`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`page` | number |

___

###  scroll

• **scroll**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:56](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L56)*

#### Type declaration:

▸ (`params`: Partial‹[ScrollParams](_src_hooks_utils_usescrollfn_.scrollparams.md)›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`params` | Partial‹[ScrollParams](_src_hooks_utils_usescrollfn_.scrollparams.md)› |

___

###  scrollToIndexes

• **scrollToIndexes**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:57](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/models/gridApi.ts#L57)*

#### Type declaration:

▸ (`params`: [CellIndexCoordinates](_src_models_rows_.cellindexcoordinates.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [CellIndexCoordinates](_src_models_rows_.cellindexcoordinates.md) |
