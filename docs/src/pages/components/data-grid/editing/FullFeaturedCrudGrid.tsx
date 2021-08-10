import * as React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import {
  GridRowsProp,
  useGridApiRef,
  XGrid,
  GridApiRef,
  GridColumns,
  GridRowId,
  GridApi,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
} from '@material-ui/x-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
  randomId,
} from '@material-ui/x-grid-data-generator';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

const defaultTheme = createMuiTheme();

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    save: {
      color: theme.palette.success.main,
    },
  }),
  { defaultTheme },
);

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

function RowMenuCell(props: RowMenuProps) {
  const { api, id } = props;
  const classes = useStyles();
  const isInEditMode = api.getRowMode(id) === 'edit';

  const handleEditClick = (event) => {
    event.stopPropagation();
    api.setRowMode(id, 'edit');
  };

  const handleSaveClick = (event) => {
    event.stopPropagation();
    api.commitRowChange(id);
    api.setRowMode(id, 'view');

    const row = api.getRow(id);
    api.updateRows([{ ...row, isNew: false }]);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    api.updateRows([{ id, _action: 'delete' }]);
  };

  const handleCancelClick = (event) => {
    event.stopPropagation();
    api.setRowMode(id, 'view');

    const row = api.getRow(id);
    if (row!.isNew) {
      api.updateRows([{ id, _action: 'delete' }]);
    }
  };

  if (isInEditMode) {
    return (
      <div className={classes.root}>
        <IconButton
          color="inherit"
          size="small"
          aria-label="save"
          className={classes.save}
          onClick={handleSaveClick}
        >
          <SaveIcon />
        </IconButton>
        <IconButton
          color="secondary"
          size="small"
          aria-label="cancel"
          onClick={handleCancelClick}
        >
          <CancelIcon />
        </IconButton>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <IconButton
        color="primary"
        size="small"
        aria-label="edit"
        onClick={handleEditClick}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        color="secondary"
        size="small"
        aria-label="delete"
        onClick={handleDeleteClick}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
}

const rows: GridRowsProp = [
  {
    id: randomId(),
    name: randomTraderName(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];

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
  {
    field: 'actions',
    headerName: 'Actions',
    renderCell: RowMenuCell,
    sortable: false,
    width: 120,
    headerAlign: 'center',
    filterable: false,
    align: 'center',
    disableColumnMenu: true,
    disableReorder: true,
  },
];

interface EditToolbarProps {
  apiRef: GridApiRef;
}

function EditToolbar(props: EditToolbarProps) {
  const { apiRef } = props;

  const handleClick = () => {
    const id = randomId();
    apiRef.current.updateRows([{ id, isNew: true }]);
    apiRef.current.setRowMode(id, 'edit');
    setTimeout(() => {
      // Prevent this click from removing the focus
      apiRef.current.setCellFocus(id, 'name');
    });
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const apiRef = useGridApiRef();

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
  ) => {
    event.defaultMuiPrevented = true;
  };

  return (
    <div style={{ height: 500, width: '100%' }}>
      <XGrid
        rows={rows}
        columns={columns}
        apiRef={apiRef}
        editMode="row"
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: { apiRef },
        }}
      />
    </div>
  );
}
