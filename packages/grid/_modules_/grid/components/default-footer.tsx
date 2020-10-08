import * as React from 'react';
import { GridOptions } from '../models';
import { GridFooter } from './styled-wrappers/GridFooter';
import { RowCount } from './row-count';
import { SelectedRowCount } from './selected-row-count';
import { ApiContext } from './api-context';
import {useGridSelector} from "../hooks/features/core/useGridReducer";

export interface DefaultFooterProps {
  options: GridOptions;
  paginationComponent: React.ReactNode;
  rowCount: number;
}

const paginationSelector = (state)=> state.pagination;

export const DefaultFooter = React.forwardRef<HTMLDivElement, DefaultFooterProps>(
  function DefaultFooter(props, ref) {
    // const { options, rowCount, paginationComponent } = props;
    const apiRef = React.useContext(ApiContext);
    // const [selectedRowCount, setSelectedCount] = React.useState(0);

    const pagination = useGridSelector(apiRef, paginationSelector);

    // console.log('New pagination state is ', pagination);

    // const pagination =  React.useMemo(()=> {
    //   const paginationState = apiRef?.current.state.pagination;
    //   console.log('New pagination state is ', paginationState);
    //   return paginationState;
    //
    // },[apiRef?.current.state.pagination]);
    //


    // React.useEffect(() => {
    //   return apiRef!.current.onSelectionChange(({ rows }) => {
    //     setSelectedCount(rows.length);
    //   });
    // }, [apiRef]);
    //
    // if (options.hideFooter) {
    //   return null;
    // }

    return (
      <GridFooter ref={ref}>
        {/*{!options.hideFooterRowCount && <RowCount rowCount={rowCount} />}*/}
        {pagination?.rowCount}
        {/*{!options.hideFooterSelectedRowCount && (*/}
        {/*  <SelectedRowCount selectedRowCount={selectedRowCount} />*/}
        {/*)}*/}
        {/*{paginationComponent}*/}
      </GridFooter>
    );
  },
);
