import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

export default function ColumnAutosizingGroupedRows() {
  const data = useMovieData();
  const apiRef = useGridApiRef();

  const columns = React.useMemo(() => {
    return data.columns.map((col) => ({ ...col, width: 50 }));
  }, [data.columns]);

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: { rowGrouping: { model: ['company'] } },
  });

  React.useEffect(() => {
    return apiRef.current.subscribeEvent('rowExpansionChange', (params) => {
      if (params.childrenExpanded) {
        apiRef.current.autosizeColumns({ includeOutliers: true });
      }
    });
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        columns={columns}
        apiRef={apiRef}
        initialState={initialState}
        groupingColDef={{ width: 250 }}
      />
    </div>
  );
}
