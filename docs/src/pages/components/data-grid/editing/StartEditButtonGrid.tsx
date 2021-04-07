import Button from '@material-ui/core/Button';
import { XGrid } from '@material-ui/x-grid';
import * as React from 'react';
import {
  DataGrid,
  GridCellParams,
  GridColumns,
  GridRowsProp,
  useGridApiRef,
} from '@material-ui/data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@material-ui/x-grid-data-generator';

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
export default function StartEditButtonGrid() {
  const apiRef = useGridApiRef();
  const [buttonLabel, setButtonLabel] = React.useState('Edit');

  const [
    selectedCellParams,
    setSelectedCellParams,
  ] = React.useState<GridCellParams | null>(null);

  const handleButtonClick = React.useCallback(() => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field, cellMode } = selectedCellParams;
    if (cellMode === 'edit') {
      const editedCellProps = apiRef.current.getEditCellPropsParams(id, field);
      apiRef.current.commitCellChange(editedCellProps);
      apiRef.current.setCellMode(id, field, 'view');
      setButtonLabel('Edit');
    } else {
      apiRef.current.setCellMode(id, field, 'edit');
      setButtonLabel('Save');
    }
    // Or you can use the editRowModel prop, but I find it easier with apiRef
  }, [apiRef, selectedCellParams]);

  const handleCellClick = React.useCallback((params: GridCellParams) => {
    setSelectedCellParams(params);

    const { cellMode } = params;
    if (cellMode === 'edit') {
      setButtonLabel('Save');
    } else {
      setButtonLabel('Edit');
    }
  }, []);

  const handleDoubleCellClick = React.useCallback(
    (params: GridCellParams, event: React.SyntheticEvent) => {
      event.stopPropagation();
    },
    [],
  );

  // Prevent from rolling back on escape
  const handleCellKeyDown = React.useCallback(
    (params, event: React.KeyboardEvent) => {
      if (
        params.cellMode === 'edit' &&
        (event.key === 'Escape' || event.key === 'Delete' || event.key === 'Enter')
      ) {
        event.stopPropagation();
      }
    },
    [],
  );

  // Prevent from committing on blur
  const handleCellBlur = React.useCallback(
    (params, event?: React.SyntheticEvent) => {
      if (params.cellMode === 'edit') {
        event?.stopPropagation();
      }
    },
    [],
  );

  return (
    <XGrid
      rows={rows}
      columns={columns}
      autoHeight
      hideFooter
      apiRef={apiRef}
      onCellClick={handleCellClick}
      onCellDoubleClick={handleDoubleCellClick}
      onCellBlur={handleCellBlur}
      onCellKeyDown={handleCellKeyDown}
      components={{
        Toolbar: () => (
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
            }}
          >
            <Button
              onMouseDown={handleButtonClick}
              disabled={!selectedCellParams}
              color="primary"
            >
              {buttonLabel}
            </Button>
          </div>
        ),
      }}
    />
  );
}
