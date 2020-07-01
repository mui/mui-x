[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/column-headers"](_src_components_column_headers_.md)

# Module: "src/components/column-headers"

## Index

### Interfaces

* [ColumnHeadersItemCollectionProps](../interfaces/_src_components_column_headers_.columnheadersitemcollectionprops.md)
* [ColumnsHeaderProps](../interfaces/_src_components_column_headers_.columnsheaderprops.md)

### Variables

* [ColumnHeaderItemCollection](_src_components_column_headers_.md#const-columnheaderitemcollection)
* [ColumnsHeader](_src_components_column_headers_.md#const-columnsheader)

## Variables

### `Const` ColumnHeaderItemCollection

• **ColumnHeaderItemCollection**: *React.FC‹[ColumnHeadersItemCollectionProps](../interfaces/_src_components_column_headers_.columnheadersitemcollectionprops.md)›* = React.memo(
  ({ headerHeight, onResizeColumn, columns }) => {
    const items = columns.map((col, idx) => (
      <ColumnHeaderItem
        key={col.field}
        column={col}
        colIndex={idx}
        headerHeight={headerHeight}
        onResizeColumn={onResizeColumn}
      />
    ));

    return <>{items}</>;
  },
)

*Defined in [packages/grid/x-grid-modules/src/components/column-headers.tsx:12](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/components/column-headers.tsx#L12)*

___

### `Const` ColumnsHeader

• **ColumnsHeader**: *NamedExoticComponent‹[ColumnsHeaderProps](../interfaces/_src_components_column_headers_.columnsheaderprops.md) & RefAttributes‹HTMLDivElement›› & object* = memo(
  forwardRef<HTMLDivElement, ColumnsHeaderProps>(
    ({ columns, hasScrollX, headerHeight, onResizeColumn, renderCtx }, columnsHeaderRef) => {
      const wrapperCssClasses = 'material-col-cell-wrapper ' + (hasScrollX ? 'scroll' : '');
      const api = useContext(ApiContext);

      if (!api) {
        throw new Error('ApiRef not found in context');
      }
      const lastRenderedColIndexes = useRef({ first: renderCtx?.firstColIdx, last: renderCtx?.lastColIdx });
      const [renderedCols, setRenderedCols] = useState(columns);

      useEffect(() => {
        if (renderCtx && renderCtx.firstColIdx != null && renderCtx.lastColIdx != null) {
          setRenderedCols(columns.slice(renderCtx.firstColIdx, renderCtx.lastColIdx + 1));

          if (
            lastRenderedColIndexes.current.first !== renderCtx.firstColIdx ||
            lastRenderedColIndexes.current.last !== renderCtx.lastColIdx
          ) {
            lastRenderedColIndexes.current = { first: renderCtx.firstColIdx, last: renderCtx.lastColIdx };
          }
        }
      }, [renderCtx, columns]);

      return (
        <div
          ref={columnsHeaderRef}
          key={'columns'}
          className={wrapperCssClasses}
          aria-rowindex={1}
          role={'row'}
          style={{ minWidth: renderCtx?.totalSizes?.width }}
        >
          <LeftEmptyCell key={'left-empty'} width={renderCtx?.leftEmptyWidth} />
          <ColumnHeaderItemCollection
            columns={renderedCols}
            onResizeColumn={onResizeColumn}
            headerHeight={headerHeight}
          />
          <RightEmptyCell key={'right-empty'} width={renderCtx?.rightEmptyWidth} />
        </div>
      );
    },
  ),
)

*Defined in [packages/grid/x-grid-modules/src/components/column-headers.tsx:37](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/components/column-headers.tsx#L37)*
