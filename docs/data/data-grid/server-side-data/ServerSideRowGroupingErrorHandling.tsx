import * as React from 'react';
import {
  DataGridPremium,
  GridDataSource,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GridGetRowsResponse,
  GridGetRowsError,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function ServerSideRowGroupingErrorHandling() {
  const apiRef = useGridApiRef();
  const [error, setError] = React.useState<string>();
  const [shouldRequestsFail, setShouldRequestsFail] = React.useState(false);

  const { fetchRows, columns } = useMockServer<GridGetRowsResponse>(
    { dataSet: 'Movies' },
    {},
    shouldRequestsFail,
  );

  const dataSource: GridDataSource = React.useMemo(() => {
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
      <div style={{ height: 400, position: 'relative' }}>
        <DataGridPremium
          columns={columns}
          dataSource={dataSource}
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
          }}
          apiRef={apiRef}
          initialState={initialState}
          disablePivoting
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
