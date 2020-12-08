import * as React from 'react';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { rowCountSelector } from '../hooks/features/rows/rowsSelector';
import { selectedRowsCountSelector } from '../hooks/features/selection/selectionSelector';
import { optionsSelector } from '../hooks/utils/useOptionsProp';
import { ApiContext } from './api-context';
import { RowCount } from './RowCount';
import { SelectedRowCount } from './SelectedRowCount';
import { GridFooter } from './styled-wrappers/GridFooter';

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

    const showSelectedRowCount =
      !options.hideFooterSelectedRowCount && selectedRowCount > 0 ? (
        <SelectedRowCount selectedRowCount={selectedRowCount} />
      ) : (
        <div />
      );

    const showRowCount =
      !options.hideFooterRowCount && !paginationComponent ? (
        <RowCount rowCount={totalRowCount} />
      ) : null;

    return (
      <GridFooter ref={ref}>
        {showSelectedRowCount}
        {showRowCount}
        {paginationComponent}
      </GridFooter>
    );
  },
);
