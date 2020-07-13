[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/styled-wrappers/columns-container"](_src_components_styled_wrappers_columns_container_.md)

# Module: "src/components/styled-wrappers/columns-container"

## Index

### Variables

- [ColumnsContainer](_src_components_styled_wrappers_columns_container_.md#const-columnscontainer)

## Variables

### `Const` ColumnsContainer

• **ColumnsContainer**: _ForwardRefExoticComponent‹HTMLAttributes‹HTMLDivElement› & RefAttributes‹HTMLDivElement››_ = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
const { className, children, ...rest } = props;
return (
<div ref={ref} className={'columns-container ' + (className || '')} {...rest}>
{children}
</div>
);
})

_Defined in [packages/grid/x-grid-modules/src/components/styled-wrappers/columns-container.tsx:4](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/styled-wrappers/columns-container.tsx#L4)_
