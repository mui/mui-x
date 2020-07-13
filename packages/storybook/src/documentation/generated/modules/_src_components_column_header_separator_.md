[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/column-header-separator"](_src_components_column_header_separator_.md)

# Module: "src/components/column-header-separator"

## Index

### Interfaces

- [ColumnHeaderSeparatorProps](../interfaces/_src_components_column_header_separator_.columnheaderseparatorprops.md)

### Variables

- [ColumnHeaderSeparator](_src_components_column_header_separator_.md#const-columnheaderseparator)

## Variables

### `Const` ColumnHeaderSeparator

• **ColumnHeaderSeparator**: _React.FC‹[ColumnHeaderSeparatorProps](../interfaces/_src_components_column_header_separator_.columnheaderseparatorprops.md)›_ = React.memo(
({ onResize, resizable }) => {
const icons = useIcons();

    const resizeIconProps = {
      className: 'icon separator ' + (resizable ? 'resizable' : ''),
      ...(resizable && onResize ? { onMouseDown: onResize } : {}),
    };

    return <div className={'column-separator'}>{icons!.columnResize!(resizeIconProps)}</div>;

},
)

_Defined in [packages/grid/x-grid-modules/src/components/column-header-separator.tsx:10](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/column-header-separator.tsx#L10)_
