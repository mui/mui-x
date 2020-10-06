import * as React from 'react';
import { GridOptions } from '../models';
import { GridFooter } from './styled-wrappers/GridFooter';
import { RowCount } from './row-count';
import { SelectedRowCount } from './selected-row-count';
import { ApiContext } from './api-context';
import {useGridState} from "../hooks/features";

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

    const globalState = useGridState(apiRef!);

    React.useEffect(()=> {
      console.log('GLLOOOOOOOBAL STATE', globalState);
    }, [globalState]);

    const totalRowCount = 10; //  React.useMemo(()=> globalState?.rows.length, [globalState?.rows.length]);
    const visibleRowCount = 100; //React.useMemo(()=> globalState?.rows.filter(row=> !row.isHidden).length,[globalState?.rows]);

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
