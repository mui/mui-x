[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/default-footer"](_src_components_default_footer_.md)

# Module: "src/components/default-footer"

## Index

### Interfaces

- [DefaultFooterProps](../interfaces/_src_components_default_footer_.defaultfooterprops.md)

### Variables

- [DefaultFooter](_src_components_default_footer_.md#const-defaultfooter)

## Variables

### `Const` DefaultFooter

• **DefaultFooter**: _ForwardRefExoticComponent‹[DefaultFooterProps](../interfaces/_src_components_default_footer_.defaultfooterprops.md) & RefAttributes‹HTMLDivElement››_ = React.forwardRef<HTMLDivElement, DefaultFooterProps>(
function DefaultFooter({ options, paginationProps, rowCount }, ref) {
const api = useContext(ApiContext);
const [selectedRowCount, setSelectedCount] = useState(0);

    useEffect(() => {
      if (api && api.current) {
        return api.current!.onSelectionChanged(({ rows }) => setSelectedCount(rows.length));
      }
    }, [api, setSelectedCount]);

    if (options.hideFooter) {
      return null;
    }

    return (
      <Footer ref={ref}>
        {!options.hideFooterRowCount && <RowCount rowCount={rowCount} />}
        {!options.hideFooterSelectedRowCount && (
          <SelectedRowCount selectedRowCount={selectedRowCount} />
        )}
        {options.pagination &&
          paginationProps.pageSize != null &&
          !options.hideFooterPagination &&
          ((options.paginationComponent && options.paginationComponent(paginationProps)) || (
            <Pagination
              setPage={paginationProps.setPage}
              currentPage={paginationProps.page}
              pageCount={paginationProps.pageCount}
              pageSize={paginationProps.pageSize}
              rowCount={paginationProps.rowCount}
              setPageSize={paginationProps.setPageSize}
              rowsPerPageOptions={options.paginationRowsPerPageOptions}
            />
          ))}
      </Footer>
    );

},
)

_Defined in [packages/grid/x-grid-modules/src/components/default-footer.tsx:17](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/default-footer.tsx#L17)_
