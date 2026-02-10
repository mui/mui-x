import * as React from 'react';
import {
  DataGridPro,
  GridColDef,
  GridEditMultiSelectCell,
  GridEditMultiSelectCellProps,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { Box, Typography } from '@mui/material';

const categorySubcategoryMap: Record<string, string[]> = {
  Frontend: ['React', 'Vue', 'Angular', 'Svelte'],
  Backend: ['Node.js', 'Django', 'Spring', 'Rails'],
  Database: ['PostgreSQL', 'MongoDB', 'Redis', 'DynamoDB'],
  DevOps: ['Docker', 'Kubernetes', 'Terraform', 'Ansible'],
};

const allCategories = Object.keys(categorySubcategoryMap);
const allSubcategories = [...new Set(Object.values(categorySubcategoryMap).flat())];

const rows = [
  { id: 1, project: 'Web App', categories: ['Frontend', 'Backend'], subcategories: ['React', 'Node.js'] },
  { id: 2, project: 'Data Service', categories: ['Backend', 'Database'], subcategories: ['Django', 'PostgreSQL'] },
  { id: 3, project: 'Infra Setup', categories: ['DevOps'], subcategories: ['Docker', 'Kubernetes'] },
];

function CustomCategoryEditCell(props: GridEditMultiSelectCellProps) {
  const apiRef = useGridApiContext();

  const handleValueChange = async () => {
    await apiRef.current.setEditCellValue({
      id: props.id,
      field: 'subcategories',
      value: [],
    });
  };

  return <GridEditMultiSelectCell onValueChange={handleValueChange} {...props} />;
}

const columns: GridColDef[] = [
  { field: 'project', headerName: 'Project', width: 140 },
  {
    field: 'categories',
    headerName: 'Categories',
    type: 'multiSelect',
    width: 250,
    editable: true,
    valueOptions: allCategories,
    renderEditCell: (params) => <CustomCategoryEditCell {...params} />,
  },
  {
    field: 'subcategories',
    headerName: 'Subcategories',
    type: 'multiSelect',
    width: 300,
    editable: true,
    valueOptions: ({ row }) => {
      if (!row) {
        return allSubcategories;
      }
      const cats: string[] = row.categories ?? [];
      return cats.flatMap((cat) => categorySubcategoryMap[cat] ?? []);
    },
  },
];

export default function MultiSelectLinkedFields() {
  const [data, setData] = React.useState(rows);

  return (
    <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Recipe: Linked Fields (onValueChange)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Changing Categories resets Subcategories. Subcategory options are filtered by selected
        categories. Uses <code>onValueChange</code> callback + row editing.
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGridPro
          rows={data}
          columns={columns}
          editMode="row"
          processRowUpdate={(newRow) => {
            setData((prev) => prev.map((r) => (r.id === newRow.id ? newRow : r)));
            return newRow;
          }}
        />
      </Box>
    </Box>
  );
}
