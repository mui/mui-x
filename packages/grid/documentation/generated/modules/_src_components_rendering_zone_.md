[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/rendering-zone"](_src_components_rendering_zone_.md)

# Module: "src/components/rendering-zone"

## Index

### Type aliases

* [WithChildren](_src_components_rendering_zone_.md#withchildren)

### Variables

* [RenderingZone](_src_components_rendering_zone_.md#const-renderingzone)

## Type aliases

###  WithChildren

Ƭ **WithChildren**: *object*

*Defined in [packages/grid/x-grid-modules/src/components/rendering-zone.tsx:5](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/rendering-zone.tsx#L5)*

#### Type declaration:

* **children**? : *React.ReactNode*

## Variables

### `Const` RenderingZone

• **RenderingZone**: *ForwardRefExoticComponent‹[ElementSize](../interfaces/_src_models_elementsize_.elementsize.md) & object & RefAttributes‹HTMLDivElement››* = React.forwardRef<HTMLDivElement, ElementSize & WithChildren>(
  ({ height, width, children }, ref) => {
    return (
      <div
        ref={ref}
        className={'rendering-zone'}
        style={{
          maxHeight: height,
          width: width,
        }}
      >
        {children}
      </div>
    );
  },
)

*Defined in [packages/grid/x-grid-modules/src/components/rendering-zone.tsx:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/rendering-zone.tsx#L7)*
