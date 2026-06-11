import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import {
  DataGridPro,
  GridMultiSelectCell,
  GridEditMultiSelectCell,
} from '@mui/x-data-grid-pro';

const tagColorMap = {
  Bug: 'error',
  Feature: 'primary',
  Enhancement: 'info',
  Documentation: 'warning',
  Performance: 'success',
};

const tagOptions = Object.keys(tagColorMap);

const departmentColors = {
  Support: { bg: '#f0f0f0', color: '#555' },
  Sales: { bg: '#e8dff5', color: '#6b21a8' },
  Marketing: { bg: '#dbeafe', color: '#1e40af' },
  Product: { bg: '#fce7f3', color: '#9d174d' },
  DevEx: { bg: '#ffedd5', color: '#9a3412' },
  Design: { bg: '#fef9c3', color: '#854d0e' },
  'Engineering Management': { bg: '#e8e0d8', color: '#78716c' },
  Legal: { bg: '#dcfce7', color: '#166534' },
  Operations: { bg: '#e5e5e5', color: '#525252' },
  People: { bg: '#fef3c7', color: '#92400e' },
  Finance: { bg: '#dbeafe', color: '#1e3a8a' },
  Engineering: { bg: '#ffe4e6', color: '#be123c' },
};

const departmentOptions = Object.keys(departmentColors);

const userOptions = [
  { value: 'alice', label: 'Alice', avatar: 'A' },
  { value: 'bob', label: 'Bob', avatar: 'B' },
  { value: 'charlie', label: 'Charlie', avatar: 'C' },
  { value: 'diana', label: 'Diana', avatar: 'D' },
  { value: 'eve', label: 'Eve', avatar: 'E' },
];

const rows = [
  {
    id: 1,
    title: 'Fix login crash',
    tags: ['Bug'],
    assignees: ['alice', 'bob'],
    departments: ['Engineering', 'Support'],
  },
  {
    id: 2,
    title: 'Add dark mode',
    tags: ['Feature', 'Enhancement'],
    assignees: ['charlie'],
    departments: ['Design', 'Product'],
  },
  {
    id: 3,
    title: 'Update API docs',
    tags: ['Documentation'],
    assignees: ['diana', 'eve'],
    departments: ['DevEx'],
  },
  {
    id: 4,
    title: 'Optimize queries',
    tags: ['Performance', 'Bug'],
    assignees: ['alice', 'eve', 'bob'],
    departments: ['Engineering', 'Operations'],
  },
];

const getTagChipProps = (value) => ({
  color: tagColorMap[value] ?? 'default',
  variant: 'filled',
});

const getAssigneeChipProps = (option) => ({
  avatar: (
    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{option.avatar}</Avatar>
  ),
});

const getDepartmentChipProps = (value) => {
  const colors = departmentColors[value] ?? { bg: '#f0f0f0', color: '#555' };
  return {
    variant: 'filled',
    sx: {
      backgroundColor: colors.bg,
      color: colors.color,
      fontWeight: 500,
      '& .MuiChip-deleteIcon': {
        color: colors.color,
        opacity: 0.6,
        '&:hover': { opacity: 1, color: colors.color },
      },
    },
  };
};

const renderDepartmentOption = (props, option, { selected }) => {
  const colors = departmentColors[option] ?? { bg: '#f0f0f0', color: '#555' };
  return (
    <li {...props}>
      <Checkbox checked={selected} sx={{ mr: 1, p: 0 }} />
      <Chip
        label={option}
        size="small"
        sx={{
          backgroundColor: colors.bg,
          color: colors.color,
          fontWeight: 500,
        }}
      />
    </li>
  );
};

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
  {
    field: 'departments',
    headerName: 'Departments (custom options)',
    type: 'multiSelect',
    width: 280,
    editable: true,
    valueOptions: departmentOptions,
    renderCell: (params) => (
      <GridMultiSelectCell
        {...params}
        slotProps={{ chip: getDepartmentChipProps }}
      />
    ),
    renderEditCell: (params) => (
      <GridEditMultiSelectCell
        {...params}
        slotProps={{
          chip: getDepartmentChipProps,
          autocomplete: { renderOption: renderDepartmentOption },
        }}
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
