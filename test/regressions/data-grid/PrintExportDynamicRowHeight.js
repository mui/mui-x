import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const CELL_PADDING_MAP = {
  compact: { py: 0, px: 0 },
  standard: { py: 1, px: 0.5 },
  comfortable: { py: 2, px: 1 },
};

export default function PrintExportDynamicRowHeight() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    { id: 10, lastName: 'Baratheon', firstName: 'Robert', age: 48 },
    { id: 11, lastName: 'Baratheon', firstName: 'Stannis', age: 45 },
    { id: 12, lastName: 'Baratheon', firstName: 'Renly', age: 27 },
    { id: 13, lastName: 'Tyrell', firstName: 'Margaery', age: 23 },
    { id: 14, lastName: 'Tyrell', firstName: 'Loras', age: 25 },
    { id: 15, lastName: 'Greyjoy', firstName: 'Balon', age: 56 },
    { id: 16, lastName: 'Greyjoy', firstName: 'Theon', age: 20 },
    { id: 17, lastName: 'Mormont', firstName: 'Jorah', age: 46 },
    { id: 18, lastName: 'Bolton', firstName: 'Ramsay', age: 21 },
    { id: 19, lastName: 'Tully', firstName: 'Catelyn', age: 40 },
    { id: 20, lastName: 'Arryn', firstName: 'Robin', age: 9 },
    { id: 21, lastName: 'Sand', firstName: 'Oberyn', age: 42 },
    { id: 22, lastName: 'Sand', firstName: 'Ellaria', age: 38 },
    { id: 23, lastName: 'Seaworth', firstName: 'Davos', age: 49 },
    { id: 24, lastName: 'Hound', firstName: 'Sandor', age: 35 },
    { id: 25, lastName: 'Mountain', firstName: 'Gregor', age: 40 },
    { id: 26, lastName: 'Payne', firstName: 'Podrick', age: 16 },
    { id: 27, lastName: 'Reed', firstName: 'Meera', age: 17 },
    { id: 28, lastName: 'Reed', firstName: 'Jojen', age: 15 },
    { id: 29, lastName: 'Baelish', firstName: 'Petyr', age: 38 },
    { id: 30, lastName: 'Varys', firstName: null, age: 50 },
    { id: 31, lastName: 'Martell', firstName: 'Doran', age: 55 },
    { id: 32, lastName: 'Martell', firstName: 'Trystane', age: 18 },
    { id: 33, lastName: 'Karstark', firstName: 'Rickard', age: 52 },
    { id: 34, lastName: 'Karstark', firstName: 'Alys', age: 22 },
    { id: 35, lastName: 'Umber', firstName: 'Greatjon', age: 44 },
    { id: 36, lastName: 'Umber', firstName: 'Smalljon', age: 28 },
    { id: 37, lastName: 'Dayne', firstName: 'Arthur', age: 30 },
    { id: 38, lastName: 'Dayne', firstName: 'Ashara', age: 24 },
    { id: 39, lastName: 'Frey', firstName: 'Walder', age: 90 },
    { id: 40, lastName: 'Frey', firstName: 'Roslin', age: 16 },
    { id: 41, lastName: 'Blackwood', firstName: 'Bethany', age: 33 },
    { id: 42, lastName: 'Blackwood', firstName: 'Tytos', age: 60 },
    { id: 43, lastName: 'Bracken', firstName: 'Jonos', age: 42 },
    { id: 44, lastName: 'Bracken', firstName: 'Amerei', age: 19 },
    { id: 45, lastName: 'Harlaw', firstName: 'Rodrik', age: 47 },
    { id: 46, lastName: 'Harlaw', firstName: 'Sigfryd', age: 40 },
    { id: 47, lastName: 'Strong', firstName: 'Harwin', age: 36 },
    { id: 48, lastName: 'Strong', firstName: 'Larys', age: 32 },
    { id: 49, lastName: 'Velaryon', firstName: 'Corlys', age: 54 },
    { id: 50, lastName: 'Velaryon', firstName: 'Laena', age: 22 },
    { id: 51, lastName: 'Velaryon', firstName: 'Laenor', age: 20 },
    { id: 52, lastName: 'Hightower', firstName: 'Alicent', age: 40 },
    { id: 53, lastName: 'Hightower', firstName: 'Otto', age: 60 },
    { id: 54, lastName: 'Clegane', firstName: 'Gregor', age: 40 },
    { id: 55, lastName: 'Clegane', firstName: 'Sandor', age: 35 },
    { id: 56, lastName: 'Royce', firstName: 'Yohn', age: 58 },
    { id: 57, lastName: 'Royce', firstName: 'Andar', age: 27 },
    { id: 58, lastName: 'Caron', firstName: 'Bryce', age: 34 },
    { id: 59, lastName: 'Tarth', firstName: 'Brienne', age: 32 },
    { id: 60, lastName: 'Dondarrion', firstName: 'Beric', age: 41 },
  ];

  return (
    <div className="App">
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          showToolbar
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          sx={[
            {
              [`& .MuiDataGrid-cell`]: {
                py: CELL_PADDING_MAP.comfortable.py,
                px: CELL_PADDING_MAP.comfortable.px,
                alignContent: 'center',
              },
              '@media print': {
                [`& .MuiDataGrid-cell`]: {
                  py: CELL_PADDING_MAP.compact.py,
                  px: CELL_PADDING_MAP.compact.px,
                },
              },
            },
          ]}
        />
      </Box>
    </div>
  );
}
