import * as React from 'react';
import {
  DataGridPremium,
  Unstable_GridToolbarPromptControl as GridToolbarPromptControl,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  useGridApiContext,
} from '@mui/x-data-grid-premium';
import {
  mockPromptResolver,
  randomBoolean,
  randomCompanyName,
  randomCountry,
  randomCreatedDate,
  randomEmail,
  randomInt,
  randomJobTitle,
  randomPhoneNumber,
  randomTraderName,
  useDemoData,
} from '@mui/x-data-grid-generator';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function ToolbarWithPromptInput() {
  const apiRef = useGridApiContext();
  const [prompt, setPrompt] = React.useState('');

  const context = React.useMemo(
    () => apiRef.current.unstable_getPromptContext(),
    [apiRef],
  );

  const handleChange = React.useCallback(
    async (event: SelectChangeEvent<string>) => {
      const selectedPrompt = event.target.value;
      setPrompt(selectedPrompt);
      if (selectedPrompt) {
        apiRef.current.setLoading(true);
        const result = await mockPromptResolver(context, selectedPrompt);
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

function createExamples(column: string) {
  switch (column) {
    case 'name':
      return Array.from({ length: 5 }, () => randomTraderName());
    case 'email':
      return Array.from({ length: 5 }, () => randomEmail());
    case 'position':
      return Array.from({ length: 5 }, () => randomJobTitle());
    case 'company':
      return Array.from({ length: 5 }, () => randomCompanyName());
    case 'salary':
      return Array.from({ length: 5 }, () => randomInt(30000, 80000));
    case 'phone':
      return Array.from({ length: 5 }, () => randomPhoneNumber());
    case 'country':
      return Array.from({ length: 5 }, () => randomCountry());
    case 'dateCreated':
      return Array.from({ length: 5 }, () => randomCreatedDate());
    case 'isAdmin':
      return Array.from({ length: 5 }, () => randomBoolean());
    default:
      return [];
  }
}

export default function PromptWithExamples() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 10000,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((column) => ({
        ...column,
        unstable_examples: createExamples(column.field),
      })),
    [data.columns],
  );

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        columns={columns}
        slots={{
          toolbar: ToolbarWithPromptInput,
        }}
        showToolbar
      />
    </div>
  );
}
