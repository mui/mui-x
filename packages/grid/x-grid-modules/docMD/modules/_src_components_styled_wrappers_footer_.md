[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/styled-wrappers/footer"](_src_components_styled_wrappers_footer_.md)

# Module: "src/components/styled-wrappers/footer"

## Index

### Variables

* [Footer](_src_components_styled_wrappers_footer_.md#const-footer)

## Variables

### `Const` Footer

• **Footer**: *ForwardRefExoticComponent‹HTMLAttributes‹HTMLDivElement› & RefAttributes‹HTMLDivElement››* = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <div ref={ref} className={'footer ' + (className || '')} {...rest}>
      {children}
    </div>
  );
})

*Defined in [packages/grid/x-grid-modules/src/components/styled-wrappers/footer.tsx:4](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/components/styled-wrappers/footer.tsx#L4)*
