import * as React from 'react';
import dayjs from 'dayjs';
import {
  createTheme,
  unstable_enhanceDensity as enhanceMaterialDensity,
  ThemeProvider,
} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  DataGrid,
  GridActionsCellItem,
  GridCellModes,
  GridPreferencePanelsValue,
} from '@mui/x-data-grid';
import { DataGridPremium, GridSidebarValue } from '@mui/x-data-grid-premium';
import { unstable_enhanceDensity as enhanceDataGridDensity } from '@mui/x-data-grid-premium/density';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { unstable_enhanceDensity as enhancePickersDensity } from '@mui/x-date-pickers-pro/density';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { unstable_enhanceDensity as enhanceTreeViewDensity } from '@mui/x-tree-view-pro/density';
import { LineChart } from '@mui/x-charts/LineChart';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { unstable_enhanceDensity as enhanceChartsDensity } from '@mui/x-charts-pro/density';

const colorSchemes = { light: true, dark: true };
const cssVariables = {
  cssVarPrefix: 'density',
  colorSchemeSelector: 'data-mui-color-scheme',
};

const themes = {
  low: enhanceChartsDensity(
    enhanceTreeViewDensity(
      enhancePickersDensity(
        enhanceDataGridDensity(
          enhanceMaterialDensity(
            createTheme({
              cssVariables,
              colorSchemes,
              focusVisible: true,
              typography: {
                body1: { fontSize: '1rem', lineHeight: '22px' },
                body2: { fontSize: '0.9375rem', lineHeight: '20px' },
                caption: { fontSize: '0.875rem', lineHeight: '20px' },
                button: { fontSize: '1rem', lineHeight: '22px' },
              },
            }),
            {
              spacing: {
                xxSmall: 8,
                xSmall: 12,
                small: 16,
                medium: 24,
                large: 32,
                xLarge: 48,
                xxLarge: 64,
              },
              touchTarget: 44,
              iconSize: 24,
            },
          ),
        ),
      ),
    ),
  ),
  medium: enhanceChartsDensity(
    enhanceTreeViewDensity(
      enhancePickersDensity(
        enhanceDataGridDensity(
          enhanceMaterialDensity(
            createTheme({ cssVariables, colorSchemes, focusVisible: true }),
          ),
        ),
      ),
    ),
  ),
  high: enhanceChartsDensity(
    enhanceTreeViewDensity(
      enhancePickersDensity(
        enhanceDataGridDensity(
          enhanceMaterialDensity(
            createTheme({
              cssVariables,
              colorSchemes,
              focusVisible: true,
              typography: {
                body1: { fontSize: '0.75rem', lineHeight: '16px' },
                body2: { fontSize: '0.6875rem', lineHeight: '14px' },
                caption: { fontSize: '0.6875rem', lineHeight: '14px' },
                button: { fontSize: '0.75rem', lineHeight: '16px' },
              },
            }),
            {
              spacing: {
                xxSmall: 2,
                xSmall: 4,
                small: 8,
                medium: 12,
                large: 16,
                xLarge: 24,
                xxLarge: 32,
              },
              touchTarget: 24,
              iconSize: 12,
            },
          ),
        ),
      ),
    ),
  ),
};

const rows = [
  { id: 1, name: 'Ava Martin', team: 'Design', score: 82, active: true },
  { id: 2, name: 'Liam Chen', team: 'Engineering', score: 91, active: false },
  { id: 3, name: 'Noah Patel', team: 'Engineering', score: 77, active: true },
  { id: 4, name: 'Mia Rossi', team: 'Marketing', score: 68, active: true },
  { id: 5, name: 'Lucas Silva', team: 'Design', score: 88, active: false },
];

const columns = [
  { field: 'name', headerName: 'Name', width: 140, editable: true },
  {
    field: 'team',
    headerName: 'Team',
    width: 130,
    type: 'singleSelect',
    valueOptions: ['Design', 'Engineering', 'Marketing'],
    editable: true,
  },
  { field: 'score', headerName: 'Score', type: 'number', width: 90, editable: true },
  {
    field: 'active',
    headerName: 'Active',
    type: 'boolean',
    width: 90,
    editable: true,
  },
  {
    field: 'actions',
    type: 'actions',
    width: 90,
    getActions: () => [
      <GridActionsCellItem key="edit" icon={<EditIcon />} label="Edit" />,
      <GridActionsCellItem key="delete" icon={<DeleteIcon />} label="Delete" />,
    ],
  },
];

const treeItems = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [{ id: 'pickers-pro', label: '@mui/x-date-pickers-pro' }],
  },
  { id: 'charts', label: 'Charts' },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const chartSeries = [
  { label: 'Visits', data: [4, 6, 5, 8, 7, 9] },
  { label: 'Signups', data: [2, 3, 6, 4, 5, 6] },
];

const value = dayjs('2026-04-17T09:30');

export default function DensityDemo() {
  const [density, setDensity] = React.useState('medium');
  const [instance, setInstance] = React.useState('data-grid');

  return (
    <Box sx={{ width: '100%' }}>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ flexWrap: 'wrap', pt: 1, pb: 2 }}
      >
        <TextField
          select
          size="small"
          label="Density"
          value={density}
          onChange={(event) => setDensity(event.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label="Component"
          value={instance}
          onChange={(event) => setInstance(event.target.value)}
          sx={{ minWidth: 280 }}
        >
          <MenuItem value="data-grid">Data Grid</MenuItem>
          <MenuItem value="data-grid-filters">
            Data Grid with the filter panel
          </MenuItem>
          <MenuItem value="data-grid-editing">Data Grid with edit cells</MenuItem>
          <MenuItem value="data-grid-premium">
            Data Grid with row grouping and pivoting{' '}
            <span className="plan-premium" />
          </MenuItem>
          <MenuItem value="date-picker">Date Picker</MenuItem>
          <MenuItem value="date-time-picker">Date Time Picker</MenuItem>
          <MenuItem value="time-picker">Time Picker</MenuItem>
          <MenuItem value="date-field">Date Field</MenuItem>
          <MenuItem value="date-range-calendar">
            Date Range Calendar <span className="plan-pro" />
          </MenuItem>
          <MenuItem value="tree-view">Rich Tree View</MenuItem>
          <MenuItem value="line-chart">Line Chart</MenuItem>
          <MenuItem value="charts-toolbar">
            Charts toolbar <span className="plan-pro" />
          </MenuItem>
        </TextField>
      </Stack>
      <Divider />
      <ThemeProvider theme={themes[density]}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
            {instance === 'data-grid' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  showToolbar
                  checkboxSelection
                  pageSizeOptions={[5, 10]}
                />
              </Box>
            )}
            {instance === 'data-grid-filters' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  showToolbar
                  initialState={{
                    preferencePanel: {
                      open: true,
                      openedPanelValue: GridPreferencePanelsValue.filters,
                    },
                    filter: {
                      filterModel: {
                        items: [{ field: 'team', operator: 'is', value: 'Design' }],
                      },
                    },
                  }}
                />
              </Box>
            )}
            {instance === 'data-grid-editing' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  cellModesModel={{
                    2: {
                      name: { mode: GridCellModes.Edit },
                      score: { mode: GridCellModes.Edit },
                      active: { mode: GridCellModes.Edit },
                    },
                  }}
                />
              </Box>
            )}
            {instance === 'data-grid-premium' && (
              <Box sx={{ width: '100%', height: 460 }}>
                <DataGridPremium
                  rows={rows}
                  columns={columns}
                  showToolbar
                  initialState={{
                    rowGrouping: { model: ['team'] },
                    aggregation: { model: { score: 'avg' } },
                    sidebar: { open: true, value: GridSidebarValue.Pivot },
                  }}
                />
              </Box>
            )}
            {instance === 'date-picker' && <StaticDatePicker defaultValue={value} />}
            {instance === 'date-time-picker' && (
              <StaticDateTimePicker defaultValue={value} />
            )}
            {instance === 'time-picker' && <StaticTimePicker defaultValue={value} />}
            {instance === 'date-field' && (
              <Stack spacing={2}>
                <DateField label="Outlined" defaultValue={value} />
                <DateField label="Filled" variant="filled" defaultValue={value} />
                <DateField
                  label="Standard"
                  variant="standard"
                  defaultValue={value}
                />
              </Stack>
            )}
            {instance === 'date-range-calendar' && (
              <DateRangeCalendar
                defaultValue={[value.subtract(3, 'day'), value.add(4, 'day')]}
              />
            )}
            {instance === 'tree-view' && (
              <Box sx={{ width: 320 }}>
                <RichTreeView
                  items={treeItems}
                  defaultExpandedItems={['grid', 'pickers']}
                  checkboxSelection
                  multiSelect
                  defaultSelectedItems={['grid-pro']}
                />
              </Box>
            )}
            {instance === 'line-chart' && (
              <Box sx={{ width: '100%' }}>
                <LineChart
                  height={300}
                  xAxis={[{ scaleType: 'point', data: months }]}
                  series={[
                    {
                      id: 'visits',
                      label: 'Visits',
                      data: [4, 6, 5, 8, 7, 9],
                      showMark: true,
                    },
                    {
                      id: 'signups',
                      label: 'Signups',
                      data: [2, 3, 6, 4, 5, 6],
                      showMark: true,
                    },
                  ]}
                  tooltipItem={{ type: 'line', seriesId: 'signups', dataIndex: 3 }}
                  slotProps={{
                    tooltip: { trigger: 'item', anchor: 'node', position: 'top' },
                  }}
                />
              </Box>
            )}
            {instance === 'charts-toolbar' && (
              <Box sx={{ width: '100%' }}>
                <LineChartPro
                  height={300}
                  xAxis={[{ scaleType: 'point', data: months, zoom: true }]}
                  series={chartSeries}
                  showToolbar
                />
              </Box>
            )}
          </Box>
        </LocalizationProvider>
      </ThemeProvider>
    </Box>
  );
}
