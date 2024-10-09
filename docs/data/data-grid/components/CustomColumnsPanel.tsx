import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridColumnGroup,
  GridColumnGroupingModel,
  GridColumnVisibilityModel,
  gridColumnVisibilityModelSelector,
  useGridApiContext,
  useGridRootProps,
  isLeaf,
  GridApi,
  gridColumnLookupSelector,
  GridColumnLookup,
  useGridSelector,
  GridColumnsPanelProps,
  GridColumnsPanel,
  GridPreferencePanelsValue,
} from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';

const getColumnGroupLeaves = (
  group: GridColumnGroup,
  callback: (field: string) => void,
) => {
  group.children.forEach((child) => {
    if (isLeaf(child)) {
      callback(child.field);
    } else {
      getColumnGroupLeaves(child, callback);
    }
  });
};

function ColumnGroup({
  group,
  columnLookup,
  apiRef,
  columnVisibilityModel,
}: {
  group: GridColumnGroup;
  columnLookup: GridColumnLookup;
  apiRef: React.MutableRefObject<GridApi>;
  columnVisibilityModel: GridColumnVisibilityModel;
}) {
  const leaves = React.useMemo(() => {
    const fields: string[] = [];
    getColumnGroupLeaves(group, (field) => fields.push(field));
    return fields;
  }, [group]);

  const { isGroupChecked, isGroupIndeterminate } = React.useMemo(() => {
    return {
      isGroupChecked: leaves.every(
        (field) => columnVisibilityModel[field] !== false,
      ),
      isGroupIndeterminate:
        leaves.some((field) => columnVisibilityModel[field] === false) &&
        !leaves.every((field) => columnVisibilityModel[field] === false),
    };
  }, [columnVisibilityModel, leaves]);

  const toggleColumnGroup = (checked: boolean) => {
    const newColumnVisibilityModel = {
      ...columnVisibilityModel,
    };
    getColumnGroupLeaves(group, (field) => {
      newColumnVisibilityModel[field] = checked;
    });
    apiRef.current.setColumnVisibilityModel(newColumnVisibilityModel);
  };

  const toggleColumn = (field: string, checked: boolean) => {
    apiRef.current.setColumnVisibility(field, checked);
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={isGroupChecked}
            indeterminate={isGroupIndeterminate}
            size="small"
            sx={{ p: 1 }}
          />
        }
        label={group.headerName ?? group.groupId}
        onChange={(_, newValue) => toggleColumnGroup(newValue)}
      />
      <Box sx={{ pl: 3.5 }}>
        {group.children.map((child) => {
          return isLeaf(child) ? (
            <Stack direction="row" key={child.field}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={columnVisibilityModel[child.field] !== false}
                    size="small"
                    sx={{ p: 1 }}
                  />
                }
                label={columnLookup[child.field].headerName ?? child.field}
                onChange={(_, newValue) => toggleColumn(child.field, newValue)}
              />
            </Stack>
          ) : (
            <ColumnGroup
              group={child}
              columnLookup={columnLookup}
              key={child.groupId}
              apiRef={apiRef}
              columnVisibilityModel={columnVisibilityModel}
            />
          );
        })}
      </Box>
    </div>
  );
}

function ColumnsPanel(props: GridColumnsPanelProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const columnLookup = useGridSelector(apiRef, gridColumnLookupSelector);
  const columnVisibilityModel = useGridSelector(
    apiRef,
    gridColumnVisibilityModelSelector,
  );

  const columnGroupingModel = rootProps.columnGroupingModel;

  if (!columnGroupingModel) {
    return <GridColumnsPanel {...props} />;
  }

  return (
    <Box sx={{ px: 2, py: 0.5 }}>
      {columnGroupingModel.map((group) => (
        <ColumnGroup
          group={group}
          columnLookup={columnLookup}
          columnVisibilityModel={columnVisibilityModel}
          key={group.groupId}
          apiRef={apiRef}
        />
      ))}
    </Box>
  );
}

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'Internal',
    description: '',
    children: [{ field: 'id' }],
  },
  {
    groupId: 'character',
    description: 'Information about the character',
    headerName: 'Basic info',
    children: [
      {
        groupId: 'naming',
        headerName: 'Names',
        children: [{ field: 'lastName' }, { field: 'firstName' }],
      },
      { field: 'age' },
    ],
  },
];

const columns: GridColDef[] = [
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

export default function CustomColumnsPanel() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        columnGroupingModel={columnGroupingModel}
        slots={{ columnsPanel: ColumnsPanel }}
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.columns,
          },
        }}
      />
    </Box>
  );
}
