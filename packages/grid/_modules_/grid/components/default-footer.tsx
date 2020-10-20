import * as React from 'react';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { rowCountSelector } from '../hooks/features/rows/rowsSelector';
import { optionsSelector } from '../hooks/utils/useOptionsProp';
import { ApiContext } from './api-context';
import { RowCount } from './row-count';
import { SelectedRowCount } from './selected-row-count';
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

    // TODO refactor to use gridState
    const [selectedRowCount, setSelectedCount] = React.useState(0);
    React.useEffect(() => {
      return apiRef!.current.onSelectionChange(({ rows }) => {
        setSelectedCount(rows.length);
      });
    }, [apiRef]);

    if (options.hideFooter) {
      return null;
    }

    return (
      <GridFooter ref={ref}>
        {!options.hideFooterRowCount && <RowCount rowCount={totalRowCount} />}
        {!options.hideFooterSelectedRowCount && (
          <SelectedRowCount selectedRowCount={selectedRowCount} />
        )}
        {paginationComponent}
      </GridFooter>
    );
  },
);
