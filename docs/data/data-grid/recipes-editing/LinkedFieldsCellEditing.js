import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridEditSingleSelectCell,
  GridCellEditStopReasons,
} from '@mui/x-data-grid';
import { randomPrice } from '@mui/x-data-grid-generator';

const initialRows = [
  {
    id: 1,
    description: 'Light bill',
    value: randomPrice(0, 1000),
    type: 'Expense',
    account: 'Utilities',
  },
  {
    id: 3,
    description: 'Order #5',
    value: randomPrice(0, 1000),
    type: 'Income',
    account: 'Sales',
  },
  {
    id: 4,
    description: 'Google AdSense',
    value: randomPrice(0, 1000),
    type: 'Income',
    account: 'Ads',
  },
];

function CustomTypeEditComponent(props) {
  const { setRows, ...other } = props;

  const handleValueChange = () => {
    setRows((prevRows) => {
      console.log(prevRows);
      return prevRows.map((row) =>
        row.id === props.id ? { ...row, account: null } : row,
      );
    });
  };

  return <GridEditSingleSelectCell onValueChange={handleValueChange} {...other} />;
}

export default function LinkedFieldsCellEditing() {
  const editingRow = React.useRef(null);
  const [rows, setRows] = React.useState(initialRows);

  const columns = [
    { field: 'description', headerName: 'Description', width: 160, editable: true },
    {
      field: 'value',
      headerName: 'Value',
      type: 'number',
      width: 120,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: ['Income', 'Expense'],
      width: 120,
      editable: true,
      renderEditCell: (params) => (
        <CustomTypeEditComponent setRows={setRows} {...params} />
      ),
    },
    {
      field: 'account',
      headerName: 'Account',
      type: 'singleSelect',
      valueOptions: ({ row }) => {
        if (!row) {
          return [
            'Sales',
            'Investments',
            'Ads',
            'Taxes',
            'Payroll',
            'Utilities',
            'Marketing',
          ];
        }

        return row.type === 'Income'
          ? ['Sales', 'Investments', 'Ads']
          : ['Taxes', 'Payroll', 'Utilities', 'Marketing'];
      },
      width: 140,
      editable: true,
    },
  ];

  const handleCellEditStart = (params) => {
    editingRow.current = rows.find((row) => row.id === params.id) || null;
  };

  const handleCellEditStop = (params) => {
    if (params.reason === GridCellEditStopReasons.escapeKeyDown) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editingRow.current?.id
            ? { ...row, account: editingRow.current?.account }
            : row,
        ),
      );
    }
  };

  const processRowUpdate = (newRow) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === editingRow.current?.id ? newRow : row)),
    );
    return newRow;
  };

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellEditStart={handleCellEditStart}
        onCellEditStop={handleCellEditStop}
        processRowUpdate={processRowUpdate}
      />
    </Box>
  );
}
