import * as React from 'react';
import { DataGridPro, GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { Avatar, Box, Chip, Typography } from '@mui/material';

interface UserOption {
  value: string;
  label: string;
  avatar: string;
}

const userOptions: UserOption[] = [
  { value: 'alice', label: 'Alice', avatar: 'A' },
  { value: 'bob', label: 'Bob', avatar: 'B' },
  { value: 'charlie', label: 'Charlie', avatar: 'C' },
  { value: 'diana', label: 'Diana', avatar: 'D' },
  { value: 'eve', label: 'Eve', avatar: 'E' },
  { value: 'frank', label: 'Frank', avatar: 'F' },
];

const avatarColors: Record<string, string> = {
  alice: '#e91e63',
  bob: '#2196f3',
  charlie: '#4caf50',
  diana: '#ff9800',
  eve: '#9c27b0',
  frank: '#009688',
};

const rows = [
  { id: 1, task: 'Design system revamp', assignees: ['alice', 'bob'] },
  { id: 2, task: 'API migration', assignees: ['charlie', 'diana', 'eve'] },
  { id: 3, task: 'Performance audit', assignees: ['frank'] },
  { id: 4, task: 'Security review', assignees: ['alice', 'eve', 'frank'] },
  { id: 5, task: 'Docs update', assignees: [] },
];

function AvatarChipsCell(params: GridRenderCellParams) {
  const values: string[] = params.value ?? [];
  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center', height: '100%' }}>
      {values.map((userId) => {
        const user = userOptions.find((u) => u.value === userId);
        if (!user) return null;
        return (
          <Chip
            key={userId}
            label={user.label}
            size="small"
            avatar={
              <Avatar sx={{ bgcolor: avatarColors[userId], width: 24, height: 24, fontSize: 12 }}>
                {user.avatar}
              </Avatar>
            }
          />
        );
      })}
    </Box>
  );
}

const columns: GridColDef[] = [
  { field: 'task', headerName: 'Task', width: 200 },
  {
    field: 'assignees',
    headerName: 'Assignees',
    type: 'multiSelect',
    width: 350,
    editable: true,
    display: 'flex',
    valueOptions: userOptions,
    renderCell: (params) => <AvatarChipsCell {...params} />,
  },
];

export default function MultiSelectAvatarChips() {
  const [data, setData] = React.useState(rows);

  return (
    <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Recipe: Avatar Chips (Assignees)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Custom <code>renderCell</code> with Avatar inside each Chip. Uses object-based{' '}
        <code>valueOptions</code> with <code>value</code>/<code>label</code> mapping.
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGridPro
          rows={data}
          columns={columns}
          processRowUpdate={(newRow) => {
            setData((prev) => prev.map((r) => (r.id === newRow.id ? newRow : r)));
            return newRow;
          }}
        />
      </Box>
    </Box>
  );
}
