// Review surface for the density enhancer PR, routed from
// `docs/pages/x/density-experiment.js` (the export only lists `.js` pages, and
// drops `/experiments/` under DEPLOY_ENV=production). Remove or turn into a
// docs demo before merge.
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  createTheme,
  ThemeProvider,
  unstable_enhanceDensity as enhanceMaterial,
  Theme,
} from '@mui/material/styles';
import {
  DataGridPremium,
  GridActionsCellItem,
  GridCheckIcon,
  GridColDef,
  GridDeleteIcon,
  unstable_enhanceDensity as enhanceGrid,
} from '@mui/x-data-grid-premium';

const teams = ['Core', 'Grid', 'Pickers', 'Charts', 'Tree View'];
const tags = ['math', 'poetry', 'engines', 'notes', 'navy', 'logic', 'crypto'];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 140, editable: true },
  { field: 'team', headerName: 'Team', width: 120, align: 'right', headerAlign: 'right' },
  { field: 'score', headerName: 'Score', type: 'number', width: 100 },
  { field: 'active', headerName: 'Active', type: 'boolean', width: 90 },
  {
    field: 'tags',
    headerName: 'Tags',
    type: 'multiSelect',
    width: 200,
    editable: true,
    valueOptions: tags,
  },
  { field: 'notes', headerName: 'Notes', type: 'longText', width: 180, editable: true },
  {
    field: 'actions',
    type: 'actions',
    width: 90,
    getActions: () => [
      <GridActionsCellItem key="e" icon={<GridCheckIcon />} label="Edit" />,
      <GridActionsCellItem key="d" icon={<GridDeleteIcon />} label="Delete" />,
    ],
  },
];

const rows = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  team: teams[i % teams.length],
  score: (i * 37) % 100,
  active: i % 3 !== 0,
  tags: tags.slice(i % 3, (i % 3) + 1 + (i % 4)),
  notes:
    i % 4 === 0
      ? 'Wrote the first algorithm intended for a machine, long before one existed to run it.'
      : 'Short note.',
}));

const vanilla = createTheme({ cssVariables: true });
// Own prefix: a nested ThemeProvider that reuses the outer theme's prefix skips
// its style sheet, so every `var(--mui-*)` ref would fall back to the literal.
const enhanced = enhanceGrid(
  enhanceMaterial(createTheme({ cssVariables: { cssVarPrefix: 'density' } })),
);

function Column({ title, theme }: { title: string; theme: Theme }) {
  const scale = theme.unstable_densityScale;
  return (
    <ThemeProvider theme={theme}>
      <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h6">{title}</Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained">Contained</Button>
          <Button variant="outlined">Outlined</Button>
          <TextField label="Search" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Checkbox" />
          <Chip label="Chip" onDelete={() => {}} />
        </Stack>
        <Box sx={{ height: 640 }}>
          <DataGridPremium
            rows={rows}
            columns={columns}
            showToolbar
            checkboxSelection
            headerFilters
            rowReordering
            aiAssistant
            onPrompt={async () => ({
              select: -1,
              filters: [],
              aggregation: {},
              sorting: [],
              grouping: [],
              pivoting: {},
            })}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              aggregation: { model: { score: 'sum' } },
            }}
            pageSizeOptions={[10, 25]}
          />
        </Box>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 1.5,
            fontSize: 12,
            bgcolor: 'action.hover',
            borderRadius: 1,
            overflow: 'auto',
          }}
        >
          {`theme.unstable_densityScale = ${scale ? JSON.stringify(scale, null, 2) : 'undefined'}\n`}
          {`components.MuiDataGrid.defaultProps = ${JSON.stringify(theme.components?.MuiDataGrid?.defaultProps ?? {})}\n`}
          {`styleOverrides slots: ${Object.keys(theme.components?.MuiDataGrid?.styleOverrides ?? {}).length}`}
        </Box>
      </Stack>
    </ThemeProvider>
  );
}

export default function DensityExperiment() {
  return (
    <ThemeProvider theme={vanilla}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Data Grid density — material enhancer + grid enhancer chain
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Right column:{' '}
          <code>
            enhanceGrid(enhanceMaterial(createTheme(
            {'{ cssVariables: { cssVarPrefix: "density" } }'})))
          </code>{' '}
          with the Premium enhancer (Pro and community underneath). Open the columns panel, filter
          panel, pivot sidebar and AI assistant, edit a cell, expand the quick filter.
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Column title="Vanilla" theme={vanilla} />
          <Column title="Enhanced" theme={enhanced} />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
