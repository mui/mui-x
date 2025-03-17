import * as React from 'react';
import {
  DataGridPremium,
  Unstable_GridToolbarPromptControl as GridToolbarPromptControl,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  useGridApiContext,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { mockPromptResolver, useMockServer } from '@mui/x-data-grid-generator';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const VISIBLE_FIELDS = [
  'name',
  'email',
  'position',
  'company',
  'salary',
  'phone',
  'country',
  'dateCreated',
  'isAdmin',
];

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

function ToolbarWithPromptInput() {
  const apiRef = useGridApiContext();
  const [prompt, setPrompt] = React.useState('');

  const context = React.useMemo(
    () => apiRef.current.unstable_getPromptContext(true),
    [apiRef],
  );

  const handleChange = React.useCallback(
    async (event) => {
      const selectedPrompt = event.target.value;
      setPrompt(selectedPrompt);
      if (selectedPrompt) {
        apiRef.current.setLoading(true);
        const result = await mockPromptResolver(selectedPrompt, context);
        apiRef.current.unstable_applyPromptResult(result);
      }
    },
    [apiRef, context],
  );

  return (
    <Toolbar
      render={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            p: 0.5,
          }}
        />
      }
    >
      <Box sx={{ display: 'flex', gap: 0.25 }}>
        <Tooltip title="Columns">
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <ViewColumnIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </Tooltip>

        <Tooltip title="Filters">
          <FilterPanelTrigger
            render={(props, state) => (
              <ToolbarButton {...props} color="default">
                <Badge
                  badgeContent={state.filterCount}
                  color="primary"
                  variant="dot"
                >
                  <FilterListIcon fontSize="small" />
                </Badge>
              </ToolbarButton>
            )}
          />
        </Tooltip>
        <div style={{ flex: 1 }} />
        <Select
          autoWidth
          displayEmpty
          size="small"
          value={prompt}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Choose a prompt</em>
          </MenuItem>
          <MenuItem value="sort by name">Sort by name</MenuItem>
          <MenuItem value="sort by company name and employee name">
            Sort by company name and employee name
          </MenuItem>
          <MenuItem value="show people from the EU">
            Show people from the EU
          </MenuItem>
          <MenuItem value="order companies by amount of people">
            Order companies by amount of people
          </MenuItem>
        </Select>
      </Box>
      <GridToolbarPromptControl
        onPrompt={mockPromptResolver}
        allowDataSampling
        onError={console.error}
      />
    </Toolbar>
  );
}

export default function PromptWithDataSource() {
  const apiRef = useGridApiRef();
  const { columns, initialState, fetchRows } = useMockServer(
    {
      dataSet: 'Employee',
      visibleFields: VISIBLE_FIELDS,
      maxColumns: 16,
      rowGrouping: true,
      rowLength: 10000,
    },
    { useCursorPagination: false },
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
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
          aggregateRow: getRowsResponse.aggregateRow,
        };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
      getAggregatedValue: (row, field) => row[`${field}Aggregate`],
    }),
    [fetchRows],
  );

  const initialStateUpdated = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...initialState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
        rowCount: 0,
      },
    },
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        apiRef={apiRef}
        columns={columns}
        dataSource={dataSource}
        dataSourceCache={null}
        pagination
        initialState={initialStateUpdated}
        pageSizeOptions={[10, 20, 50]}
        slots={{
          toolbar: ToolbarWithPromptInput,
        }}
        showToolbar
        aggregationFunctions={aggregationFunctions}
        onDataSourceError={console.error}
      />
    </div>
  );
}
