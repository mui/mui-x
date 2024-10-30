import * as React from 'react';
import {
  DataGridPro,
  useGridApiRef,
  GridToolbar,
  GridDataSource,
  GridGetRowsParams,
} from '@mui/x-data-grid-pro';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useMockServer } from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

function ErrorAlert({ onClick }: { onClick: () => void }) {
  return (
    <Alert
      sx={{
        position: 'absolute',
        bottom: '0',
        paddingX: 2,
        paddingY: 1,
        width: '100%',
        zIndex: 10,
      }}
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={onClick}>
          Retry
        </Button>
      }
    >
      Could not fetch the data
    </Alert>
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
          firstRowToRender: `${params.start}`,
          lastRowToRender: `${params.end}`,
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
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
          <ErrorAlert
            onClick={() => {
              apiRef.current.unstable_dataSource.fetchRows(retryParams);
              setRetryParams(null);
            }}
          />
        )}
        <DataGridPro
          {...props}
          apiRef={apiRef}
          unstable_dataSource={dataSource}
          unstable_onDataSourceError={(_, params) => setRetryParams(params)}
          lazyLoading
          paginationModel={{ page: 0, pageSize: 10 }}
          slots={{ toolbar: GridToolbar }}
        />
      </div>
    </div>
  );
}

export default ServerSideLazyLoadingErrorHandling;
