import * as React from 'react';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { gridPaginationSelector } from '../hooks/features/pagination/gridPaginationSelector';
import { gridRowCountSelector } from '../hooks/features/rows/gridRowsSelector';
import { selectedGridRowsCountSelector } from '../hooks/features/selection/gridSelectionSelector';
import { useGridBaseComponentProps } from '../hooks/features/useGridBaseComponentProps';
import { optionsSelector } from '../hooks/utils/optionsSelector';
import { GridApiContext } from './GridApiContext';
import { GridRowCount } from './GridRowCount';
import { GridSelectedRowCount } from './GridSelectedRowCount';
import { GridFooterContainer } from './containers/GridFooterContainer';

export function GridFooter() {
  const apiRef = React.useContext(GridApiContext);
  const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const options = useGridSelector(apiRef, optionsSelector);
  const selectedRowCount = useGridSelector(apiRef, selectedGridRowsCountSelector);
  const pagination = useGridSelector(apiRef, gridPaginationSelector);
  const baseProps = useGridBaseComponentProps(apiRef);

  const SelectedRowCountElement =
    !options.hideFooterSelectedRowCount && selectedRowCount > 0 ? (
      <GridSelectedRowCount selectedRowCount={selectedRowCount} />
    ) : (
      <div />
    );

  const RowCountElement =
    !options.hideFooterRowCount && !options.pagination ? (
      <GridRowCount rowCount={totalRowCount} />
    ) : null;

  const PaginationComponent =
    !!options.pagination &&
    pagination.pageSize != null &&
    !options.hideFooterPagination &&
    apiRef?.current.components.Pagination;

  const PaginationElement = PaginationComponent && (
    <PaginationComponent {...baseProps} {...apiRef?.current.componentsProps?.pagination} />
  );

  return (
    <GridFooterContainer>
      {SelectedRowCountElement}
      {RowCountElement}
      {PaginationElement}
    </GridFooterContainer>
  );
}
