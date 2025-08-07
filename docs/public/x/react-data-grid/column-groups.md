# Data Grid - Column groups

Group your columns.

Grouping columns allows you to have a multi-level hierarchy of columns in your header.

## Define column groups

You can define column groups with the `columnGroupingModel` prop.
This prop receives an array of column groups.

A column group is defined by at least two properties:

- `groupId`: a string used to identify the group
- `children`: an array containing the children of the group

The `children` attribute can contain two types of objects:

- leafs with type `{ field: string }`, which add the column with the corresponding `field` to this group.
- other column groups which allows you to have nested groups.

:::warning
A column can only be associated with one group.
:::

```jsx
<DataGrid
  columnGroupingModel={[
    {
      groupId: 'internal data',
      children: [{ field: 'id' }],
    },
    {
      groupId: 'character',
      children: [
        {
          groupId: 'naming',
          children: [{ field: 'lastName' }, { field: 'firstName' }],
        },
        { field: 'age' },
      ],
    },
  ]}
/>
```

```tsx
import * as React from 'react';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
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
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'Internal',
    description: '',
    children: [{ field: 'id' }],
  },
  {
    groupId: 'Basic info',
    children: [
      {
        groupId: 'Full name',
        children: [{ field: 'lastName' }, { field: 'firstName' }],
      },
      { field: 'age' },
    ],
  },
];

export default function BasicGroupingDemo() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        columnGroupingModel={columnGroupingModel}
      />
    </div>
  );
}

```

## Customize column group

In addition to the required `groupId` and `children`, you can use the following optional properties to customize a column group:

- `headerName`: the string displayed as the column's name (instead of `groupId`).
- `description`: a text for the tooltip.
- `headerClassName`: a CSS class for styling customization.
- `renderHeaderGroup`: a function returning custom React component.

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridColDef,
  GridColumnGroupHeaderParams,
  GridColumnGroupingModel,
} from '@mui/x-data-grid';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 150 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
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
];

interface HeaderWithIconProps extends GridColumnGroupHeaderParams {
  icon: React.ReactNode;
}

const HeaderWithIconRoot = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  '& span': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight: theme.spacing(0.5),
  },
}));

function HeaderWithIcon(props: HeaderWithIconProps) {
  const { icon, ...params } = props;

  return (
    <HeaderWithIconRoot>
      <span>{params.headerName ?? params.groupId}</span> {icon}
    </HeaderWithIconRoot>
  );
}

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'internal_data',
    headerName: 'Internal',
    description: '',
    renderHeaderGroup: (params) => (
      <HeaderWithIcon {...params} icon={<BuildIcon fontSize="small" />} />
    ),
    children: [{ field: 'id' }],
  },
  {
    groupId: 'character',
    description: 'Information about the character',
    headerName: 'Basic info',
    renderHeaderGroup: (params) => (
      <HeaderWithIcon {...params} icon={<PersonIcon fontSize="small" />} />
    ),
    children: [
      {
        groupId: 'naming',
        headerName: 'Names',
        headerClassName: 'my-super-theme--naming-group',
        children: [{ field: 'lastName' }, { field: 'firstName' }],
      },
      { field: 'age' },
    ],
  },
];

export default function CustomizationDemo() {
  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
        '& .my-super-theme--naming-group': {
          backgroundColor: 'rgba(255, 7, 0, 0.55)',
        },
      }}
    >
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

```

## Group header height

By default, column group headers are the same height as [column headers](/x/react-data-grid/column-header/#header-height). This will be the default 56 pixels or a custom value set with the `columnHeaderHeight` prop.

The `columnGroupHeaderHeight` prop can be used to size column group headers independently of column headers.

```tsx
import * as React from 'react';
import { DataGrid, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
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
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'Internal',
    description: '',
    children: [{ field: 'id' }],
  },
  {
    groupId: 'Basic info',
    children: [
      {
        groupId: 'Full name',
        children: [{ field: 'lastName' }, { field: 'firstName' }],
      },
      { field: 'age' },
    ],
  },
];

export default function GroupHeaderHeight() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        columnGroupingModel={columnGroupingModel}
        columnGroupHeaderHeight={36}
      />
    </div>
  );
}

```

## Column reordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

By default, the columns that are part of a group cannot be dragged to outside their group.
You can customize this behavior on specific groups by setting `freeReordering: true` in a column group object.

In the example below, the `Full name` column group can be divided, but not other column groups.

```tsx
import * as React from 'react';
import {
  DataGridPro,
  GridColDef,
  GridColumnGroupingModel,
} from '@mui/x-data-grid-pro';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'isAdmin', type: 'boolean', headerName: 'is admin', width: 100 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
  },
];

const rows = [
  { id: 1, isAdmin: false, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, isAdmin: true, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, isAdmin: false, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, isAdmin: false, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, isAdmin: true, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, isAdmin: true, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, isAdmin: false, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, isAdmin: false, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, isAdmin: false, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'internal_data',
    headerName: 'Internal (not freeReordering)',
    description: '',
    children: [{ field: 'id' }, { field: 'isAdmin' }],
  },
  {
    groupId: 'naming',
    headerName: 'Full name (freeReordering)',
    freeReordering: true,
    children: [{ field: 'lastName' }, { field: 'firstName' }],
  },
];

export default function BreakingGroupDemo() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        columnGroupingModel={columnGroupingModel}
      />
    </div>
  );
}

```

## Collapsible column groups

The demo below uses [`renderHeaderGroup`](/x/react-data-grid/column-groups/#customize-column-group) to add a button to collapse/expand the column group.

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {
  DataGrid,
  GridColDef,
  GridColumnGroupHeaderParams,
  GridColumnGroupingModel,
  gridColumnVisibilityModelSelector,
  useGridApiContext,
} from '@mui/x-data-grid';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const COLLAPSIBLE_COLUMN_GROUPS: Record<string, Array<string>> = {
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

function CollapsibleHeaderGroup({
  groupId,
  headerName,
}: GridColumnGroupHeaderParams) {
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

```

## Manage group visibility 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/6651) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to expand and collapse grouped columns to toggle their visibility.

## Column group ordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/9448) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, users would be able to drag and drop grouped headers to move all grouped children at once (which is [already possible for normal columns](/x/react-data-grid/column-ordering/)).

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
