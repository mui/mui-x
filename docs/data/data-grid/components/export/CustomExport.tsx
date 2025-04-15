import * as React from 'react';
import {
  DataGridPremium,
  GridPaginationModel,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DownloadIcon from '@mui/icons-material/Download';
// Define the data structure
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Mock API function to simulate server-side data fetching
const fetchUsers = async (
  page: number,
  pageSize: number,
): Promise<{ rows: User[]; rowCount: number }> => {
  // Simulate API delay
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  // Generate mock data
  const total = 100;
  const start = page * pageSize;
  const end = Math.min(start + pageSize, total);

  const rows = Array.from({ length: end - start }, (_, index) => ({
    id: start + index + 1,
    name: `User ${start + index + 1}`,
    email: `user${start + index + 1}@example.com`,
    role: index % 2 === 0 ? 'Admin' : 'User',
  }));

  return { rows, rowCount: total };
};

// Mock API function to fetch all data for export
const fetchAllUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  // Generate all mock data
  return Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: index % 2 === 0 ? 'Admin' : 'User',
  }));
};

function CustomExport() {
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<User[]>([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const apiRef = useGridApiRef();

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 130 },
  ];

  const handleExport = async () => {
    setLoading(true);
    try {
      const allData = await fetchAllUsers();
      apiRef.current?.updateRows(allData);
      await apiRef.current?.exportDataAsExcel();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchUsers(
          paginationModel.page,
          paginationModel.pageSize,
        );
        setRows(response.rows);
        setRowCount(response.rowCount);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [paginationModel]);

  return (
    <div style={{ height: 520, width: '100%' }}>
      <Box gap={1} mb={1} flexWrap="wrap">
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={loading}
        >
          Export to Excel
        </Button>
      </Box>
      <Box style={{ height: 480, width: '100%' }}>
        <DataGridPremium
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          loading={loading}
          paginationMode="server"
          pagination
        />
      </Box>
    </div>
  );
}

export default CustomExport;
