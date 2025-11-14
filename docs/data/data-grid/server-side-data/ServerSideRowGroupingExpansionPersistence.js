import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';

export default function ServerSideRowGroupingExpansionPersistence() {
  const apiRef = useGridApiRef();

  const { fetchRows, columns } = useMockServer({ dataSet: 'Movies' }, {});

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
        model: ['company', 'director'],
      },
    },
  });

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
        <Button
          variant="outlined"
          onClick={() => {
            apiRef.current?.dataSource.fetchRows();
          }}
        >
          Fetch and keep the children
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            apiRef.current?.dataSource.fetchRows(GRID_ROOT_GROUP_ID, {
              keepChildrenExpanded: false,
            });
          }}
        >
          Fetch and collapse the children
        </Button>
      </div>
      <div style={{ height: 400, position: 'relative' }}>
        <DataGridPremium
          columns={columns}
          dataSource={dataSource}
          dataSourceCache={null}
          apiRef={apiRef}
          initialState={initialState}
          disablePivoting
        />
      </div>
    </div>
  );
}
