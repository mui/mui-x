import * as React from 'react';
import {
  DataGridPro,
  GridFilterModel,
  gridFilterModelSelector,
  GridFilterPanel,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface FilterPreset {
  id: string;
  name: string;
  filterModel: GridFilterModel;
  createdAt: string;
}

interface FilterPresetStore {
  presets: FilterPreset[];
  activePresetId: string | null;
}

const STORAGE_KEY = 'dataGridFilterPresets';
const EMPTY_STORE: FilterPresetStore = { presets: [], activePresetId: null };

const createPresetsStore = () => {
  let listeners: Array<() => void> = [];

  return {
    subscribe: (callback: () => void) => {
      listeners.push(callback);
      return () => {
        listeners = listeners.filter((listener) => listener !== callback);
      };
    },
    getSnapshot: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved || JSON.stringify(EMPTY_STORE);
      } catch {
        return JSON.stringify(EMPTY_STORE);
      }
    },
    getServerSnapshot: () => {
      return JSON.stringify(EMPTY_STORE);
    },
    update: (store: FilterPresetStore) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch {
        // Silently fail if localStorage is not available
      }
      listeners.forEach((listener) => listener());
    },
  };
};

const usePersistedPresets = () => {
  const [presetsStore] = React.useState(createPresetsStore);

  const storeString = React.useSyncExternalStore(
    presetsStore.subscribe,
    presetsStore.getSnapshot,
    presetsStore.getServerSnapshot,
  );

  const store = React.useMemo(() => {
    try {
      return JSON.parse(storeString) as FilterPresetStore;
    } catch {
      return EMPTY_STORE;
    }
  }, [storeString]);

  return React.useMemo(
    () => [store, presetsStore.update] as const,
    [store, presetsStore.update],
  );
};

type GridFilterPanelProps = React.ComponentProps<typeof GridFilterPanel>;

function CustomFilterPanel(props: GridFilterPanelProps) {
  const apiRef = useGridApiContext();
  const [store, setStore] = usePersistedPresets();
  const [createFilterDialogOpen, setCreateFilterDialogOpen] = React.useState(false);
  const [createFilterName, setCreateFilterName] = React.useState('');

  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const hasActiveFilters = filterModel.items.length > 0;

  const handleSavePreset = () => {
    setStore({
      ...store,
      presets: store.presets.map((p) =>
        p.id === store.activePresetId
          ? {
              ...p,
              filterModel,
            }
          : p,
      ),
    });
  };

  const handleCreateFilter = () => {
    if (!createFilterName.trim()) {
      return;
    }

    const newPreset: FilterPreset = {
      id: `preset_${Date.now()}`,
      name: createFilterName.trim(),
      filterModel,
      createdAt: new Date().toISOString(),
    };

    setStore({
      ...store,
      presets: [...store.presets, newPreset],
      activePresetId: newPreset.id,
    });

    setCreateFilterDialogOpen(false);
    setCreateFilterName('');
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = store.presets.find((p) => p.id === presetId);
    if (preset) {
      apiRef.current.setFilterModel(preset.filterModel);

      setStore({
        ...store,
        activePresetId: presetId,
      });
    }
  };

  const handleDeletePreset = (presetId: string) => {
    setStore({
      ...store,
      presets: store.presets.filter((p) => p.id !== presetId),
      activePresetId:
        store.activePresetId === presetId ? null : store.activePresetId,
    });
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          minWidth: 256,
          display: 'flex',
          flexDirection: 'column',
          'div:has(&)': { flexWrap: 'wrap' },
        }}
      >
        <Box
          sx={{
            p: 2,
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Saved Filter Presets
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Create new filter">
              <IconButton
                onClick={() => setCreateFilterDialogOpen(true)}
                size="small"
                color="primary"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Update selected filter">
              <span>
                <IconButton
                  onClick={handleSavePreset}
                  disabled={!store.activePresetId}
                  size="small"
                  color="primary"
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Box>

        {store.presets.length === 0 ? (
          <Box sx={{ p: 2, pt: 0, flexGrow: 1, display: 'flex' }}>
            <Box
              sx={(theme) => ({
                flex: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'grey.100',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                color: 'text.secondary',
                ...theme.applyStyles('dark', {
                  bgcolor: 'grey.900',
                }),
              })}
            >
              <Typography variant="body2" align="center">
                No saved filters yet
              </Typography>
            </Box>
          </Box>
        ) : (
          <List dense sx={{ pt: 0 }}>
            {store.presets.map((preset) => (
              <ListItem
                key={preset.id}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeletePreset(preset.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={preset.id === store.activePresetId}
                  onClick={() => handleLoadPreset(preset.id)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: '60%',
                        bgcolor: 'primary.main',
                        borderRadius: '3px 0 0 3px',
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={preset.name}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {preset.filterModel.items.length} filter
                        {preset.filterModel.items.length > 1 ? 's' : ''}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Divider orientation="vertical" sx={{ height: 'auto' }} />

      <GridFilterPanel {...props} />

      <Dialog
        open={createFilterDialogOpen}
        onClose={() => setCreateFilterDialogOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>Create new filter</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="Filter Name"
              value={createFilterName}
              onChange={(event) => setCreateFilterName(event.target.value)}
              fullWidth
              required
            />
            <Alert severity="info">
              {hasActiveFilters
                ? `This will save the current ${filterModel.items.length} active filter${filterModel.items.length !== 1 ? 's' : ''} as a new preset.`
                : 'This will create an empty filter preset that you can configure later.'}
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setCreateFilterDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateFilter}
            variant="contained"
            disabled={!createFilterName.trim()}
            startIcon={<AddIcon />}
          >
            Create Filter
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default function FilterPresetsPanel() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        slots={{
          filterPanel: CustomFilterPanel,
        }}
        showToolbar
      />
    </Box>
  );
}
