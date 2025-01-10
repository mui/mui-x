import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridToolbar,
  GridDataSource,
  GridGetRowsParams,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid-pro';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useMockServer } from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';

function ErrorSnackbar(props: SnackbarProps & { onRetry: () => void }) {
  const { onRetry, ...rest } = props;
  return (
    <Snackbar {...rest}>
      <Alert
        severity="error"
        variant="filled"
        sx={{ width: '100%' }}
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      >
        Failed to fetch row data
      </Alert>
    </Snackbar>
  );
}

function ServerSideLazyLoadingErrorHandling() {
  const apiRef = useGridApiRef();
  const [retryParams, setRetryParams] = React.useState<GridGetRowsParams | null>(
    null,
  );
  const [shouldRequestsFail, setShouldRequestsFail] = React.useState(false);

  const { fetchRows, ...props } = useMockServer(
    { rowLength: 100 },
    { useCursorPagination: false, minDelay: 300, maxDelay: 800 },
    shouldRequestsFail,
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          start: `${params.start}`,
          end: `${params.end}`,
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );

        // Reset the retryParams when new rows are fetched
        setRetryParams(null);
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
    }),
    [fetchRows],
  );

  return (
    <div style={{ width: '100%' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={shouldRequestsFail}
            onChange={(event) => setShouldRequestsFail(event.target.checked)}
          />
        }
        label="Make the requests fail"
      />
      <div style={{ height: 400, position: 'relative' }}>
        {retryParams && (
          <ErrorSnackbar
            open={!!retryParams}
            onRetry={() => {
              apiRef.current.unstable_dataSource.fetchRows(
                GRID_ROOT_GROUP_ID,
                retryParams,
              );
              setRetryParams(null);
            }}
          />
        )}
        <DataGridPro
          {...props}
          apiRef={apiRef}
          unstable_dataSource={dataSource}
          unstable_onDataSourceError={(_, params) => setRetryParams(params)}
          unstable_dataSourceCache={null}
          unstable_lazyLoading
          paginationModel={{ page: 0, pageSize: 10 }}
          slots={{ toolbar: GridToolbar }}
        />
      </div>
    </div>
  );
}

export default ServerSideLazyLoadingErrorHandling;
