import * as React from 'react';
import { GridOptions } from '../models';
import { GridFooter } from './styled-wrappers/GridFooter';
import { RowCount } from './row-count';
import { SelectedRowCount } from './selected-row-count';
import { ApiContext } from './api-context';
import {rowCountSelector} from "../hooks/features";
import {useGridSelector} from "../hooks/features/core/useGridSelector";

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
    const totalRowCount = useGridSelector(apiRef, rowCountSelector);
    // const [selectedRowCount, setSelectedCount] = React.useState(0);
//     const totalRef = React.useRef(0);
//
//     React.useEffect(()=> {
//       if(totalRowCount< totalRef.current) {
//         // throw new Error('it should be more ');
//         console.warn(`NOT SURE WHYYYYY -< ${totalRowCount} less than previous ${totalRef.current},
//         and in state totalRowCount : ${apiRef!.current.state.rows.totalRowCount}
//         and in state all rows len: ${apiRef!.current.state.rows.allRows.length}
//         and in state lookup len: ${Object.keys(apiRef!.current.state.rows.idRowsLookup).length}
// s        `);
//       }
//       totalRef.current = totalRowCount;
//     }, [apiRef, totalRowCount])

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
        {totalRowCount}
        - {pagination?.rowCount}
        {/*{!options.hideFooterSelectedRowCount && (*/}
        {/*  <SelectedRowCount selectedRowCount={selectedRowCount} />*/}
        {/*)}*/}
        {/*{paginationComponent}*/}
      </GridFooter>
    );
  },
);
