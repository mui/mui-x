[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/gridApi"](../modules/_src_models_gridapi_.md) › [VirtualizationApi](_src_models_gridapi_.virtualizationapi.md)

# Interface: VirtualizationApi

## Hierarchy

- **VirtualizationApi**

## Index

### Properties

- [getContainerPropsState](_src_models_gridapi_.virtualizationapi.md#getcontainerpropsstate)
- [getRenderContextState](_src_models_gridapi_.virtualizationapi.md#getrendercontextstate)
- [isColumnVisibleInWindow](_src_models_gridapi_.virtualizationapi.md#iscolumnvisibleinwindow)
- [renderPage](_src_models_gridapi_.virtualizationapi.md#renderpage)
- [scroll](_src_models_gridapi_.virtualizationapi.md#scroll)
- [scrollToIndexes](_src_models_gridapi_.virtualizationapi.md#scrolltoindexes)

## Properties

### getContainerPropsState

• **getContainerPropsState**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:59](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L59)_

#### Type declaration:

▸ (): _[ContainerProps](_src_models_containerprops_.containerprops.md) | null_

---

### getRenderContextState

• **getRenderContextState**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:60](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L60)_

#### Type declaration:

▸ (): _Partial‹[RenderContextProps](../modules/_src_models_rendercontextprops_.md#rendercontextprops)› | undefined_

---

### isColumnVisibleInWindow

• **isColumnVisibleInWindow**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:58](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L58)_

#### Type declaration:

▸ (`colIndex`: number): _boolean_

**Parameters:**

| Name       | Type   |
| ---------- | ------ |
| `colIndex` | number |

---

### renderPage

• **renderPage**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:61](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L61)_

#### Type declaration:

▸ (`page`: number): _void_

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `page` | number |

---

### scroll

• **scroll**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:56](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L56)_

#### Type declaration:

▸ (`params`: Partial‹[ScrollParams](_src_hooks_utils_usescrollfn_.scrollparams.md)›): _void_

**Parameters:**

| Name     | Type                                                                   |
| -------- | ---------------------------------------------------------------------- |
| `params` | Partial‹[ScrollParams](_src_hooks_utils_usescrollfn_.scrollparams.md)› |

---

### scrollToIndexes

• **scrollToIndexes**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:57](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L57)_

#### Type declaration:

▸ (`params`: [CellIndexCoordinates](_src_models_rows_.cellindexcoordinates.md)): _void_

**Parameters:**

| Name     | Type                                                              |
| -------- | ----------------------------------------------------------------- |
| `params` | [CellIndexCoordinates](_src_models_rows_.cellindexcoordinates.md) |
