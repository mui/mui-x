import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const rows = [
  { id: 1, project: 'Alpha', skills: ['React', 'TypeScript'] },
  { id: 2, project: 'Beta', skills: ['Node.js', 'GraphQL', 'TypeScript'] },
  { id: 3, project: 'Gamma', skills: [] },
  { id: 4, project: 'Delta', skills: ['React', 'JavaScript', 'Node.js'] },
];

const columns = [
  { field: 'project', headerName: 'Project', width: 120 },
  {
    field: 'skills',
    headerName: 'Skills',
    type: 'multiSelect',
    width: 250,
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
];

export default function MultiSelectKeyboard() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro rows={rows} columns={columns} />
    </div>
  );
}
