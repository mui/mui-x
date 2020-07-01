[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/styled-wrappers/window"](_src_components_styled_wrappers_window_.md)

# Module: "src/components/styled-wrappers/window"

## Index

### Variables

* [Window](_src_components_styled_wrappers_window_.md#const-window)

## Variables

### `Const` Window

• **Window**: *ForwardRefExoticComponent‹HTMLAttributes‹HTMLDivElement› & RefAttributes‹HTMLDivElement››* = React.forwardRef<HTMLDivElement, DivProps>((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <div ref={ref} className={'window ' + (className || '')} {...rest}>
      {children}
    </div>
  );
})

*Defined in [packages/grid/x-grid-modules/src/components/styled-wrappers/window.tsx:4](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/components/styled-wrappers/window.tsx#L4)*
