---
productId: x-data-grid
components: Toolbar, ToolbarButton
packageName: '@mui/x-data-grid'
githubLabel: 'scope: data grid'
---

# Data Grid - Toolbar component

Add custom actions and controls to the Data Grid.

The default toolbar can be enabled by passing the `showToolbar` prop to the `<DataGrid />` component.

You can use the Toolbar and various other [Data Grid components](/x/react-data-grid/components/usage/) when you need to customize the toolbar.

## Basic usage

The demo below shows how to compose the Toolbar and various other components to look and behave like the built-in toolbar.

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  ExportCsv,
  ExportPrint,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';

type OwnerState = {
  expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
  display: 'grid',
  alignItems: 'center',
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
  }),
);

const StyledTextField = styled(TextField)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  overflowX: 'clip',
  width: ownerState.expanded ? 260 : 'var(--trigger-width)',
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(['width', 'opacity']),
}));

function CustomToolbar() {
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
  const exportMenuTriggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Toolbar>
      <Typography fontWeight="medium" sx={{ flex: 1, mx: 0.5 }}>
        Toolbar
      </Typography>

      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>

      <Tooltip title="Filters">
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>

      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="Export">
        <ToolbarButton
          ref={exportMenuTriggerRef}
          id="export-menu-trigger"
          aria-controls="export-menu"
          aria-haspopup="true"
          aria-expanded={exportMenuOpen ? 'true' : undefined}
          onClick={() => setExportMenuOpen(true)}
        >
          <FileDownloadIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>

      <Menu
        id="export-menu"
        anchorEl={exportMenuTriggerRef.current}
        open={exportMenuOpen}
        onClose={() => setExportMenuOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          list: {
            'aria-labelledby': 'export-menu-trigger',
          },
        }}
      >
        <ExportPrint render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
          Print
        </ExportPrint>
        <ExportCsv render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
          Download as CSV
        </ExportCsv>
        {/* Available to MUI X Premium users */}
        {/* <ExportExcel render={<MenuItem />}>
          Download as Excel
        </ExportExcel> */}
      </Menu>

      <StyledQuickFilter>
        <QuickFilterTrigger
          render={(triggerProps, state) => (
            <Tooltip title="Search" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded: state.expanded }}
                color="default"
                aria-disabled={state.expanded}
              >
                <SearchIcon fontSize="small" />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded: state.expanded }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}

export default function GridToolbar() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}

```

## Anatomy

```tsx
import { Toolbar, ToolbarButton } from '@mui/x-data-grid';

<Toolbar>
  <ToolbarButton />
</Toolbar>;
```

### Toolbar

The Toolbar is the top level component that provides context to child components.
It renders a styled `<div />` element.

### Toolbar Button

`<ToolbarButton />` is a button for performing actions from the toolbar.
It renders the `baseIconButton` slot.

## Recipes

Below are some ways the Toolbar component can be used.

### Settings menu

The demo below shows how to display an appearance settings menu on the toolbar. It uses local storage to persist the user's selections.

```tsx
import * as React from 'react';
import { DataGrid, GridDensity, Toolbar, ToolbarButton } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    settings: Settings;
    onSettingsChange: React.Dispatch<React.SetStateAction<Settings>>;
  }
}

interface Settings {
  density?: GridDensity;
  showCellBorders?: boolean;
  showColumnBorders?: boolean;
}

type ToolbarProps = {
  settings: Settings;
  onSettingsChange: React.Dispatch<React.SetStateAction<Settings>>;
};

const DENISTY_OPTIONS: { label: string; value: GridDensity }[] = [
  { label: 'Compact density', value: 'compact' },
  { label: 'Standard density', value: 'standard' },
  { label: 'Comfortable density', value: 'comfortable' },
];

const SETTINGS_STORAGE_KEY = 'mui-data-grid-settings';

const SETTINGS_DEFAULT: Settings = {
  density: 'standard',
  showCellBorders: false,
  showColumnBorders: false,
};

const getInitialSettings = (): Settings => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return storedSettings ? JSON.parse(storedSettings) : SETTINGS_DEFAULT;
  } catch (error) {
    return SETTINGS_DEFAULT;
  }
};

function CustomToolbar(props: ToolbarProps) {
  const { settings, onSettingsChange } = props;
  const [settingsMenuOpen, setSettingsMenuOpen] = React.useState(false);
  const settingsMenuTriggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Toolbar>
      <Tooltip title="Settings">
        <ToolbarButton
          ref={settingsMenuTriggerRef}
          id="settings-menu-trigger"
          aria-controls="settings-menu"
          aria-haspopup="true"
          aria-expanded={settingsMenuOpen ? 'true' : undefined}
          onClick={() => setSettingsMenuOpen(true)}
        >
          <SettingsIcon fontSize="small" sx={{ ml: 'auto' }} />
        </ToolbarButton>
      </Tooltip>

      <Menu
        id="settings-menu"
        anchorEl={settingsMenuTriggerRef.current}
        open={settingsMenuOpen}
        onClose={() => setSettingsMenuOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          list: {
            'aria-labelledby': 'settings-menu-trigger',
          },
        }}
      >
        {DENISTY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() =>
              onSettingsChange((currentSettings) => ({
                ...currentSettings,
                density: option.value,
              }))
            }
          >
            <ListItemIcon>
              {settings.density === option.value && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() =>
            onSettingsChange((currentSettings) => ({
              ...currentSettings,
              showColumnBorders: !currentSettings.showColumnBorders,
            }))
          }
        >
          <ListItemIcon>
            {settings.showColumnBorders && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>Show column borders</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            onSettingsChange((currentSettings) => ({
              ...currentSettings,
              showCellBorders: !currentSettings.showCellBorders,
            }))
          }
        >
          <ListItemIcon>
            {settings.showCellBorders && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>Show cell borders</ListItemText>
        </MenuItem>
      </Menu>
    </Toolbar>
  );
}

export default function GridToolbarSettingsMenu() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  const [settings, setSettings] = React.useState<Settings>(getInitialSettings());

  React.useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        density={settings.density}
        showCellVerticalBorder={settings.showCellBorders}
        showColumnVerticalBorder={settings.showColumnBorders}
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: {
            settings,
            onSettingsChange: setSettings,
          },
        }}
        showToolbar
      />
    </div>
  );
}

```

### Custom trigger and panel

The demo below shows how to add a custom trigger and panel to the toolbar.

```tsx
import * as React from 'react';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  useGridApiContext,
} from '@mui/x-data-grid';
import { randomId, useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const [newPanelOpen, setNewPanelOpen] = React.useState(false);
  const newPanelTriggerRef = React.useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setNewPanelOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    apiRef.current.updateRows([
      {
        id: randomId(),
        commodity: formData.get('commodity'),
        quantity: Number(formData.get('quantity')),
        unitPrice: Number(formData.get('unitPrice')),
      },
    ]);
    handleClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <Toolbar>
      <Tooltip title="Add new commodity">
        <ToolbarButton
          ref={newPanelTriggerRef}
          aria-describedby="new-panel"
          onClick={() => setNewPanelOpen((prev) => !prev)}
        >
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>

      <Popper
        open={newPanelOpen}
        anchorEl={newPanelTriggerRef.current}
        placement="bottom-end"
        id="new-panel"
        onKeyDown={handleKeyDown}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 300,
              p: 2,
            }}
            elevation={8}
          >
            <Typography fontWeight="bold">Add new commodity</Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Commodity"
                  name="commodity"
                  size="small"
                  autoFocus
                  fullWidth
                  required
                />
                <TextField
                  label="Quantity"
                  type="number"
                  name="quantity"
                  size="small"
                  fullWidth
                  required
                />
                <TextField
                  label="Price"
                  type="number"
                  name="unitPrice"
                  size="small"
                  fullWidth
                  required
                />
                <Button type="submit" variant="contained" fullWidth>
                  Add Commodity
                </Button>
              </Stack>
            </form>
          </Paper>
        </ClickAwayListener>
      </Popper>

      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>

      <Tooltip title="Filters">
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>
    </Toolbar>
  );
}

export default function GridToolbarCustomPanel() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 2,
    maxColumns: 10,
    visibleFields: ['commodity', 'quantity', 'unitPrice'],
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}

```

### Filter bar

The demo below shows how to display active filter chips on the toolbar.

```tsx
import * as React from 'react';
import {
  DataGridPro,
  gridColumnLookupSelector,
  gridFilterActiveItemsSelector,
  GridFilterItem,
  GridFilterModel,
  useGridApiContext,
  useGridSelector,
  GridFilterListIcon,
  GridToolbarProps,
  Toolbar,
  ToolbarButton,
  FilterPanelTrigger,
} from '@mui/x-data-grid-pro';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import capitalize from '@mui/utils/capitalize';
import { useDemoData } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    onRemoveFilter: (filterId: GridFilterItem['id']) => void;
  }
}

type ToolbarProps = GridToolbarProps & {
  onRemoveFilter: (filterId: GridFilterItem['id']) => void;
};

function CustomToolbar({ onRemoveFilter }: ToolbarProps) {
  const apiRef = useGridApiContext();
  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);

  return (
    <Toolbar>
      <Tooltip title="Filters">
        <FilterPanelTrigger render={<ToolbarButton />}>
          <GridFilterListIcon fontSize="small" />
        </FilterPanelTrigger>
      </Tooltip>
      <Stack direction="row" sx={{ gap: 0.5, flex: 1 }}>
        {activeFilters.map((filter) => {
          const column = columns[filter.field];
          const field = column?.headerName ?? filter.field;
          const operator = apiRef.current.getLocaleText(
            `filterOperator${capitalize(filter.operator)}` as 'filterOperatorContains',
          );
          const isDate = column?.type === 'date';
          const value = isDate
            ? new Date(filter.value).toLocaleDateString()
            : (filter.value ?? '');

          return (
            <Chip
              key={filter.id}
              label={`${field} ${operator} ${value}`}
              onDelete={() => onRemoveFilter(filter.id)}
              sx={{ mx: 0.25 }}
            />
          );
        })}
      </Stack>
    </Toolbar>
  );
}

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'position'];

export default function GridToolbarFilterBar() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [
      {
        id: 'rating',
        field: 'rating',
        operator: '>',
        value: '2.5',
      },
      {
        id: 'dateCreated',
        field: 'dateCreated',
        operator: 'before',
        value: '2024-01-01',
      },
    ],
  });

  const onRemoveFilter = (filterId: GridFilterItem['id']) => {
    setFilterModel({
      items: filterModel.items.filter((item) => item.id !== filterId),
    });
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: { onRemoveFilter },
          basePopper: {
            placement: 'bottom-start',
          },
        }}
        showToolbar
      />
    </div>
  );
}

```

### Row grouping toolbar

The demo below shows how to add a custom toolbar that enables creating and reordering groups with drag and drop.

Users can create groups by dragging column headers into the toolbar, reorder them by dragging the chips within the toolbar, and remove them by clicking the delete button.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  ToolbarButton,
  useGridSelector,
  useGridApiContext,
  gridColumnLookupSelector,
  gridColumnReorderDragColSelector,
  gridRowGroupingSanitizedModelSelector,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import { styled } from '@mui/material/styles';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'flex-start',
  overflow: 'auto',
  padding: theme.spacing(1, 1.5),
  gap: theme.spacing(0.75),
}));

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const rowGroupingModel = useGridSelector(
    apiRef,
    gridRowGroupingSanitizedModelSelector,
  );
  const columnsLookup = useGridSelector(apiRef, gridColumnLookupSelector);
  const draggedColumn = useGridSelector(apiRef, gridColumnReorderDragColSelector);
  const [draggedChip, setDraggedChip] = React.useState<string | null>(null);

  const handleToolbarDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (
      draggedColumn &&
      !rowGroupingModel.includes(draggedColumn) &&
      columnsLookup[draggedColumn].groupable
    ) {
      apiRef.current.addRowGroupingCriteria(draggedColumn);
    }
  };

  const handleToolbarDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (
      draggedColumn &&
      !event.currentTarget.contains(event.relatedTarget as Node)
    ) {
      apiRef.current.removeRowGroupingCriteria(draggedColumn);
    }
  };

  const handleChipDragStart =
    (field: string) => (event: React.DragEvent<HTMLDivElement>) => {
      setDraggedChip(field);
      event.dataTransfer.effectAllowed = 'move';
    };

  const handleChipDragEnd = () => {
    setDraggedChip(null);
  };

  const handleChipDragOver =
    (targetField: string) => (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const draggedField = draggedChip || draggedColumn;
      if (!draggedField || draggedField === targetField) {
        return;
      }

      const currentIndex = rowGroupingModel.indexOf(draggedField);
      const targetIndex = rowGroupingModel.indexOf(targetField);

      if (currentIndex === -1 || targetIndex === -1) {
        return;
      }

      if (currentIndex !== targetIndex) {
        const newModel = [...rowGroupingModel];
        newModel.splice(currentIndex, 1);
        newModel.splice(targetIndex, 0, draggedField);
        apiRef.current.setRowGroupingModel(newModel);
      }
    };

  const moveRowGroup = (field: string, position: number) => {
    if (position < 0 || position > rowGroupingModel.length) {
      return;
    }

    const currentIndex = rowGroupingModel.indexOf(field);
    const newModel = [...rowGroupingModel];
    newModel.splice(currentIndex, 1);
    newModel.splice(position, 0, field);
    apiRef.current.setRowGroupingModel(newModel);
  };

  const removeRowGroup = (field: string) => {
    if (columnsLookup[field].groupable) {
      apiRef.current.removeRowGroupingCriteria(field);
    }
  };

  return (
    <StyledToolbar
      aria-label="Row grouping"
      onDragOver={handleToolbarDragOver}
      onDragLeave={handleToolbarDragLeave}
    >
      <MoveUpIcon fontSize="small" color="action" sx={{ mr: 0.75 }} />
      {rowGroupingModel.length > 0 ? (
        <React.Fragment>
          {rowGroupingModel.map((field, index) => {
            const isDraggedField = draggedChip === field || draggedColumn === field;
            const isGroupable = columnsLookup[field].groupable;
            const label = columnsLookup[field].headerName ?? field;

            return (
              <React.Fragment key={field}>
                {index > 0 && <ChevronRightIcon fontSize="small" color="action" />}
                <ToolbarButton
                  id={field}
                  render={({
                    children,
                    color,
                    size,
                    ref,
                    onKeyDown,
                    ...chipProps
                  }) => {
                    const handleKeyDown = (
                      event: React.KeyboardEvent<HTMLDivElement>,
                    ) => {
                      if (event.key === 'ArrowRight' && event.shiftKey) {
                        moveRowGroup(field, index + 1);
                      } else if (event.key === 'ArrowLeft' && event.shiftKey) {
                        moveRowGroup(field, index - 1);
                      } else {
                        onKeyDown?.(event);
                      }
                    };

                    return (
                      <Chip
                        {...chipProps}
                        ref={ref as React.Ref<HTMLDivElement>}
                        label={label}
                        sx={{ cursor: 'grab', opacity: isDraggedField ? 0.5 : 1 }}
                        onDelete={() => removeRowGroup(field)}
                        deleteIcon={!isGroupable ? <span /> : undefined}
                        onKeyDown={handleKeyDown}
                        onDragStart={handleChipDragStart(field)}
                        onDragEnd={handleChipDragEnd}
                        onDragOver={handleChipDragOver(field)}
                        draggable
                      />
                    );
                  }}
                />
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ flex: 1 }} noWrap>
          Drag columns here to create row groups
        </Typography>
      )}
    </StyledToolbar>
  );
}

export default function GridToolbarRowGrouping() {
  const apiRef = useGridApiRef();

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 10,
  });

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['status', 'commodity'],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        loading={loading}
        initialState={initialState}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}

```

## Custom elements

Use the `render` prop to replace default elements. See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details.

The demo below shows how to replace the default elements with custom ones, styled with Tailwind CSS.

```tsx
import * as React from 'react';
import clsx from 'clsx';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  ExportCsv,
  ExportPrint,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { TailwindDemoContainer } from '@mui/x-data-grid/internals';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Button(props: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={clsx(
        'flex h-9 items-center justify-center rounded border border-neutral-200 cursor-pointer dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-2.5 text-sm font-bold text-neutral-700 dark:text-neutral-200 whitespace-nowrap select-none hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 active:bg-neutral-100 dark:active:bg-neutral-700',
        props.className,
      )}
    />
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        'h-9 w-full rounded border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 px-2.5 text-base text-neutral-900 dark:text-neutral-200 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600',
        props.className,
      )}
    />
  );
}

function CustomToolbar() {
  return (
    <Toolbar className="gap-2! p-2!">
      <ColumnsPanelTrigger
        render={<ToolbarButton render={<Button>Columns</Button>} />}
      />
      <FilterPanelTrigger
        render={<ToolbarButton render={<Button>Filter</Button>} />}
      />
      <ExportCsv render={<ToolbarButton render={<Button>Export</Button>} />} />
      <ExportPrint render={<ToolbarButton render={<Button>Print</Button>} />} />

      <QuickFilter
        render={(props, state) => (
          <div {...props} className="ml-auto flex overflow-clip">
            <QuickFilterTrigger
              className={state.expanded ? 'rounded-r-none border-r-0' : ''}
              render={
                <ToolbarButton
                  render={
                    <Button aria-label="Search">
                      <SearchIcon fontSize="small" />
                    </Button>
                  }
                />
              }
            />
            <div
              className={clsx(
                'flex overflow-clip transition-all duration-300 ease-in-out',
                state.expanded ? 'w-48' : 'w-0',
              )}
            >
              <QuickFilterControl
                aria-label="Search"
                placeholder="Search"
                render={({ slotProps, size, ...controlProps }) => (
                  <TextInput
                    {...controlProps}
                    {...slotProps?.htmlInput}
                    className={clsx(
                      'flex-1 rounded-l-none',
                      state.expanded && state.value !== '' && 'rounded-r-none',
                    )}
                  />
                )}
              />
              {state.expanded && state.value !== '' && (
                <QuickFilterClear
                  render={
                    <Button aria-label="Clear" className="rounded-l-none">
                      <CancelIcon fontSize="small" />
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        )}
      />
    </Toolbar>
  );
}
const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
  },
});

export default function GridToolbarCustom({ window }: { window: () => Window }) {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  // This is used only for the example, you can remove it.
  const documentBody = window !== undefined ? window().document.body : undefined;
  return (
    <div style={{ height: 400, width: '100%' }}>
      <ThemeProvider theme={theme}>
        <TailwindDemoContainer documentBody={documentBody}>
          <DataGrid
            {...data}
            loading={loading}
            slots={{ toolbar: CustomToolbar }}
            showToolbar
          />
        </TailwindDemoContainer>
      </ThemeProvider>
    </div>
  );
}

```

## Accessibility

(WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

The component follows the WAI-ARIA authoring practices.

### ARIA

- The element rendered by the `<Toolbar />` component has the `toolbar` role.
- The element rendered by the `<Toolbar />` component has `aria-orientation` set to `horizontal`.
- You must apply a text label or an `aria-label` attribute to the `<ToolbarButton />`.

### Keyboard

The Toolbar component supports keyboard navigation.
It implements the roving tabindex pattern.

|                                                               Keys | Description                              |
| -----------------------------------------------------------------: | :--------------------------------------- |
|                                         <kbd class="key">Tab</kbd> | Moves focus into and out of the toolbar. |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Tab</kbd></kbd> | Moves focus into and out of the toolbar. |
|                                        <kbd class="key">Left</kbd> | Moves focus to the previous button.      |
|                                       <kbd class="key">Right</kbd> | Moves focus to the next button.          |
|                                        <kbd class="key">Home</kbd> | Moves focus to the first button.         |
|                                         <kbd class="key">End</kbd> | Moves focus to the last button.          |

## Legacy toolbar

:::warning
Deprecated API.
:::

The components above replaced the [legacy toolbar](/x/react-data-grid/components/#legacy-toolbar), for example`<GridToolbarContainer>`.


# Toolbar API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Data Grid - Toolbar component](/x/react-data-grid/components/toolbar)

## Import

```jsx
import { Toolbar } from '@mui/x-data-grid/components';
// or
import { Toolbar } from '@mui/x-data-grid';
// or
import { Toolbar } from '@mui/x-data-grid-pro';
// or
import { Toolbar } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/toolbarV8/Toolbar.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/toolbarV8/Toolbar.tsx)

# ToolbarButton API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Data Grid - Toolbar component](/x/react-data-grid/components/toolbar)

## Import

```jsx
import { ToolbarButton } from '@mui/x-data-grid/components';
// or
import { ToolbarButton } from '@mui/x-data-grid';
// or
import { ToolbarButton } from '@mui/x-data-grid-pro';
// or
import { ToolbarButton } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/toolbarV8/ToolbarButton.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/toolbarV8/ToolbarButton.tsx)