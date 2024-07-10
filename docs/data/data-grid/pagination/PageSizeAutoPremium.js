import * as React from 'react';
import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid-premium';

const rows = [
  {
    jobTitle: 'Head of Human Resources',
    recruitmentDate: new Date(2020, 8, 12),
    contract: 'full time',
    id: 0,
  },
  {
    jobTitle: 'Head of Sales',
    recruitmentDate: new Date(2017, 3, 4),
    contract: 'full time',
    id: 1,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 11, 20),
    contract: 'full time',
    id: 2,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 10, 14),
    contract: 'part time',
    id: 3,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2017, 10, 29),
    contract: 'part time',
    id: 4,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 21),
    contract: 'full time',
    id: 5,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 20),
    contract: 'intern',
    id: 6,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2019, 6, 28),
    contract: 'full time',
    id: 7,
  },
  {
    jobTitle: 'Head of Engineering',
    recruitmentDate: new Date(2016, 3, 14),
    contract: 'full time',
    id: 8,
  },
  {
    jobTitle: 'Tech lead front',
    recruitmentDate: new Date(2016, 5, 17),
    contract: 'full time',
    id: 9,
  },
  {
    jobTitle: 'Front-end developer',
    recruitmentDate: new Date(2019, 11, 7),
    contract: 'full time',
    id: 10,
  },
  {
    jobTitle: 'Tech lead devops',
    recruitmentDate: new Date(2021, 7, 1),
    contract: 'full time',
    id: 11,
  },
  {
    jobTitle: 'Tech lead back',
    recruitmentDate: new Date(2017, 0, 12),
    contract: 'full time',
    id: 12,
  },
  {
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2019, 2, 22),
    contract: 'intern',
    id: 13,
  },
  {
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2018, 4, 19),
    contract: 'part time',
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
  {
    field: 'contract',
    headerName: 'Contract Type',
    type: 'singleSelect',
    valueOptions: ['full time', 'part time', 'intern'],
    width: 150,
  },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function PageSizeAutoPremium() {
  return (
    <div style={{ height: 320, width: '100%' }}>
      <DataGridPremium
        pagination
        rows={rows}
        columns={columns}
        slots={{ toolbar: CustomToolbar }}
        autoPageSize
      />
    </div>
  );
}
