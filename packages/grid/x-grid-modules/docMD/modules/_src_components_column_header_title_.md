[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/column-header-title"](_src_components_column_header_title_.md)

# Module: "src/components/column-header-title"

## Index

### Interfaces

* [ColumnHeaderTitleProps](../interfaces/_src_components_column_header_title_.columnheadertitleprops.md)

### Variables

* [ColumnHeaderInnerTitle](_src_components_column_header_title_.md#const-columnheaderinnertitle)

### Functions

* [ColumnHeaderTitle](_src_components_column_header_title_.md#const-columnheadertitle)

## Variables

### `Const` ColumnHeaderInnerTitle

• **ColumnHeaderInnerTitle**: *ForwardRefExoticComponent‹object & RefAttributes‹HTMLDivElement››* = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const { label, className, ...rest } = props;

  return (
    <div ref={ref} className={'title ' + className} {...rest} aria-label={label}>
      {label}
    </div>
  );
})

*Defined in [packages/grid/x-grid-modules/src/components/column-header-title.tsx:6](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/components/column-header-title.tsx#L6)*

## Functions

### `Const` ColumnHeaderTitle

▸ **ColumnHeaderTitle**(`__namedParameters`: object): *Element‹›*

*Defined in [packages/grid/x-grid-modules/src/components/column-header-title.tsx:22](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/components/column-header-title.tsx#L22)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`columnWidth` | number |
`description` | undefined &#124; string |
`label` | string |

**Returns:** *Element‹›*
