---
title: Data Grid - List view
---

# Data Grid - List view [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Display data in a single-column list view for a more compact Data Grid on smaller screens and mobile devices.

A typical data grid built for desktop devices can be difficult to use on a mobile device.
The Data Grid Pro provides a single-column list view format to give users a better experience on smaller screens.

## Implementing list view

To enable list view, pass the `listView` prop to the Data Grid.

Unlike the default grid view, list view requires you to explicitly define how columns and cells are displayed by passing the `listViewColumn` prop with [a `renderCell()` function](/x/react-data-grid/cells/#rendercell):

```tsx
function ListViewCell(params: GridRenderCellParams) {
  return <>{params.row.id}</>;
}

const listViewColDef: GridListViewColDef = {
  field: 'listColumn',
  renderCell: ListViewCell,
};

<DataGridPro listViewColumn={listViewColDef} listView={true} />;
```

```tsx
import * as React from 'react';
import {
  DataGridPro,
  GridRenderCellParams,
  GridListViewColDef,
  GridColDef,
  GridRowParams,
  GridToolbarContainer,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MessageIcon from '@mui/icons-material/Message';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import GridViewIcon from '@mui/icons-material/ViewModule';
import ListViewIcon from '@mui/icons-material/ViewList';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    view: 'grid' | 'list';
    onChangeView: (view: 'grid' | 'list') => void;
  }
}

function MessageAction(params: Pick<GridRowParams, 'row'>) {
  const handleMessage = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(`send message to ${params.row.phone}`);
  };
  return (
    <IconButton aria-label="Message" onClick={handleMessage}>
      <MessageIcon />
    </IconButton>
  );
}

function ListViewCell(params: GridRenderCellParams) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        height: '100%',
        gap: 2,
      }}
    >
      <Avatar sx={{ width: 32, height: 32, backgroundColor: params.row.avatar }} />
      <Stack sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {params.row.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {params.row.position}
        </Typography>
      </Stack>
      <MessageAction {...params} />
    </Stack>
  );
}

const listViewColDef: GridListViewColDef = {
  field: 'listColumn',
  renderCell: ListViewCell,
};

const VISIBLE_FIELDS = ['avatar', 'name', 'position'];

type ToolbarProps = {
  view: 'grid' | 'list';
  onChangeView: (view: 'grid' | 'list') => void;
};

function Toolbar({ view, onChangeView }: ToolbarProps) {
  return (
    <GridToolbarContainer
      sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1 }}
    >
      <ToggleButtonGroup
        size="small"
        sx={{ ml: 'auto' }}
        value={view}
        exclusive
        onChange={(_, newView) => {
          if (newView) {
            onChangeView(newView);
          }
        }}
      >
        <ToggleButton
          size="small"
          color="primary"
          sx={{ gap: 0.5 }}
          value="grid"
          selected={view === 'grid'}
        >
          <GridViewIcon fontSize="small" /> Grid
        </ToggleButton>
        <ToggleButton
          size="small"
          color="primary"
          sx={{ gap: 0.5 }}
          value="list"
          selected={view === 'list'}
        >
          <ListViewIcon fontSize="small" /> List
        </ToggleButton>
      </ToggleButtonGroup>
    </GridToolbarContainer>
  );
}

export default function ListView() {
  const [view, setView] = React.useState<'grid' | 'list'>('list');
  const isListView = view === 'list';

  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 20,
    visibleFields: VISIBLE_FIELDS,
  });

  const columns: GridColDef[] = React.useMemo(() => {
    return [
      ...data.columns,
      {
        type: 'actions',
        field: 'actions',
        width: 75,
        getActions: (params) => [<MessageAction {...params} />],
      },
    ];
  }, [data.columns]);

  const rowHeight = isListView ? 64 : 52;

  return (
    <div style={{ width: '100%', maxWidth: 360, height: 600 }}>
      <DataGridPro
        {...data}
        loading={loading}
        columns={columns}
        rowHeight={rowHeight}
        listView={isListView}
        listViewColumn={listViewColDef}
        slots={{
          toolbar: Toolbar,
        }}
        showToolbar
        slotProps={{
          toolbar: {
            view,
            onChangeView: setView,
          },
        }}
        sx={{ backgroundColor: 'background.paper' }}
      />
    </div>
  );
}

```

## Responsive list view with media query

Use the `useMediaQuery` hook from `@mui/material` to enable the list view feature at a specified breakpoint.
The demo below automatically switches to a list layout when the viewport width is below the `md` breakpoint.

```tsx
import * as React from 'react';
import {
  DataGridPro,
  GridRenderCellParams,
  GridListViewColDef,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function ListViewCell(params: GridRenderCellParams) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        height: '100%',
        gap: 2,
      }}
    >
      <Avatar sx={{ width: 32, height: 32, backgroundColor: params.row.avatar }} />
      <Stack sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {params.row.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {params.row.position}
        </Typography>
      </Stack>
    </Stack>
  );
}

const listViewColDef: GridListViewColDef = {
  field: 'listColumn',
  renderCell: ListViewCell,
};

const VISIBLE_FIELDS = ['avatar', 'name', 'position'];

export default function ListViewMediaQuery() {
  const theme = useTheme();
  const isListView = useMediaQuery(theme.breakpoints.down('md'));

  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 5,
    visibleFields: VISIBLE_FIELDS,
  });

  const rowHeight = isListView ? 64 : 52;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 400,
      }}
    >
      <DataGridPro
        {...data}
        loading={loading}
        rowHeight={rowHeight}
        listView={isListView}
        listViewColumn={listViewColDef}
      />
    </div>
  );
}

```

## List view with editable rows

The [editing feature](/x/react-data-grid/editing/) is not supported while in list view, but it's possible to build an editing experience from within a custom cell renderer, as shown below:

```tsx
import * as React from 'react';
import {
  DataGridPro,
  GridRenderCellParams,
  GridListViewColDef,
  GridColDef,
  GridRowParams,
  GridRowsProp,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  randomId,
  randomTraderName,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

const roles = ['Marketing', 'Finance', 'Development'];

const randomRole = () => {
  return randomArrayItem(roles);
};

const rows: GridRowsProp = [
  {
    id: randomId(),
    name: randomTraderName(),
    position: randomRole(),
    avatar: '#4caf50',
  },
  {
    id: randomId(),
    name: randomTraderName(),
    position: randomRole(),
    avatar: '#2196f3',
  },
  {
    id: randomId(),
    name: randomTraderName(),
    position: randomRole(),
    avatar: '#ff9800',
  },
  {
    id: randomId(),
    name: randomTraderName(),
    position: randomRole(),
    avatar: '#9c27b0',
  },
  {
    id: randomId(),
    name: randomTraderName(),
    position: randomRole(),
    avatar: '#f44336',
  },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 180 },
  {
    field: 'position',
    headerName: 'Department',
    width: 220,
    type: 'singleSelect',
    valueOptions: roles,
  },
];

function EditAction(props: Pick<GridRowParams, 'row'>) {
  const { row } = props;
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(row.name);
  const [position, setPosition] = React.useState(row.position);
  const apiRef = useGridApiContext();

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEditing(true);
  };

  const handleClose = () => {
    setEditing(false);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    apiRef.current.updateRows([{ id: row.id, name, position }]);
    handleClose();
  };

  React.useEffect(() => {
    setName(row.name);
    setPosition(row.position);
  }, [row]);

  return (
    <React.Fragment>
      <IconButton aria-label="Edit" onClick={handleEdit}>
        <EditIcon />
      </IconButton>

      <Dialog
        open={editing}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSave,
        }}
      >
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <DialogContentText>
            Make changes to the employee&apos;s information.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <FormControl fullWidth required>
            <InputLabel id="position-label">Position</InputLabel>
            <Select
              labelId="position-label"
              id="position"
              name="position"
              label="Position"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save changes</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function DeleteAction(props: Pick<GridRowParams, 'row'>) {
  const { row } = props;
  const apiRef = useGridApiContext();

  return (
    <IconButton
      aria-label="Delete"
      onClick={() => apiRef.current.updateRows([{ id: row.id, _action: 'delete' }])}
    >
      <DeleteIcon />
    </IconButton>
  );
}

function ListViewCell(props: GridRenderCellParams) {
  const { row } = props;

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        height: '100%',
        gap: 2,
      }}
    >
      <Avatar sx={{ width: 32, height: 32, backgroundColor: row.avatar }} />
      <Stack sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {row.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {row.position}
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ gap: 0.5 }}>
        <EditAction {...props} />
        <DeleteAction {...props} />
      </Stack>
    </Stack>
  );
}

const listViewColDef: GridListViewColDef = {
  field: 'listColumn',
  renderCell: (params) => <ListViewCell {...params} />,
};

export default function ListViewEdit() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 360,
        height: 400,
      }}
    >
      <DataGridPro
        rows={rows}
        columns={columns}
        rowHeight={64}
        listView
        listViewColumn={listViewColDef}
        sx={{ backgroundColor: 'background.paper' }}
      />
    </div>
  );
}

```

## Optimizing list view for small screens

If your use case calls for first-class mobile UX, you can fully customize the Data Grid's list layout using [custom subcomponents](/x/react-data-grid/components/) as shown in the demo below:

```tsx
import * as React from 'react';
import {
  GridActionsCellItem,
  GridColDef,
  useGridApiRef,
  GridRowParams,
  DataGridPremium,
  GridRowId,
  gridClasses,
} from '@mui/x-data-grid-premium';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import OpenIcon from '@mui/icons-material/Visibility';
import useMediaQuery from '@mui/material/useMediaQuery';
import CSSBaseline from '@mui/material/CssBaseline';
import { randomId } from '@mui/x-data-grid-generator';
import { useTheme } from '@mui/material/styles';
import { FileIcon } from './components/FileIcon';
import { DetailsDrawer } from './components/DetailsDrawer';
import { ListCell } from './components/ListCell';
import { Toolbar } from './components/Toolbar';
import { INITIAL_ROWS } from './data';
import { FILE_TYPES } from './constants';
import { RowModel, FileType } from './types';
import { formatDate, formatSize, stringAvatar } from './utils';
import { ActionDrawer } from './components/ActionDrawer';
import { RenameDialog } from './components/RenameDialog';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    listView: boolean;
    container: HTMLElement;
    handleDelete: (ids: GridRowId[]) => void;
    handleUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
}

interface Props {
  // Injected by the documentation to work in an iframe.
  window?: () => Window;
}

export default function ListViewAdvanced({ window }: Props) {
  // This is used only for the example - renders the drawer inside the container
  const container = window !== undefined ? window().document.body : undefined;

  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down('md'));

  const isDocsDemo = window !== undefined;
  const isListView = isDocsDemo ? true : isBelowMd;

  const apiRef = useGridApiRef();

  const [loading, setLoading] = React.useState(false);

  const [overlayState, setOverlayState] = React.useState<{
    overlay: 'actions' | 'details' | 'rename' | null;
    params: Pick<GridRowParams<RowModel>, 'row'> | null;
  }>({
    overlay: null,
    params: null,
  });

  const handleCloseOverlay = () => {
    setOverlayState({ overlay: null, params: null });
  };

  const handleDelete = React.useCallback(
    (ids: GridRowId[]) => {
      apiRef.current?.updateRows(ids.map((id) => ({ id, _action: 'delete' })));
    },
    [apiRef],
  );

  const handleUpdate = React.useCallback(
    (
      id: GridRowId,
      field: GridRowParams<RowModel>['columns'][number]['field'],
      value: string,
    ) => {
      const updatedAt = new Date().toISOString();
      apiRef.current?.updateRows([{ id, [field]: value, updatedAt }]);
    },
    [apiRef],
  );

  const handleUpload = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        return;
      }

      const file = event.target.files[0];
      const createdAt = new Date().toISOString();

      const fileType = file.type.split('/')[1];

      // validate file type
      if (!FILE_TYPES.includes(fileType as FileType)) {
        alert('Invalid file type');
        return;
      }

      const row: RowModel = {
        id: randomId(),
        name: file.name,
        description: '',
        type: fileType as FileType,
        size: file.size,
        createdBy: 'Kenan Yusuf',
        createdAt,
        updatedAt: createdAt,
        state: 'pending',
      };

      event.target.value = '';

      // Add temporary row
      setLoading(true);
      apiRef.current?.updateRows([row]);

      // Simulate server response time
      const timeout = Math.floor(Math.random() * 3000) + 2000;
      setTimeout(() => {
        const uploadedRow: RowModel = { ...row, state: 'uploaded' };
        apiRef.current?.updateRows([uploadedRow]);
        setOverlayState({ overlay: 'actions', params: { row } });
        setLoading(false);
      }, timeout);
    },
    [apiRef],
  );

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        width: 350,
        editable: true,
        hideable: false,
        renderCell: (params) => {
          return (
            <Stack
              direction="row"
              gap={1.5}
              alignItems="center"
              sx={{ height: '100%' }}
            >
              <FileIcon type={params.row.type} />
              {params.value}
            </Stack>
          );
        },
      },
      {
        field: 'createdBy',
        headerName: 'Owner',
        width: 200,
        renderCell: (params) => {
          const avatarProps = stringAvatar(params.value);
          return (
            <Stack direction="row" gap={1.5} alignItems="center">
              <Avatar
                {...avatarProps}
                sx={{ width: 24, height: 24, fontSize: 12, ...avatarProps.sx }}
              />
              {params.value}
            </Stack>
          );
        },
      },
      {
        field: 'createdAt',
        headerName: 'Added',
        type: 'date',
        width: 200,
        valueFormatter: formatDate,
      },
      {
        field: 'updatedAt',
        headerName: 'Modified',
        type: 'date',
        width: 200,
        valueFormatter: formatDate,
      },
      {
        field: 'type',
        headerName: 'Type',
        width: 150,
      },
      {
        field: 'size',
        headerName: 'Size',
        width: 120,
        valueFormatter: formatSize,
      },
      {
        type: 'actions',
        field: 'actions',
        resizable: false,
        width: 50,
        getActions: (params) => [
          <GridActionsCellItem
            label="Preview"
            icon={<OpenIcon fontSize="small" />}
            onClick={() => {
              setOverlayState({ overlay: 'actions', params });
            }}
            showInMenu
          />,
          <GridActionsCellItem
            label="Rename"
            icon={<EditIcon fontSize="small" />}
            onClick={() =>
              apiRef.current?.startCellEditMode({
                id: params.id,
                field: 'name',
              })
            }
            showInMenu
          />,
          <GridActionsCellItem
            label="Delete"
            icon={<DeleteIcon fontSize="small" />}
            onClick={() => handleDelete([params.id])}
            showInMenu
          />,
        ],
      },
    ],
    [handleDelete, apiRef],
  );

  const listViewColDef: GridColDef = React.useMemo(
    () => ({
      field: 'listCell',
      renderCell: (params) => (
        <ListCell
          {...params}
          onOpenActions={() => {
            setOverlayState({ overlay: 'actions', params });
          }}
        />
      ),
    }),
    [],
  );

  const getEstimatedRowHeight = () => {
    const density = apiRef.current?.state?.density;

    if (isListView) {
      switch (density) {
        case 'compact':
          return 47;
        case 'standard':
          return 67;
        case 'comfortable':
          return 97;
        default:
          return 67;
      }
    } else {
      switch (density) {
        case 'compact':
          return 47;
        case 'standard':
          return 55;
        case 'comfortable':
          return 63;
        default:
          return 55;
      }
    }
  };

  const getRowHeight = React.useCallback(
    () => (isListView ? 'auto' : undefined),
    [isListView],
  );

  return (
    <React.Fragment>
      <CSSBaseline />
      <div
        style={{
          maxWidth: '100%',
          height: 600,
        }}
      >
        <DataGridPremium
          apiRef={apiRef}
          rows={INITIAL_ROWS}
          columns={columns}
          loading={loading}
          slots={{ toolbar: Toolbar }}
          showToolbar
          slotProps={{
            toolbar: {
              listView: isListView,
              container,
              handleDelete,
              handleUpload,
            },
            loadingOverlay: {
              variant: 'linear-progress',
            },
          }}
          listView={isListView}
          listViewColumn={listViewColDef}
          pagination
          pageSizeOptions={[10]}
          initialState={{
            density: 'comfortable',
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
            sorting: {
              sortModel: [{ field: 'createdAt', sort: 'desc' }],
            },
            columns: {
              columnVisibilityModel: {
                type: false,
              },
            },
          }}
          sx={{
            border: 0,
            borderRadius: 0,
            [`& .${gridClasses.cell}`]: { display: 'flex', alignItems: 'center' },
            [`&.${gridClasses['root--densityCompact']} .${gridClasses.cell}`]: {
              py: 1,
            },
            [`&.${gridClasses['root--densityStandard']} .${gridClasses.cell}`]: {
              py: 1.5,
            },
            [`&.${gridClasses['root--densityComfortable']} .${gridClasses.cell}`]: {
              py: 2,
            },
          }}
          getRowHeight={getRowHeight}
          getEstimatedRowHeight={getEstimatedRowHeight}
          onRowDoubleClick={(params) =>
            setOverlayState({ overlay: 'actions', params })
          }
          hideFooterSelectedRowCount
        />

        <DetailsDrawer
          open={overlayState.overlay === 'details'}
          params={overlayState.params}
          listView={isListView}
          container={container}
          onDescriptionChange={(id, value) => handleUpdate(id, 'description', value)}
          onClose={handleCloseOverlay}
        />

        <ActionDrawer
          open={overlayState.overlay === 'actions'}
          params={overlayState.params}
          container={container}
          onPreview={() =>
            setOverlayState({ overlay: 'details', params: overlayState.params })
          }
          onRename={() =>
            setOverlayState({ overlay: 'rename', params: overlayState.params })
          }
          onDelete={(id) => {
            handleDelete([id]);
            handleCloseOverlay();
          }}
          onClose={handleCloseOverlay}
        />

        <RenameDialog
          open={overlayState.overlay === 'rename'}
          params={overlayState.params}
          container={container}
          onSave={(id, value) => handleUpdate(id, 'name', value)}
          onClose={handleCloseOverlay}
        />
      </div>
    </React.Fragment>
  );
}

```

## List view feature compatibility

List view can be used in combination with the following features:

- ✅ [Sorting](/x/react-data-grid/sorting/)
- ✅ [Filtering](/x/react-data-grid/filtering/)
- ✅ [Pagination](/x/react-data-grid/pagination/)
- ✅ [Row selection](/x/react-data-grid/row-selection/)
- ✅ [Multi-filters](/x/react-data-grid/filtering/multi-filters/) [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')
- ✅ [Row pinning](/x/react-data-grid/row-pinning/) [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')
- ✅ [Cell selection](/x/react-data-grid/cell-selection/) [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

:::warning
Features not listed here may not work as expected (or at all).
If you're using a feature that's listed above and it's not working as expected, please [open a bug report](https://github.com/mui/mui-x/issues/new?assignees=&labels=status%3A+waiting+for+maintainer%2Cbug+%F0%9F%90%9B&projects=&template=1.bug.yml).
If you need to use list view with any other features not listed, please [open a feature request](https://github.com/mui/mui-x/issues/new?assignees=&labels=status%3A+waiting+for+maintainer%2Cnew+feature&projects=&template=2.feature.yml).
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridListViewColDef](/x/api/data-grid/grid-list-view-col-def/)
