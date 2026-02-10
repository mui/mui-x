import * as React from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { Box, Typography } from '@mui/material';

const departmentSkillsMap: Record<string, string[]> = {
  Engineering: ['React', 'TypeScript', 'Python', 'Go', 'Docker', 'AWS'],
  Design: ['Figma', 'Sketch', 'Illustrator', 'CSS', 'Prototyping'],
  Marketing: ['SEO', 'Analytics', 'Content', 'Social Media', 'Email'],
  Sales: ['CRM', 'Negotiation', 'Prospecting', 'Demos', 'Closing'],
};

const allSkills = [...new Set(Object.values(departmentSkillsMap).flat())];

const rows = [
  { id: 1, name: 'Alice', department: 'Engineering', skills: ['React', 'TypeScript'] },
  { id: 2, name: 'Bob', department: 'Design', skills: ['Figma', 'CSS'] },
  { id: 3, name: 'Charlie', department: 'Marketing', skills: ['SEO', 'Analytics'] },
  { id: 4, name: 'Diana', department: 'Sales', skills: ['CRM', 'Demos'] },
  { id: 5, name: 'Eve', department: 'Engineering', skills: ['Python', 'Docker', 'AWS'] },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 120 },
  {
    field: 'department',
    headerName: 'Department',
    type: 'singleSelect',
    width: 140,
    editable: true,
    valueOptions: Object.keys(departmentSkillsMap),
  },
  {
    field: 'skills',
    headerName: 'Skills',
    type: 'multiSelect',
    width: 300,
    editable: true,
    valueOptions: ({ row }) => {
      if (!row) {
        return allSkills;
      }
      return departmentSkillsMap[row.department] ?? [];
    },
  },
];

export default function MultiSelectDynamicOptions() {
  const [data, setData] = React.useState(rows);

  return (
    <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Recipe: Dynamic Value Options
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Skills options change based on the Department. <code>valueOptions</code> is a function that
        receives the row and returns department-specific options.
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
