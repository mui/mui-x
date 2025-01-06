import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';

export default function ServerSideRowGroupingGroupExpansion() {
  const apiRef = useGridApiRef();

  const { fetchRows, columns } = useMockServer({
    rowGrouping: true,
  });

  const dataSource = React.useMemo(() => {
    return {
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
          groupFields: JSON.stringify(params.groupFields),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
    };
  }, [fetchRows]);

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
    },
  });

  return (
    <div style={{ width: '100%' }}>
      <Button
        onClick={() => {
          apiRef.current.unstable_dataSource.cache.clear();
        }}
      >
        Clear cache
      </Button>

      <div style={{ height: 400, position: 'relative' }}>
        <DataGridPremium
          columns={columns}
          unstable_dataSource={dataSource}
          apiRef={apiRef}
          initialState={initialState}
          defaultGroupingExpansionDepth={-1}
        />
      </div>
    </div>
  );
}
