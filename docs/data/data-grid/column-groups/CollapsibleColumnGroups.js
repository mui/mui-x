import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {
  DataGrid,
  gridColumnVisibilityModelSelector,
  useGridApiContext,
} from '@mui/x-data-grid';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const COLLAPSIBLE_COLUMN_GROUPS = {
  character: ['lastName', 'age'],
  naming: ['lastName'],
};

const ColumnGroupRoot = styled('div')({
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
});

const ColumnGroupTitle = styled('span')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

function CollapsibleHeaderGroup({ groupId, headerName }) {
  const apiRef = useGridApiContext();
  const columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);

  if (!groupId) {
    return null;
  }

  const isCollapsible = Boolean(COLLAPSIBLE_COLUMN_GROUPS[groupId]);
  const isGroupCollapsed = COLLAPSIBLE_COLUMN_GROUPS[groupId].every(
    (field) => columnVisibilityModel[field] === false,
  );

  return (
    <ColumnGroupRoot>
      <ColumnGroupTitle>{headerName ?? groupId}</ColumnGroupTitle>{' '}
      {isCollapsible && (
        <IconButton
          sx={{ ml: 0.5 }}
          onClick={() => {
            const newModel = { ...columnVisibilityModel };
            COLLAPSIBLE_COLUMN_GROUPS[groupId].forEach((field) => {
              newModel[field] = !!isGroupCollapsed;
            });
            apiRef.current.setColumnVisibilityModel(newModel);
          }}
        >
          {isGroupCollapsed ? (
            <KeyboardArrowRightIcon fontSize="small" />
          ) : (
            <KeyboardArrowDownIcon fontSize="small" />
          )}
        </IconButton>
      )}
    </ColumnGroupRoot>
  );
}

const columnGroupingModel = [
  {
    groupId: 'Internal',
    description: '',
    children: [{ field: 'id' }],
  },
  {
    groupId: 'character',
    description: 'Information about the character',
    headerName: 'Basic info',
    renderHeaderGroup: (params) => {
      return <CollapsibleHeaderGroup {...params} />;
    },
    children: [
      {
        groupId: 'naming',
        headerName: 'Names',
        renderHeaderGroup: (params) => <CollapsibleHeaderGroup {...params} />,
        children: [{ field: 'lastName' }, { field: 'firstName' }],
      },
      { field: 'age' },
    ],
  },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'firstName', headerName: 'First name', width: 150 },
  { field: 'lastName', headerName: 'Last name', width: 150 },
  { field: 'age', headerName: 'Age', type: 'number', width: 110 },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function CollapsibleColumnGroups() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        columnGroupingModel={columnGroupingModel}
      />
    </Box>
  );
}
