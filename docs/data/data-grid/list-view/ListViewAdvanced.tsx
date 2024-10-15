import * as React from 'react';
import {
  GridActionsCellItem,
  GridColDef,
  useGridApiRef,
  GridRowParams,
  DataGridPremium,
  GridRowId,
  gridClasses,
  GridRowModel,
} from '@mui/x-data-grid-premium';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import OpenIcon from '@mui/icons-material/Visibility';
import { randomId } from '@mui/x-data-grid-generator';
import { FileIcon } from './components/FileIcon';
import { ActionDrawer } from './components/ActionDrawer';
import { DetailsDrawer } from './components/DetailsDrawer';
import { ListCell } from './components/ListCell';
import { Toolbar } from './components/Toolbar';
import { INITIAL_ROWS } from './data';
import { FILE_TYPES } from './constants';
import { RowModel, FileType } from './types';
import { formatDate, formatSize, stringAvatar } from './utils';

const listColDef: GridColDef = {
  field: 'listCell',
  renderCell: ListCell,
};

export default function ListViewAdvanced() {
  // This is used only for the example - renders the drawer inside the container
  const containerRef = React.useRef<HTMLDivElement>(null);
  const container = () => containerRef.current as HTMLElement;

  const [isListView, setIsListView] = React.useState(true);

  const apiRef = useGridApiRef();

  const [rows, setRows] = React.useState<GridRowModel<RowModel>[]>(INITIAL_ROWS);

  const [loading, setLoading] = React.useState(false);

  const [detailsState, setDetailsState] = React.useState<{
    open: boolean;
    params: Pick<GridRowParams<RowModel>, 'row'> | null;
  }>({
    open: false,
    params: null,
  });

  const handleDelete = React.useCallback((ids: GridRowId[]) => {
    setRows((prevRows) => prevRows.filter((row) => !ids.includes(row.id)));
  }, []);

  const handleUpdate = React.useCallback(
    (
      id: GridRowId,
      field: GridRowParams<RowModel>['columns'][number]['field'],
      value: string,
    ) => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id
            ? { ...row, [field]: value, updatedAt: new Date().toISOString() }
            : row,
        ),
      );
    },
    [],
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
      setRows((prevRows) => [...prevRows, row]);

      // Simulate server response time
      const timeout = Math.floor(Math.random() * 3000) + 2000;
      setTimeout(() => {
        const uploadedRow: RowModel = { ...row, state: 'uploaded' };
        setRows((prevRows) =>
          prevRows.map((r) => (r.id === row.id ? uploadedRow : r)),
        );
        setDetailsState({ open: true, params: { row } });
        setLoading(false);
      }, timeout);
    },
    [],
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
        getActions: (params) =>
          isListView
            ? [
                <ActionDrawer
                  params={params}
                  container={container}
                  onSaveRename={(value) => handleUpdate(params.id, 'name', value)}
                  onDelete={() => handleDelete([params.id])}
                  onOpen={() => {
                    setDetailsState({ open: true, params });
                  }}
                />,
              ]
            : [
                <GridActionsCellItem
                  label="Preview"
                  icon={<OpenIcon fontSize="small" />}
                  onClick={() => {
                    setDetailsState({ open: true, params });
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
    [isListView, handleDelete, handleUpdate, apiRef],
  );

  const getEstimatedRowHeight = () => {
    const density = apiRef.current.state.density;

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
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isListView}
            onChange={(event) => setIsListView(event.target.checked)}
          />
        }
        label="Enable list view"
      />
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: isListView ? 360 : undefined,
          height: 600,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          margin: '0 auto',
        }}
      >
        <DataGridPremium
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          loading={loading}
          slots={{ toolbar: Toolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              listView: isListView,
              container,
              handleDelete,
              handleUpload,
            },
            loadingOverlay: {
              variant: 'linear-progress',
            },
          }}
          unstable_listView={isListView}
          unstable_listColumn={listColDef}
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
          onRowDoubleClick={(params) => {
            setDetailsState({ open: true, params });
          }}
          hideFooterSelectedRowCount
        />

        <DetailsDrawer
          {...detailsState}
          listView={isListView}
          container={container}
          onDescriptionChange={(id, value) => handleUpdate(id, 'description', value)}
          onClose={() => setDetailsState({ open: false, params: null })}
        />
      </Box>
    </Box>
  );
}
