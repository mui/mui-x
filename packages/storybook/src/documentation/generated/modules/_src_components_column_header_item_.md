[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/column-header-item"](_src_components_column_header_item_.md)

# Module: "src/components/column-header-item"

## Index

### Interfaces

- [ColumnHeaderItemProps](../interfaces/_src_components_column_header_item_.columnheaderitemprops.md)

### Variables

- [ColumnHeaderItem](_src_components_column_header_item_.md#const-columnheaderitem)

## Variables

### `Const` ColumnHeaderItem

• **ColumnHeaderItem**: _NamedExoticComponent‹[ColumnHeaderItemProps](../interfaces/_src_components_column_header_item_.columnheaderitemprops.md)› & object_ = React.memo(
({ column, colIndex, headerHeight, onResizeColumn }: ColumnHeaderItemProps) => {
const api = useContext(ApiContext);

    const cssClass = classnames(
      HEADER_CELL_CSS_CLASS,
      column.headerClass,
      column.headerAlign !== 'left' ? column.headerAlign : '',
      { sortable: column.sortable },
    );

    let headerComponent: React.ReactElement | null = null;
    if (column.headerComponent) {
      headerComponent = column.headerComponent({ api: api!.current!, colDef: column, colIndex });
    }

    const onResize = onResizeColumn ? () => onResizeColumn(column) : undefined;

    const width = column.width!;

    let ariaSort: any = undefined;
    if (column.sortDirection != null) {
      ariaSort = { 'aria-sort': column.sortDirection === 'asc' ? 'ascending' : 'descending' };
    }

    return (
      <div
        className={cssClass}
        key={column.field}
        data-field={column.field}
        style={{
          width: width,
          minWidth: width,
          maxWidth: width,
          maxHeight: headerHeight,
          minHeight: headerHeight,
        }}
        role={'columnheader'}
        tabIndex={-1}
        aria-colindex={colIndex + 1}
        {...ariaSort}
      >
        {column.type === 'number' && (
          <ColumnHeaderSortIcon
            direction={column.sortDirection}
            index={column.sortIndex}
            hide={column.hideSortIcons}
          />
        )}
        {headerComponent || (
          <ColumnHeaderTitle
            label={column.headerName || column.field}
            description={column.description}
            columnWidth={width}
          />
        )}
        {column.type !== 'number' && (
          <ColumnHeaderSortIcon
            direction={column.sortDirection}
            index={column.sortIndex}
            hide={column.hideSortIcons}
          />
        )}
        <ColumnHeaderSeparator resizable={column.resizable} onResize={onResize} />
      </div>
    );

},
)

_Defined in [packages/grid/x-grid-modules/src/components/column-header-item.tsx:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/column-header-item.tsx#L18)_
