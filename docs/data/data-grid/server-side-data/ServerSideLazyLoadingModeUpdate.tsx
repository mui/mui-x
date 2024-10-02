import * as React from 'react';
import {
  DataGridPro,
  GridDataSource,
  GridGetRowsParams,
  GridSlotsComponentsProps,
} from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    count: number;
    setCount: (count: number) => void;
  }
}

function Toolbar(props: NonNullable<GridSlotsComponentsProps['toolbar']>) {
  const { count, setCount } = props;
  return (
    <FormControl
      style={{
        padding: 8,
      }}
    >
      <FormLabel id="demo-row-count-buttons-group-label">Row count</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-count-buttons-group-label"
        name="row-count-buttons-group"
        value={count}
        onChange={(event) => setCount && setCount(Number(event.target.value))}
      >
        <FormControlLabel value="-1" control={<Radio />} label="Unknown" />
        <FormControlLabel value="40" control={<Radio />} label="40" />
        <FormControlLabel value="100" control={<Radio />} label="100" />
      </RadioGroup>
    </FormControl>
  );
}

function ServerSideLazyLoadingModeUpdate() {
  const { columns, fetchRows } = useMockServer(
    { rowLength: 100 },
    { useCursorPagination: false, minDelay: 300, maxDelay: 800 },
  );

  const [rowCount, setRowCount] = React.useState<number>(-1);

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params: GridGetRowsParams) => {
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
        };
      },
    }),
    [fetchRows],
  );

  return (
    <div style={{ width: '100%', height: 450 }}>
      <DataGridPro
        columns={columns}
        unstable_dataSource={dataSource}
        lazyLoading
        paginationModel={{ page: 0, pageSize: 10 }}
        rowCount={rowCount}
        slots={{ toolbar: Toolbar }}
        slotProps={{
          toolbar: {
            count: rowCount,
            setCount: setRowCount,
          },
        }}
      />
    </div>
  );
}

export default ServerSideLazyLoadingModeUpdate;
