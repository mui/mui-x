import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const rows = [
  {
    id: 1,
    name: 'Project Alpha',
    tags: ['React', 'TypeScript'],
    categories: ['fe'],
  },
  {
    id: 2,
    name: 'Project Beta',
    tags: ['Node.js', 'GraphQL', 'TypeScript'],
    categories: ['be', 'db'],
  },
  {
    id: 3,
    name: 'Project Gamma',
    tags: [],
    categories: ['infra'],
  },
  {
    id: 4,
    name: 'Project Delta',
    tags: ['React', 'JavaScript', 'REST', 'Node.js'],
    categories: ['fe', 'be'],
  },
];

const columns = [
  { field: 'name', headerName: 'Project', width: 130 },
  {
    field: 'tags',
    headerName: 'Tags',
    type: 'multiSelect',
    width: 200,
    editable: true,
    valueOptions: [
      'React',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'GraphQL',
      'REST',
    ],
  },
  {
    field: 'categories',
    headerName: 'Categories',
    type: 'multiSelect',
    width: 180,
    editable: true,
    valueOptions: [
      { value: 'fe', label: 'Frontend' },
      { value: 'be', label: 'Backend' },
      { value: 'db', label: 'Database' },
      { value: 'infra', label: 'Infrastructure' },
    ],
  },
];

export default function MultiSelectColumn() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPro rows={rows} columns={columns} />
    </div>
  );
}
