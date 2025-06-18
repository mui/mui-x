import * as React from 'react';
import { DataGridPro, GridLogicOperator } from '@mui/x-data-grid-pro';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

const rows = [
  {
    hierarchy: ['Sarah'],
    jobTitle: 'Head of Human Resources',
    recruitmentDate: new Date(2020, 8, 12),
    id: 0,
  },
  {
    hierarchy: ['Thomas'],
    jobTitle: 'Head of Sales',
    recruitmentDate: new Date(2017, 3, 4),
    id: 1,
  },
  {
    hierarchy: ['Thomas', 'Robert'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 11, 20),
    id: 2,
  },
  {
    hierarchy: ['Thomas', 'Karen'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 10, 14),
    id: 3,
  },
  {
    hierarchy: ['Thomas', 'Nancy'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2017, 10, 29),
    id: 4,
  },
  {
    hierarchy: ['Thomas', 'Daniel'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 21),
    id: 5,
  },
  {
    hierarchy: ['Thomas', 'Christopher'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 20),
    id: 6,
  },
  {
    hierarchy: ['Thomas', 'Donald'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2019, 6, 28),
    id: 7,
  },
  {
    hierarchy: ['Mary'],
    jobTitle: 'Head of Engineering',
    recruitmentDate: new Date(2016, 3, 14),
    id: 8,
  },
  {
    hierarchy: ['Mary', 'Jennifer'],
    jobTitle: 'Tech lead front',
    recruitmentDate: new Date(2016, 5, 17),
    id: 9,
  },
  {
    hierarchy: ['Mary', 'Jennifer', 'Anna'],
    jobTitle: 'Front-end developer',
    recruitmentDate: new Date(2019, 11, 7),
    id: 10,
  },
  {
    hierarchy: ['Mary', 'Michael'],
    jobTitle: 'Tech lead devops',
    recruitmentDate: new Date(2021, 7, 1),
    id: 11,
  },
  {
    hierarchy: ['Mary', 'Linda'],
    jobTitle: 'Tech lead back',
    recruitmentDate: new Date(2017, 0, 12),
    id: 12,
  },
  {
    hierarchy: ['Mary', 'Linda', 'Elizabeth'],
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2019, 2, 22),
    id: 13,
  },
  {
    hierarchy: ['Mary', 'Linda', 'William'],
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2018, 4, 19),
    id: 14,
  },
];

const columns = [
  { field: 'jobTitle', headerName: 'Job Title', width: 200 },
  {
    field: 'recruitmentDate',
    headerName: 'Recruitment Date',
    type: 'date',
    width: 150,
  },
];

const getTreeDataPath = (row) => row.hierarchy;

export default function TreeDataDisableChildrenFiltering() {
  const [disableChildrenFiltering, setDisableChildrenFiltering] =
    React.useState(true);
  const [filterModel, setFilterModel] = React.useState({
    logicOperator: GridLogicOperator.Or,
    items: [
      {
        id: 0,
        field: 'recruitmentDate',
        operator: 'before',
        value: '2018-01-01',
      },
    ],
  });

  return (
    <Box sx={{ width: '100%' }}>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={disableChildrenFiltering}
              onChange={(event) => setDisableChildrenFiltering(event.target.checked)}
            />
          }
          label={
            <Typography component="span">
              Apply <code>disableChildrenFiltering</code>
            </Typography>
          }
        />
      </FormGroup>
      <Box sx={{ height: 400, pt: 1 }}>
        <DataGridPro
          treeData
          rows={rows}
          columns={columns}
          disableChildrenFiltering={disableChildrenFiltering}
          getTreeDataPath={getTreeDataPath}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          defaultGroupingExpansionDepth={1}
        />
      </Box>
    </Box>
  );
}
