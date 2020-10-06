import * as React from 'react';
import { GridOptions } from '../models';
import { GridFooter } from './styled-wrappers/GridFooter';
import { RowCount } from './row-count';
import { SelectedRowCount } from './selected-row-count';
import { ApiContext } from './api-context';

export interface DefaultFooterProps {
  options: GridOptions;
  paginationComponent: React.ReactNode;
  rowCount: number;
}


// export const rowsSelector = (state)=> state.rows;
// export const visibleRowsSelector = ()=>

export const DefaultFooter = React.forwardRef<HTMLDivElement, DefaultFooterProps>(
  function DefaultFooter(props, ref) {
    const { options, rowCount, paginationComponent } = props;
    const apiRef = React.useContext(ApiContext);
    const [selectedRowCount, setSelectedCount] = React.useState(0);

    const totalRowCount =  React.useMemo(()=> apiRef?.current.state.rows.length, [apiRef?.current.state.rows.length]);
    const visibleRowCount =  React.useMemo(()=> apiRef?.current.state.rows.filter(row=> !row.isHidden).length,[apiRef?.current.state.rows]);

    React.useEffect(() => {
      return apiRef!.current.onSelectionChange(({ rows }) => {
        setSelectedCount(rows.length);
      });
    }, [apiRef]);

    if (options.hideFooter) {
      return null;
    }
    console.log('rendering FOOTER ---------', rowCount);

    return (
      <GridFooter ref={ref}>
        {!options.hideFooterRowCount && <RowCount visibleRowCount={visibleRowCount} totalRowCount={totalRowCount} />}
        {!options.hideFooterSelectedRowCount && (
          <SelectedRowCount selectedRowCount={selectedRowCount} />
        )}
        {paginationComponent}
      </GridFooter>
    );
  },
);
