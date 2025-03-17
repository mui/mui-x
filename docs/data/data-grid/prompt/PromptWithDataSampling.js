import * as React from 'react';
import {
  DataGridPremium,
  FilterPanelTrigger,
  Unstable_GridToolbarPromptControl as GridToolbarPromptControl,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  useGridApiContext,
} from '@mui/x-data-grid-premium';
import { mockPromptResolver, useDemoData } from '@mui/x-data-grid-generator';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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
        apiRef.current.setLoading(false);
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

export default function PromptWithDataSampling() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 10000,
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        slots={{
          toolbar: ToolbarWithPromptInput,
        }}
        showToolbar
      />
    </div>
  );
}
