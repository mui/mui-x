[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/column-header-title"](_src_components_column_header_title_.md)

# Module: "src/components/column-header-title"

## Index

### Interfaces

- [ColumnHeaderTitleProps](../interfaces/_src_components_column_header_title_.columnheadertitleprops.md)

### Variables

- [ColumnHeaderInnerTitle](_src_components_column_header_title_.md#const-columnheaderinnertitle)

### Functions

- [ColumnHeaderTitle](_src_components_column_header_title_.md#const-columnheadertitle)

## Variables

### `Const` ColumnHeaderInnerTitle

• **ColumnHeaderInnerTitle**: _ForwardRefExoticComponent‹object & RefAttributes‹HTMLDivElement››_ = React.forwardRef<HTMLDivElement, any>((props, ref) => {
const { label, className, ...rest } = props;

return (
<div ref={ref} className={'title ' + className} {...rest} aria-label={label}>
{label}
</div>
);
})

_Defined in [packages/grid/x-grid-modules/src/components/column-header-title.tsx:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/column-header-title.tsx#L7)_

## Functions

### `Const` ColumnHeaderTitle

▸ **ColumnHeaderTitle**(`__namedParameters`: object): _Element‹›_

_Defined in [packages/grid/x-grid-modules/src/components/column-header-title.tsx:23](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/column-header-title.tsx#L23)_

**Parameters:**

▪ **\_\_namedParameters**: _object_

| Name          | Type                    |
| ------------- | ----------------------- |
| `columnWidth` | number                  |
| `description` | undefined &#124; string |
| `label`       | string                  |

**Returns:** _Element‹›_
