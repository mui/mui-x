import * as React from 'react';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { paginationSelector } from '../hooks/features/pagination/paginationSelector';
import { rowCountSelector } from '../hooks/features/rows/rowsSelector';
import { selectedRowsCountSelector } from '../hooks/features/selection/selectionSelector';
import { optionsSelector } from '../hooks/utils/optionsSelector';
import { ApiContext } from './api-context';
import { RowCount } from './RowCount';
import { SelectedRowCount } from './SelectedRowCount';
import { GridFooterContainer } from './containers/GridFooterContainer';

export interface GridFooterProps {
  PaginationComponent?: React.ReactNode;
}

export function GridFooter(props: GridFooterProps) {
  const apiRef = React.useContext(ApiContext);
  const totalRowCount = useGridSelector(apiRef, rowCountSelector);
  const options = useGridSelector(apiRef, optionsSelector);
  const selectedRowCount = useGridSelector(apiRef, selectedRowsCountSelector);
  const pagination = useGridSelector(apiRef, paginationSelector);

  const SelectedRowCountElement =
    !options.hideFooterSelectedRowCount && selectedRowCount > 0 ? (
      <SelectedRowCount selectedRowCount={selectedRowCount} />
    ) : (
      <div />
    );

  const RowCountElement =
    !options.hideFooterRowCount && !options.pagination ? (
      <RowCount rowCount={totalRowCount} />
    ) : null;

  const PaginationElement =
    !!options.pagination &&
    pagination.pageSize != null &&
    !options.hideFooterPagination &&
    props.PaginationComponent;

  return (
    <GridFooterContainer>
      {SelectedRowCountElement}
      {RowCountElement}
      {PaginationElement}
    </GridFooterContainer>
  );
}
