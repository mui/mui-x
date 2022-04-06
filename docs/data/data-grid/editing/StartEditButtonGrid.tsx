import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  GridColumns,
  GridRowsProp,
  DataGrid,
  GridCellModes,
  GridCellParams,
  GridCellModesModel,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

interface EditToolbarProps {
  selectedCellParams?: any;
  setSelectedCellParams: (value: any) => void;
  cellModesModel: GridCellModesModel;
  setCellModesModel: (value: GridCellModesModel) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const {
    selectedCellParams,
    setSelectedCellParams,
    cellModesModel,
    setCellModesModel,
  } = props;

  const handleSaveOrEdit = () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field, cellMode } = selectedCellParams;
    if (cellMode === 'edit') {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[field], [field]: { mode: GridCellModes.View } },
      });
      setSelectedCellParams({ ...selectedCellParams, cellMode: 'view' });
    } else {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[field], [field]: { mode: GridCellModes.Edit } },
      });
      setSelectedCellParams({ ...selectedCellParams, cellMode: 'edit' });
    }
  };

  const handleCancel = () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field } = selectedCellParams;
    setCellModesModel({
      ...cellModesModel,
      [id]: {
        ...cellModesModel[field],
        [field]: { mode: GridCellModes.View, ignoreModifications: true },
      },
    });
  };

  const handleMouseDown = (event) => {
    // Keep the focus in the cell
    event.preventDefault();
  };

  const cellMode = React.useMemo(() => {
    if (!selectedCellParams) {
      return 'view';
    }
    const { id, field } = selectedCellParams;
    return cellModesModel[id]?.[field]?.mode || 'view';
  }, [cellModesModel, selectedCellParams]);

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        p: 1,
      }}
    >
      <Button
        onClick={handleSaveOrEdit}
        onMouseDown={handleMouseDown}
        disabled={!selectedCellParams}
        color="primary"
        variant="outlined"
      >
        {selectedCellParams?.cellMode === 'edit' ? 'Save' : 'Edit'}
      </Button>
      <Button
        onClick={handleCancel}
        onMouseDown={handleMouseDown}
        disabled={cellMode === 'view'}
        color="primary"
        variant="outlined"
        sx={{ ml: 1 }}
      >
        Cancel
      </Button>
    </Box>
  );
}

export default function StartEditButtonGrid() {
  const [selectedCellParams, setSelectedCellParams] =
    React.useState<GridCellParams | null>(null);
  const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});

  const handleCellClick = React.useCallback((params: GridCellParams) => {
    setSelectedCellParams(params);
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        cellModesModel={cellModesModel}
        onCellClick={handleCellClick}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: {
            selectedCellParams,
            setSelectedCellParams,
            cellModesModel,
            setCellModesModel,
          },
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
}

const columns: GridColumns = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: randomTraderName(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
