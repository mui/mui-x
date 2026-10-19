// Review surface for the density enhancer PR, routed from
// `docs/pages/x/density-experiment.js` (the export only lists `.js` pages, and
// drops `/experiments/` under DEPLOY_ENV=production). Remove or turn into a
// docs demo before merge.
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {
  DataGridPremium,
  GridActionsCellItem,
  GridCheckIcon,
  GridColDef,
  GridDeleteIcon,
  unstable_enhanceDensity as enhanceGrid,
} from '@mui/x-data-grid-premium';
import DensityExperimentShell, { createEnhancedTheme } from './DensityExperimentShell';

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

const enhanced = createEnhancedTheme(enhanceGrid);

export default function DensityExperiment() {
  return (
    <DensityExperimentShell
      title="Data Grid density — material enhancer + grid enhancer chain"
      description={
        <React.Fragment>
          Right column:{' '}
          <code>
            enhanceGrid(enhanceMaterial(createTheme(
            {'{ cssVariables: { cssVarPrefix: "density" } }'})))
          </code>{' '}
          with the Premium enhancer (Pro and community underneath). Open the columns panel, filter
          panel, pivot sidebar and AI assistant, edit a cell, expand the quick filter.
        </React.Fragment>
      }
      enhanced={enhanced}
      componentNames={['MuiDataGrid']}
    >
      {() => (
        <React.Fragment>
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
        </React.Fragment>
      )}
    </DensityExperimentShell>
  );
}
