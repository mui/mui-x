import * as React from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowId,
  GridColDef,
  GridActionsCell,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { randomCreatedDate, randomUpdatedDate } from '@mui/x-data-grid-generator';

const initialRows = [
  {
    id: 1,
    name: 'Damien',
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
    isAdmin: true,
    country: 'Spain',
    discount: '',
    bio: 'Damien is a software engineer with 5 years of experience in web development. He specializes in React and Node.js.',
  },
  {
    id: 2,
    name: 'Nicolas',
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
    isAdmin: false,
    country: 'France',
    discount: '',
    bio: 'Nicolas is a product manager who loves building user-centric products. He has led multiple successful product launches.',
  },
  {
    id: 3,
    name: 'Kate',
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
    isAdmin: false,
    country: 'Brazil',
    discount: 'junior',
    bio: 'Kate is a junior developer passionate about learning new technologies. She is currently focused on frontend development.',
  },
];

type Row = (typeof initialRows)[number];

interface ActionHandlers {
  deleteUser: (id: GridRowId) => void;
  toggleAdmin: (id: GridRowId) => void;
  duplicateUser: (id: GridRowId) => void;
}

const ActionHandlersContext = React.createContext<ActionHandlers>({
  deleteUser: () => {},
  toggleAdmin: () => {},
  duplicateUser: () => {},
});

function ActionsCell(props: GridRenderCellParams) {
  const { deleteUser, toggleAdmin, duplicateUser } =
    React.useContext(ActionHandlersContext);

  return (
    <GridActionsCell {...props}>
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => deleteUser(props.id)}
      />
      <GridActionsCellItem
        icon={<SecurityIcon />}
        label="Toggle Admin"
        onClick={() => toggleAdmin(props.id)}
        showInMenu
      />
      <GridActionsCellItem
        icon={<FileCopyIcon />}
        label="Duplicate User"
        onClick={() => duplicateUser(props.id)}
        showInMenu
      />
    </GridActionsCell>
  );
}

const columns: GridColDef<Row>[] = [
  { field: 'name', type: 'string' },
  {
    field: 'bio',
    type: 'longText',
    width: 200,
  },
  { field: 'age', type: 'number' },
  { field: 'dateCreated', type: 'date', width: 130 },
  { field: 'lastLogin', type: 'dateTime', width: 180 },
  { field: 'isAdmin', type: 'boolean', width: 120 },
  {
    field: 'country',
    type: 'singleSelect',
    width: 120,
    valueOptions: [
      'Bulgaria',
      'Netherlands',
      'France',
      'United Kingdom',
      'Spain',
      'Brazil',
    ],
  },
  {
    field: 'discount',
    type: 'singleSelect',
    width: 120,
    editable: true,
    valueOptions: ({ row }) => {
      if (row === undefined) {
        return ['EU-resident', 'junior'];
      }
      const options: string[] = [];
      if (!['United Kingdom', 'Brazil'].includes(row.country)) {
        options.push('EU-resident');
      }
      if (row.age < 27) {
        options.push('junior');
      }
      return options;
    },
  },
  {
    field: 'actions',
    type: 'actions',
    width: 80,
    renderCell: (params) => <ActionsCell {...params} />,
  },
];

export default function ColumnTypesGrid() {
  const [rows, setRows] = React.useState<Row[]>(initialRows);

  const deleteUser = React.useCallback((id: GridRowId) => {
    setTimeout(() => {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    });
  }, []);

  const toggleAdmin = React.useCallback((id: GridRowId) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isAdmin: !row.isAdmin } : row,
      ),
    );
  }, []);

  const duplicateUser = React.useCallback((id: GridRowId) => {
    setRows((prevRows) => {
      const rowToDuplicate = prevRows.find((row) => row.id === id)!;
      return [...prevRows, { ...rowToDuplicate, id: Date.now() }];
    });
  }, []);

  const actionHandlers = React.useMemo<ActionHandlers>(
    () => ({
      deleteUser,
      toggleAdmin,
      duplicateUser,
    }),
    [deleteUser, toggleAdmin, duplicateUser],
  );

  return (
    <div style={{ height: 300, width: '100%' }}>
      <ActionHandlersContext.Provider value={actionHandlers}>
        <DataGrid columns={columns} rows={rows} />
      </ActionHandlersContext.Provider>
    </div>
  );
}
