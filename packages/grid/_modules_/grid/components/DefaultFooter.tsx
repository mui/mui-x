import * as React from 'react';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { paginationSelector } from '../hooks/features/pagination/paginationSelector';
import { rowCountSelector } from '../hooks/features/rows/rowsSelector';
import { selectedRowsCountSelector } from '../hooks/features/selection/selectionSelector';
import { optionsSelector } from '../hooks/utils/optionsSelector';
import { ApiContext } from './api-context';
import { RowCount } from './RowCount';
import { SelectedRowCount } from './SelectedRowCount';
import { GridFooter } from './containers/GridFooter';

export interface DefaultFooterProps {
  PaginationComponent?: React.ReactNode;
}

export function DefaultFooter(props: DefaultFooterProps) {
  const apiRef = React.useContext(ApiContext);
  const totalRowCount = useGridSelector(apiRef, rowCountSelector);
  const options = useGridSelector(apiRef, optionsSelector);
  const selectedRowCount = useGridSelector(apiRef, selectedRowsCountSelector);
  const pagination = useGridSelector(apiRef, paginationSelector);

  const SelectedRowCountComponent =
    !options.hideFooterSelectedRowCount && selectedRowCount > 0 ? (
      <SelectedRowCount selectedRowCount={selectedRowCount} />
    ) : (
      <div />
    );

  const RowCountComponent =
    !options.hideFooterRowCount && !options.pagination ? (
      <RowCount rowCount={totalRowCount} />
    ) : null;

  const PaginationComponent =
    !!options.pagination &&
    pagination.pageSize != null &&
    !options.hideFooterPagination &&
    props.PaginationComponent;

  return (
    <GridFooter>
      {SelectedRowCountComponent}
      {RowCountComponent}
      {PaginationComponent}
    </GridFooter>
  );
}
