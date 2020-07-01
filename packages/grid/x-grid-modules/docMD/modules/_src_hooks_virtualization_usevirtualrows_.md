[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/virtualization/useVirtualRows"](_src_hooks_virtualization_usevirtualrows_.md)

# Module: "src/hooks/virtualization/useVirtualRows"

## Index

### Type aliases

* [UseVirtualRowsReturnType](_src_hooks_virtualization_usevirtualrows_.md#usevirtualrowsreturntype)

### Variables

* [SCROLL_EVENT](_src_hooks_virtualization_usevirtualrows_.md#const-scroll_event)

### Functions

* [useVirtualRows](_src_hooks_virtualization_usevirtualrows_.md#const-usevirtualrows)

## Type aliases

###  UseVirtualRowsReturnType

Ƭ **UseVirtualRowsReturnType**: *Partial‹[RenderContextProps](_src_models_rendercontextprops_.md#rendercontextprops)› | null*

*Defined in [packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualRows.ts:24](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualRows.ts#L24)*

## Variables

### `Const` SCROLL_EVENT

• **SCROLL_EVENT**: *"scroll"* = "scroll"

*Defined in [packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualRows.ts:23](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualRows.ts#L23)*

## Functions

### `Const` useVirtualRows

▸ **useVirtualRows**(`colRef`: MutableRefObject‹HTMLDivElement | null›, `windowRef`: MutableRefObject‹HTMLDivElement | null›, `renderingZoneRef`: MutableRefObject‹HTMLDivElement | null›, `internalColumns`: [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md), `rows`: [Rows](_src_models_rows_.md#rows), `options`: [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md), `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): *[UseVirtualRowsReturnType](_src_hooks_virtualization_usevirtualrows_.md#usevirtualrowsreturntype)*

*Defined in [packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualRows.ts:26](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualRows.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`colRef` | MutableRefObject‹HTMLDivElement &#124; null› |
`windowRef` | MutableRefObject‹HTMLDivElement &#124; null› |
`renderingZoneRef` | MutableRefObject‹HTMLDivElement &#124; null› |
`internalColumns` | [InternalColumns](../interfaces/_src_models_coldef_coldef_.internalcolumns.md) |
`rows` | [Rows](_src_models_rows_.md#rows) |
`options` | [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md) |
`apiRef` | [GridApiRef](_src_models_gridapiref_.md#gridapiref) |

**Returns:** *[UseVirtualRowsReturnType](_src_hooks_virtualization_usevirtualrows_.md#usevirtualrowsreturntype)*
