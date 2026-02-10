import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

import {
  DataGridPro,
  GridEditMultiSelectCell,
  GridMultiSelectCell,
} from '@mui/x-data-grid-pro';

const tagColorMap = {
  Bug: 'error',
  Feature: 'primary',
  Enhancement: 'info',
  Documentation: 'warning',
  Performance: 'success',
};

const tagOptions = Object.keys(tagColorMap);

const userOptions = [
  { value: 'alice', label: 'Alice', avatar: 'A' },
  { value: 'bob', label: 'Bob', avatar: 'B' },
  { value: 'charlie', label: 'Charlie', avatar: 'C' },
  { value: 'diana', label: 'Diana', avatar: 'D' },
  { value: 'eve', label: 'Eve', avatar: 'E' },
];

const rows = [
  { id: 1, title: 'Fix login crash', tags: ['Bug'], assignees: ['alice', 'bob'] },
  {
    id: 2,
    title: 'Add dark mode',
    tags: ['Feature', 'Enhancement'],
    assignees: ['charlie'],
  },
  {
    id: 3,
    title: 'Update API docs',
    tags: ['Documentation'],
    assignees: ['diana', 'eve'],
  },
  {
    id: 4,
    title: 'Optimize queries',
    tags: ['Performance', 'Bug'],
    assignees: ['alice', 'eve', 'bob'],
  },
];

const getTagChipProps = (value) => {
  console.log('value', value);
  return {
    color: tagColorMap[value] ?? 'default',
    variant: 'filled',
  };
};

const getAssigneeChipProps = (option) => ({
  avatar: (
    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{option.avatar}</Avatar>
  ),
});

const columns = [
  { field: 'title', headerName: 'Title', width: 160 },
  {
    field: 'tags',
    headerName: 'Tags (colored)',
    type: 'multiSelect',
    width: 220,
    editable: true,
    valueOptions: tagOptions,
    renderCell: (params) => (
      <GridMultiSelectCell {...params} slotProps={{ chip: getTagChipProps }} />
    ),
    renderEditCell: (params) => (
      <GridEditMultiSelectCell {...params} slotProps={{ chip: getTagChipProps }} />
    ),
  },
  {
    field: 'assignees',
    headerName: 'Assignees (avatar)',
    type: 'multiSelect',
    width: 260,
    editable: true,
    valueOptions: userOptions,
    renderCell: (params) => (
      <GridMultiSelectCell {...params} slotProps={{ chip: getAssigneeChipProps }} />
    ),
    renderEditCell: (params) => (
      <GridEditMultiSelectCell
        {...params}
        slotProps={{ chip: getAssigneeChipProps }}
      />
    ),
  },
];

export default function MultiSelectCustomChips() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGridPro rows={rows} columns={columns} />
    </Box>
  );
}
