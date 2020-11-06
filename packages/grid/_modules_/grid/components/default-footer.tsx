import * as React from 'react';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { rowCountSelector } from '../hooks/features/rows/rowsSelector';
import { selectedRowsCountSelector } from '../hooks/features/selection/selectionSelector';
import { optionsSelector } from '../hooks/utils/useOptionsProp';
import { ApiContext } from './api-context';
import { RowCount } from './row-count';
import { SelectedRowCount } from './selected-row-count';
import { GridFooter } from './styled-wrappers/GridFooter';
import { classnames } from '../utils';

export interface DefaultFooterProps {
  paginationComponent: React.ReactNode;
}

export const DefaultFooter = React.forwardRef<HTMLDivElement, DefaultFooterProps>(
  function DefaultFooter(props, ref) {
    const { paginationComponent } = props;
    const apiRef = React.useContext(ApiContext);
    const totalRowCount = useGridSelector(apiRef, rowCountSelector);
    const options = useGridSelector(apiRef, optionsSelector);
    const selectedRowCount = useGridSelector(apiRef, selectedRowsCountSelector);

    if (options.hideFooter) {
      return null;
    }

    const isPaginationAvailable = !!paginationComponent;
    const showRowCount = !options.hideFooterRowCount && !isPaginationAvailable && (
      <RowCount rowCount={totalRowCount} />
    );
    const showSelectedRowCount = !options.hideFooterSelectedRowCount && (
      <SelectedRowCount selectedRowCount={selectedRowCount} />
    );
    const justifyItemsEnd = !selectedRowCount && !options.hideFooterSelectedRowCount;

    return (
      <GridFooter
        ref={ref}
        className={classnames({
          'MuiDataGrid-footer-paginationAvailable': isPaginationAvailable,
          'MuiDataGrid-footer-justifyContentEnd': justifyItemsEnd,
        })}
      >
        {showSelectedRowCount}
        {showRowCount}
        {paginationComponent}
      </GridFooter>
    );
  },
);
