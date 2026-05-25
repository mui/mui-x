import * as React from 'react';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import GlobalStyles from '@mui/material/GlobalStyles';
import Snackbar from '@mui/material/Snackbar';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  extendTheme,
} from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import {
  ChartsPanelTrigger,
  ColumnsPanelTrigger,
  DataGridPremium,
  ExportCsv,
  FilterPanelTrigger,
  GridActionsCellItem,
  GridChartsIntegrationContextProvider,
  GridChartsPanel,
  GridChartsRendererProxy,
  GridRowModes,
  GridSidebarValue,
  PivotPanelTrigger,
  Toolbar,
  ToolbarButton,
  gridClasses,
  useGridApiRef,
  type DataGridPremiumProps,
  type GridColDef,
  type GridRowId,
  type GridRowModesModel,
} from '@mui/x-data-grid-premium';
import ColumnsIcon from '@mui/icons-material/ViewColumn';
import FilterIcon from '@mui/icons-material/FilterList';
import PivotIcon from '@mui/icons-material/PivotTableChart';
import ChartIcon from '@mui/icons-material/InsertChartOutlined';
import DownloadIcon from '@mui/icons-material/SaveAlt';
import { ChartsRenderer, configurationOptions } from '@mui/x-charts-premium/ChartsRenderer';
import {
  DataStudio,
  createDataStudioDatasetsFromAPI,
  createNextRouterRoutingAdapter,
  type DataStudioChartViewProps,
  type DataStudioDataSource,
  type DataStudioDataset,
} from '@mui/x-data-studio';


const demoTheme = extendTheme();

type CoffeeBeanRow = Record<string, string | number>;
type CoffeeBeansDataGridProps = DataGridPremiumProps & {
  rowIdField?: string;
  /**
   * The wrapper writes its `handleCreateRow` into `addRowRef.current` on mount
   * (and clears it on unmount). Data Studio's toolbar invokes
   * `addRowRef.current?.()` when the user clicks "Add row", so the request is
   * always routed to the currently mounted wrapper's apiRef — even if the user
   * switches datasets mid-flight.
   */
  addRowRef?: React.MutableRefObject<(() => Promise<void>) | null>;
  /**
   * Called by the wrapper after a row was successfully created server-side.
   * The outer demo surfaces this through a transient Snackbar.
   * @param {string} createdRowId The id of the freshly inserted row.
   */
  onRowAdded?: (createdRowId: string) => void;
};

const ACTIONS_FIELD = '__dataStudioActions';

const usdCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Per-dataset map of fields that should render formatted in the grid. The
// server stores raw numbers; this is the "user formats it" half of the
// contract.
const COLUMN_FORMATTERS: Record<
  string,
  Record<string, (value: unknown) => string>
> = {
  products: {
    'Unit Price': (value) =>
      typeof value === 'number' ? usdCurrency.format(value) : '',
    'Price per 100g': (value) =>
      typeof value === 'number' ? usdCurrency.format(value) : '',
    Profit: (value) => (typeof value === 'number' ? usdCurrency.format(value) : ''),
  },
  orders: {
    'Unit Price': (value) =>
      typeof value === 'number' ? usdCurrency.format(value) : '',
    Sales: (value) => (typeof value === 'number' ? usdCurrency.format(value) : ''),
  },
};

function decorateColumns(
  datasetId: string,
  columns: readonly GridColDef[],
): GridColDef[] {
  const formatters = COLUMN_FORMATTERS[datasetId];
  if (!formatters) {
    return columns as GridColDef[];
  }
  return columns.map((column) => {
    if (!(column.field in formatters)) {
      return column;
    }
    return { ...column, valueFormatter: formatters[column.field] };
  });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.cause instanceof Error ? error.cause.message : error.message;
  }

  return String(error);
}

function isIdField(field: string) {
  return /(^|[\s_-])id$/i.test(field);
}

function createDemoCellValue(
  column: GridColDef,
  rowIdField: string | undefined,
  rowIndex: number,
) {
  if (column.field === rowIdField || isIdField(column.field)) {
    return `demo-${rowIndex}`;
  }

  if (column.type === 'number') {
    return 0;
  }

  if (/date/i.test(column.field)) {
    return new Date().toISOString().slice(0, 10);
  }

  return '';
}

function createDemoRow(
  columns: readonly GridColDef[],
  rowIdField: string | undefined,
) {
  const rowIndex = Date.now();
  const row: CoffeeBeanRow = {};

  columns.forEach((column) => {
    if (column.field === ACTIONS_FIELD) {
      return;
    }

    row[column.field] = createDemoCellValue(column, rowIdField, rowIndex);
  });

  if (rowIdField && !rowIdField.startsWith('__') && row[rowIdField] == null) {
    row[rowIdField] = `demo-${rowIndex}`;
  }

  return row;
}

function CoffeeBeansDataGrid(inProps: CoffeeBeansDataGridProps) {
  const {
    apiRef,
    columns: columnsProp,
    dataSource,
    onDataSourceError,
    rowIdField,
    addRowRef,
    onRowAdded,
    ...props
  } = inProps;
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const reportDataSourceError = React.useCallback(
    (error: unknown) => {
      const nextError = error instanceof Error ? error : new Error(String(error));
      onDataSourceError?.(
        nextError as Parameters<
          NonNullable<CoffeeBeansDataGridProps['onDataSourceError']>
        >[0],
      );
    },
    [onDataSourceError],
  );

  const clearDataSourceCache = React.useCallback(() => {
    apiRef?.current?.dataSource.cache.clear();
  }, [apiRef]);

  const handleCreateRow = React.useCallback(async () => {
    const createRow = (dataSource as DataStudioDataSource | undefined)?.createRow;
    if (!createRow || !apiRef) {
      return;
    }
    try {
      const demoRow = createDemoRow(columnsProp, rowIdField);
      const createdRow = (await createRow(demoRow)) as CoffeeBeanRow;
      // Refresh the data source so the new row is part of the cache. We rely
      // on the cache-clear + refetch pair rather than `updateRows` because
      // server-side rows live in the dataSource cache, not the client row
      // model.
      apiRef.current?.dataSource.cache.clear();
      await apiRef.current?.dataSource.fetchRows();
      // The created row's id: prefer the rowIdField value (the server may add
      // synthetic ids like __rowId, but our `getRowId` resolver from
      // `createDataStudioDatasetsFromAPI` favours the dataset's rowIdField).
      const createdRowId =
        rowIdField && createdRow[rowIdField] != null
          ? String(createdRow[rowIdField])
          : null;
      if (createdRowId != null) {
        // Only flip the row into edit mode if it actually exists in the
        // currently-cached page. Server-side rows are paginated/sorted and the
        // freshly-created row may live outside page 0 — calling
        // `setRowModesModel` for an id that isn't in `apiRef.current` makes the
        // grid throw `No row with id #<id> found` from `getCellParams`.
        const isLoaded = Boolean(
          apiRef.current?.state?.rows?.dataRowIdToModelLookup?.[createdRowId],
        );
        if (isLoaded) {
          setRowModesModel((model) => ({
            ...model,
            [createdRowId]: { mode: GridRowModes.Edit },
          }));
        }
        onRowAdded?.(createdRowId);
      }
    } catch (error) {
      reportDataSourceError(error);
    }
  }, [apiRef, columnsProp, dataSource, onRowAdded, reportDataSourceError, rowIdField]);

  // Publish the wrapper's handleCreateRow to the outer-scope ref so the
  // toolbar's `Add row` button can invoke whichever wrapper is currently
  // mounted. Clearing on unmount means a click that lands after the user has
  // switched datasets becomes a safe no-op.
  React.useEffect(() => {
    if (!addRowRef) {
      return undefined;
    }
    addRowRef.current = handleCreateRow;
    return () => {
      if (addRowRef.current === handleCreateRow) {
        addRowRef.current = null;
      }
    };
  }, [addRowRef, handleCreateRow]);

  const handleEditClick = React.useCallback(
    (id: GridRowId) => () => {
      setRowModesModel((model) => ({
        ...model,
        [id]: { mode: GridRowModes.Edit },
      }));
    },
    [],
  );

  const handleSaveClick = React.useCallback(
    (id: GridRowId) => () => {
      setRowModesModel((model) => ({
        ...model,
        [id]: { mode: GridRowModes.View },
      }));
    },
    [],
  );

  const handleCancelClick = React.useCallback(
    (id: GridRowId) => () => {
      setRowModesModel((model) => ({
        ...model,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      }));
    },
    [],
  );

  const handleDeleteClick = React.useCallback(
    (id: GridRowId) => async () => {
      const deleteRow = (dataSource as DataStudioDataSource | undefined)?.deleteRow;
      const row = apiRef?.current?.getRow(id);

      try {
        const deletedRow = deleteRow
          ? await deleteRow(id, row ?? undefined)
          : { id, _action: 'delete' };

        clearDataSourceCache();
        apiRef?.current?.updateRows([deletedRow]);
      } catch (error) {
        reportDataSourceError(error);
      }
    },
    [apiRef, clearDataSourceCache, dataSource, reportDataSourceError],
  );

  const columns = React.useMemo(() => {
    const editableColumns = columnsProp.map((column) => ({
      ...column,
      editable: column.field !== rowIdField,
    }));

    return [
      ...editableColumns,
      {
        field: ACTIONS_FIELD,
        type: 'actions',
        headerName: '',
        width: 112,
        minWidth: 112,
        align: 'center',
        headerAlign: 'center',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key="save"
                icon={<SaveIcon />}
                label="Save"
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                key="cancel"
                icon={<CancelIcon />}
                label="Cancel"
                onClick={handleCancelClick(id)}
              />,
            ];
          }

          return [
            <GridActionsCellItem
              key="edit"
              icon={<EditIcon />}
              label="Edit"
              onClick={handleEditClick(id)}
            />,
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
            />,
          ];
        },
      },
    ] satisfies GridColDef[];
  }, [
    columnsProp,
    handleCancelClick,
    handleDeleteClick,
    handleEditClick,
    handleSaveClick,
    rowIdField,
    rowModesModel,
  ]);

  return (
    <DataGridPremium
      {...props}
      apiRef={apiRef}
      dataSource={dataSource}
      columns={columns}
      editMode="row"
      rowModesModel={rowModesModel}
      onDataSourceError={onDataSourceError}
      onRowModesModelChange={setRowModesModel}
    />
  );
}

type ChartWorkspaceMode = 'chart' | 'grid';

/**
 * Custom toolbar for the embedded chart-view DataGridPremium. Replaces the
 * default Premium toolbar with: dataset selector + Chart/Data grid toggle on
 * the left + the standard grid actions (Columns / Filter / Pivot / Charts /
 * Export / Search) on the right. Lives inside the grid's toolbar slot, so it
 * naturally inherits the grid's panel triggers (Columns, Filter, etc.) and
 * the styled `<Toolbar>` container.
 */
function ChartViewGridToolbar({
  datasets,
  activeDatasetId,
  onDatasetChange,
  mode,
  onModeChange,
}: {
  datasets: DataStudioDataset<CoffeeBeanRow>[];
  activeDatasetId: string;
  onDatasetChange: (id: string) => void;
  mode: ChartWorkspaceMode;
  onModeChange: (next: ChartWorkspaceMode) => void;
}) {
  return (
    <Toolbar>
      <Select
        size="small"
        value={activeDatasetId}
        onChange={(event) => onDatasetChange(event.target.value as string)}
        inputProps={{ 'aria-label': 'Dataset' }}
        sx={{ minWidth: 160, height: 32, fontSize: '0.8125rem' }}
      >
        {datasets.map((d) => (
          <MenuItem key={d.id} value={d.id}>
            {typeof d.label === 'string' ? d.label : d.id}
          </MenuItem>
        ))}
      </Select>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={mode}
        onChange={(_, next: ChartWorkspaceMode | null) => {
          if (next !== null) {
            onModeChange(next);
          }
        }}
        aria-label="Chart workspace view"
        sx={{ ml: 1 }}
      >
        <ToggleButton value="chart">Chart</ToggleButton>
        <ToggleButton value="grid">Data grid</ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Columns">
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <ColumnsIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </Tooltip>
        <Tooltip title="Filters">
          <FilterPanelTrigger render={<ToolbarButton />}>
            <FilterIcon fontSize="small" />
          </FilterPanelTrigger>
        </Tooltip>
        <Tooltip title="Pivot">
          <PivotPanelTrigger render={<ToolbarButton />}>
            <PivotIcon fontSize="small" />
          </PivotPanelTrigger>
        </Tooltip>
        <Tooltip title="Charts">
          <ChartsPanelTrigger render={<ToolbarButton />}>
            <ChartIcon fontSize="small" />
          </ChartsPanelTrigger>
        </Tooltip>
        <Tooltip title="Export CSV">
          <ExportCsv render={<ToolbarButton />}>
            <DownloadIcon fontSize="small" />
          </ExportCsv>
        </Tooltip>
      </Box>
    </Toolbar>
  );
}

function CoffeeBeansChartView({
  dataset,
  datasets,
  onChangeDataset,
  dataSourceCache,
}: DataStudioChartViewProps<CoffeeBeanRow>) {
  const chartGridApiRef = useGridApiRef();
  const [mode, setMode] = React.useState<ChartWorkspaceMode>('chart');

  if (!dataset) {
    return (
      <Box sx={{ p: 3, color: 'text.secondary' }}>No data source selected.</Box>
    );
  }

  return (
    <GridChartsIntegrationContextProvider>
      {/*
        The DataGridPremium fills the whole chart view — toolbar at top
        (with the dataset selector + Chart/Data grid toggle wired into its
        slot), grid rows in the middle, charts sidebar on the right. In
        `chart` mode we hide just the rows scroller and overlay the chart
        preview where the rows would be, leaving the grid toolbar + charts
        sidebar fully reachable. In `grid` mode the grid renders normally
        and the chart preview is unmounted.
      */}
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          height: '100%',
          minHeight: 0,
          minWidth: 0,
          width: '100%',
          p: 2,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <DataGridPremium
          key={dataset.id}
          apiRef={chartGridApiRef}
          columns={dataset.columns}
          rows={dataset.rows ?? []}
          getRowId={
            dataset.getRowId ??
            (dataset.rowIdField
              ? (row: CoffeeBeanRow) =>
                  row[dataset.rowIdField as string] as string
              : undefined)
          }
          dataSource={dataset.dataSource}
          dataSourceCache={dataSourceCache}
          chartsIntegration
          showToolbar
          density="compact"
          slots={{
            chartsPanel: GridChartsPanel,
            toolbar: ChartViewGridToolbar as any,
          }}
          slotProps={{
            chartsPanel: { schema: configurationOptions },
            toolbar: {
              datasets,
              activeDatasetId: dataset.id,
              onDatasetChange: onChangeDataset,
              mode,
              onModeChange: setMode,
            } as any,
          }}
          initialState={{
            sidebar: {
              open: true,
              value: GridSidebarValue.Charts,
            },
            chartsIntegration: {
              charts: {
                main: { chartType: 'bar' },
              },
            },
          }}
          sx={{
            flex: 1,
            ...(mode === 'chart' && {
              // Hide the column headers + rows scroller; keep the grid
              // toolbar + the charts sidebar visible. The chart preview
              // overlays the now-empty rows area below.
              [`& .${gridClasses.columnHeaders}`]: { display: 'none' },
              [`& .${gridClasses.virtualScroller}`]: { display: 'none' },
              [`& .${gridClasses.overlayWrapper}, & .${gridClasses.overlayWrapperInner}`]:
                {
                  display: 'none',
                },
            }),
          }}
        />
        {mode === 'chart' ? (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              // Approximate offsets: grid toolbar (~56px) + the chart view's
              // own `p: 2` padding (16px) → ~72px from the top. Sidebar
              // takes ~300px on the right. These are demo values; switch to
              // a measured rect if the toolbar height becomes dynamic.
              top: 72,
              left: 16,
              right: 316,
              bottom: 16,
              display: 'flex',
              bgcolor: 'background.paper',
              pointerEvents: 'none',
            }}
          >
            <GridChartsRendererProxy id="main" renderer={ChartsRenderer} />
          </Box>
        ) : null}
      </Box>
    </GridChartsIntegrationContextProvider>
  );
}

export default function CoffeeBeansSales() {
  const apiRef = useGridApiRef();
  const router = useRouter();
  const routing = React.useMemo(
    () => createNextRouterRoutingAdapter({ router }),
    [router],
  );
  const [datasets, setDatasets] = React.useState<DataStudioDataset<CoffeeBeanRow>[]>(
    [],
  );
  const [schemaError, setSchemaError] = React.useState<string | null>(null);
  const [dataSourceError, setDataSourceError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [addedRowId, setAddedRowId] = React.useState<string | null>(null);
  // The currently-mounted dataGrid wrapper publishes its `handleCreateRow` to
  // this ref. The toolbar's `Add row` button invokes whatever is in the ref,
  // so a stale click landing after a dataset switch becomes a safe no-op.
  const addRowRef = React.useRef<(() => Promise<void>) | null>(null);

  const handleDataSourceError = React.useCallback<
    NonNullable<DataStudioDataset<CoffeeBeanRow>['onDataSourceError']>
  >((nextError) => {
    setDataSourceError(getErrorMessage(nextError));
  }, []);

  const handleRowAdded = React.useCallback((id: string) => {
    setAddedRowId(id);
  }, []);

  const datasetsWithAddRow = React.useMemo(
    () =>
      datasets.map((dataset) => ({
        ...dataset,
        onAddRow: (dataset.dataSource as DataStudioDataSource | undefined)
          ?.createRow
          ? () => addRowRef.current?.() ?? Promise.resolve()
          : undefined,
      })),
    [datasets],
  );

  React.useEffect(() => {
    let active = true;

    createDataStudioDatasetsFromAPI<CoffeeBeanRow>({
      schemaUrl: '/data-studio/coffee-beans/schema',
    }).then(
      (nextDatasets) => {
        if (active) {
          setDatasets(
            nextDatasets.map((dataset) => ({
              ...dataset,
              columns: decorateColumns(dataset.id, dataset.columns),
              onDataSourceError: handleDataSourceError,
            })),
          );
          setSchemaError(null);
          setLoading(false);
        }
      },
      (nextError: Error) => {
        if (active) {
          setSchemaError(nextError.message);
          setLoading(false);
        }
      },
    );

    return () => {
      active = false;
    };
  }, [handleDataSourceError]);

  return (
    <CssVarsProvider theme={demoTheme} defaultMode="system">
      <GlobalStyles
        styles={{
          html: { height: '100%' },
          body: { margin: 0, minHeight: '100%', overflow: 'hidden' },
          '#__next': { minHeight: '100%' },
        }}
      />
      {schemaError === null ? (
        <React.Fragment>
          {dataSourceError === null ? null : (
            <Alert
              severity="error"
              onClose={() => setDataSourceError(null)}
              sx={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 1300,
                maxWidth: 560,
              }}
            >
              {dataSourceError}
            </Alert>
          )}
          <DataStudio
            datasets={datasetsWithAddRow}
            loading={loading}
            layout="tabs"
            routing={routing}
            slots={{ dataGrid: CoffeeBeansDataGrid, chartView: CoffeeBeansChartView }}
            sx={{
              height: '100dvh',
              bgcolor: 'background.paper',
              '& .MuiDataGrid-root': {
                border: 0,
              },
              '& .MuiDataGrid-cell': {
                alignContent: 'center',
              },
            }}
            slotProps={{
              // `addRowRef` and `onRowAdded` are wrapper-specific props consumed
              // by `CoffeeBeansDataGrid`; Data Studio passes them straight
              // through to the dataGrid slot.
              dataGrid: {
                density: 'compact',
                apiRef,
                addRowRef,
                onRowAdded: handleRowAdded,
              } as any,
            }}
          />
          <Snackbar
            open={addedRowId !== null}
            autoHideDuration={4000}
            onClose={() => setAddedRowId(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            message="Row added"
          />
        </React.Fragment>
      ) : (
        <Alert severity="error" sx={{ m: 2 }}>
          {schemaError}
        </Alert>
      )}
    </CssVarsProvider>
  );
}
