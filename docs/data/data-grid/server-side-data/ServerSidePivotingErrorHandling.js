import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  GridGetRowsError,
  GridSidebarValue,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const pivotModel = {
  rows: [{ field: 'commodity' }, { field: 'traderName' }],
  columns: [{ field: 'status' }],
  values: [{ field: 'quantity', aggFunc: 'sum' }],
};

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

const pivotingColDef = (originalColumnField, columnGroupPath) => ({
  field: columnGroupPath.concat(originalColumnField).join('>->'),
});

export default function ServerSidePivotingErrorHandling() {
  const apiRef = useGridApiRef();
  const [error, setError] = React.useState();
  const [shouldRequestsFail, setShouldRequestsFail] = React.useState(false);

  const {
    columns,
    initialState: initialStateMock,
    fetchRows,
  } = useMockServer(
    {
      rowLength: 200,
      dataSet: 'Commodity',
      maxColumns: 20,
    },
    { useCursorPagination: false },
    shouldRequestsFail,
  );

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
          groupFields: JSON.stringify(params.groupFields),
          aggregationModel: JSON.stringify(params.aggregationModel),
          pivotModel: JSON.stringify(params.pivotModel),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
          aggregateRow: getRowsResponse.aggregateRow,
          pivotColumns: getRowsResponse.pivotColumns,
        };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
      getAggregatedValue: (row, field) => row[field],
    }),
    [fetchRows],
  );

  const initialState = React.useMemo(
    () => ({
      ...initialStateMock,
      pivoting: {
        model: pivotModel,
        enabled: true,
      },
      sidebar: {
        open: true,
        value: GridSidebarValue.Pivot,
      },
    }),
    [initialStateMock],
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            setError('');
            apiRef.current?.dataSource.fetchRows();
          }}
        >
          Refetch rows
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldRequestsFail}
              onChange={(event) => setShouldRequestsFail(event.target.checked)}
            />
          }
          label="Make the requests fail"
        />
      </div>
      <div style={{ height: 600, position: 'relative' }}>
        <DataGridPremium
          apiRef={apiRef}
          columns={columns}
          dataSource={dataSource}
          showToolbar
          initialState={initialState}
          aggregationFunctions={aggregationFunctions}
          pivotingColDef={pivotingColDef}
          onDataSourceError={(err) => {
            if (err instanceof GridGetRowsError) {
              if (!err.params.groupKeys || err.params.groupKeys.length === 0) {
                setError(err.message);
              } else {
                setError(
                  `${err.message} (Requested level: ${err.params.groupKeys.join(' > ')})`,
                );
              }
            }
          }}
          dataSourceCache={null}
          slots={{
            noRowsOverlay: ErrorOverlay,
            noResultsOverlay: ErrorOverlay,
            emptyPivotOverlay: ErrorOverlay,
          }}
        />
        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError('')}
          message={error}
        />
      </div>
    </div>
  );
}

function ErrorOverlay() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      Could not fetch the data
    </Box>
  );
}
