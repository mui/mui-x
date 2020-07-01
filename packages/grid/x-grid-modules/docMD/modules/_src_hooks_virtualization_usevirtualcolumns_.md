[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/hooks/virtualization/useVirtualColumns"](_src_hooks_virtualization_usevirtualcolumns_.md)

# Module: "src/hooks/virtualization/useVirtualColumns"

## Index

### Type aliases

* [UpdateRenderedColsFnType](_src_hooks_virtualization_usevirtualcolumns_.md#updaterenderedcolsfntype)
* [UseVirtualColumnsReturnType](_src_hooks_virtualization_usevirtualcolumns_.md#usevirtualcolumnsreturntype)

### Functions

* [useVirtualColumns](_src_hooks_virtualization_usevirtualcolumns_.md#const-usevirtualcolumns)

## Type aliases

###  UpdateRenderedColsFnType

Ƭ **UpdateRenderedColsFnType**: *function*

*Defined in [packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualColumns.ts:9](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualColumns.ts#L9)*

#### Type declaration:

▸ (`containerProps`: [ContainerProps](../interfaces/_src_models_containerprops_.containerprops.md) | null, `scrollLeft`: number): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`containerProps` | [ContainerProps](../interfaces/_src_models_containerprops_.containerprops.md) &#124; null |
`scrollLeft` | number |

___

###  UseVirtualColumnsReturnType

Ƭ **UseVirtualColumnsReturnType**: *[MutableRefObject‹[RenderColumnsProps](../interfaces/_src_models_rendercontextprops_.rendercolumnsprops.md) | null›, [UpdateRenderedColsFnType](_src_hooks_virtualization_usevirtualcolumns_.md#updaterenderedcolsfntype)]*

*Defined in [packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualColumns.ts:10](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualColumns.ts#L10)*

## Functions

### `Const` useVirtualColumns

▸ **useVirtualColumns**(`options`: [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md), `apiRef`: [GridApiRef](_src_models_gridapiref_.md#gridapiref)): *[UseVirtualColumnsReturnType](_src_hooks_virtualization_usevirtualcolumns_.md#usevirtualcolumnsreturntype)*

*Defined in [packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualColumns.ts:12](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/hooks/virtualization/useVirtualColumns.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [GridOptions](../interfaces/_src_models_gridoptions_.gridoptions.md) |
`apiRef` | [GridApiRef](_src_models_gridapiref_.md#gridapiref) |

**Returns:** *[UseVirtualColumnsReturnType](_src_hooks_virtualization_usevirtualcolumns_.md#usevirtualcolumnsreturntype)*
