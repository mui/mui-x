import * as React from 'react';
import { DataGridPro, GridColumns, GridRowsProp } from '@mui/x-data-grid-pro';

const rows: GridRowsProp = [
  {
    hierarchy: ['Sarah'],
    jobTitle: 'CEO',
    recruitmentDate: new Date(2014, 7, 22),
    id: 0,
  },
  {
    hierarchy: ['Sarah', 'Thomas'],
    jobTitle: 'Head of Sales',
    recruitmentDate: new Date(2017, 3, 4),
    id: 1,
  },
  {
    hierarchy: ['Sarah', 'Thomas', 'Robert'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 11, 20),
    id: 2,
  },
  {
    hierarchy: ['Sarah', 'Thomas', 'Karen'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 10, 14),
    id: 3,
  },
  {
    hierarchy: ['Sarah', 'Thomas', 'Nancy'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2018, 3, 29),
    id: 4,
  },
  {
    hierarchy: ['Sarah', 'Thomas', 'Daniel'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 21),
    id: 5,
  },
  {
    hierarchy: ['Sarah', 'Thomas', 'Christopher'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 20),
    id: 6,
  },
  {
    hierarchy: ['Sarah', 'Thomas', 'Donald'],
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2019, 6, 28),
    id: 7,
  },
  {
    hierarchy: ['Sarah', 'Mary'],
    jobTitle: 'Head of Engineering',
    recruitmentDate: new Date(2016, 3, 14),
    id: 8,
  },
  {
    hierarchy: ['Sarah', 'Mary', 'Jennifer'],
    jobTitle: 'Tech lead front',
    recruitmentDate: new Date(2016, 5, 17),
    id: 9,
  },
  {
    hierarchy: ['Sarah', 'Mary', 'Jennifer', 'Anna'],
    jobTitle: 'Front-end developer',
    recruitmentDate: new Date(2019, 11, 7),
    id: 10,
  },
  {
    hierarchy: ['Sarah', 'Mary', 'Michael'],
    jobTitle: 'Tech lead devops',
    recruitmentDate: new Date(2021, 7, 1),
    id: 11,
  },
  {
    hierarchy: ['Sarah', 'Mary', 'Linda'],
    jobTitle: 'Tech lead back',
    recruitmentDate: new Date(2017, 0, 12),
    id: 12,
  },
  {
    hierarchy: ['Sarah', 'Mary', 'Linda', 'Elizabeth'],
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2019, 2, 22),
    id: 13,
  },
  {
    hierarchy: ['Sarah', 'Mary', 'Linda', 'William'],
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2018, 4, 19),
    id: 14,
  },
];

const columns: GridColumns = [
  { field: 'jobTitle', headerName: 'Job Title', width: 200 },
  {
    field: 'recruitmentDate',
    headerName: 'Recruitment Date',
    type: 'date',
    width: 150,
  },
];

const getTreeDataPath = (row) => row.hierarchy;

export default function BasicTreeData() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        treeData
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        getTreeDataPath={getTreeDataPath}
      />
    </div>
  );
}
