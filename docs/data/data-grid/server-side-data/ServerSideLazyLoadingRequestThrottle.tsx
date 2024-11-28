import * as React from 'react';
import {
  DataGridPro,
  GridDataSource,
  GridGetRowsParams,
  GridRowCount,
  GridSlotProps,
} from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    throttleMs: number;
    setThrottleMs: React.Dispatch<React.SetStateAction<number>>;
  }
  interface FooterRowCountOverrides {
    requestCount?: number;
  }
}

function GridCustomFooterRowCount({
  requestCount,
  ...props
}: GridSlotProps['footerRowCount']) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'start' }}>
      <span>Request count: {requestCount}</span>
      <GridRowCount {...props} />
    </Box>
  );
}

function GridCustomToolbar({ throttleMs, setThrottleMs }: GridSlotProps['toolbar']) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'start' }}>
      <FormControl
        style={{
          padding: 8,
        }}
      >
        <FormLabel id="demo-request-throttle-buttons-group-label">
          Throttle
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-request-throttle-buttons-group-label"
          name="request-throttle-buttons-group"
          value={throttleMs}
          onChange={(event) => setThrottleMs(Number(event.target.value))}
        >
          <FormControlLabel value="0" control={<Radio />} label="0 ms" />
          <FormControlLabel
            value="500"
            control={<Radio />}
            label="500 ms (default)"
          />
          <FormControlLabel value="1500" control={<Radio />} label="1500 ms" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

function ServerSideLazyLoadingRequestThrottle() {
  const rowCount = 1000;
  const { fetchRows, ...props } = useMockServer(
    { rowLength: rowCount },
    { useCursorPagination: false, minDelay: 200, maxDelay: 500 },
  );

  const [requestCount, setRequestCount] = React.useState<number>(0);
  const [throttleMs, setThrottleMs] = React.useState<number>(500);

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params: GridGetRowsParams) => {
        const urlParams = new URLSearchParams({
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          start: `${params.start}`,
          end: `${params.end}`,
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );

        setRequestCount((prev) => prev + 1);
        return {
          rows: getRowsResponse.rows,
        };
      },
    }),
    [fetchRows],
  );

  React.useEffect(() => {
    setRequestCount(0);
  }, [dataSource]);

  return (
    <div style={{ width: '100%', height: 500 }}>
      <DataGridPro
        {...props}
        unstable_dataSource={dataSource}
        rowCount={rowCount}
        unstable_lazyLoading
        unstable_lazyLoadingRequestThrottleMs={throttleMs}
        paginationModel={{ page: 0, pageSize: 10 }}
        slots={{
          footerRowCount: GridCustomFooterRowCount,
          toolbar: GridCustomToolbar,
        }}
        slotProps={{
          footerRowCount: {
            requestCount,
          },
          toolbar: {
            throttleMs,
            setThrottleMs,
          },
        }}
      />
    </div>
  );
}

export default ServerSideLazyLoadingRequestThrottle;
