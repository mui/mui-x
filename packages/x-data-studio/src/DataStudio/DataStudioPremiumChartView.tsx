'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import { createSvgIcon } from '@mui/material/utils';
import {
  ChartsPanelTrigger,
  ColumnsPanelTrigger,
  DataGridPremium,
  ExportCsv,
  FilterPanelTrigger,
  GridChartsIntegrationContextProvider,
  GridChartsPanel,
  GridChartsRendererProxy,
  GridSidebarValue,
  PivotPanelTrigger,
  Toolbar,
  ToolbarButton,
  gridClasses,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { ChartsRenderer, configurationOptions } from '@mui/x-charts-premium/ChartsRenderer';
import type { DataStudioChartViewProps, DataStudioDataset } from './DataStudio.types';

type ChartWorkspaceMode = 'chart' | 'grid';

// Icons — inlined to avoid the `@mui/icons-material` dependency, matching the
// rest of the package (`DataStudioTabBar`, `DataStudioSidebarViewItem`).
const ColumnsIcon = createSvgIcon(
  <path d="M14.67 5v14H9.33V5h5.34zm1 14H21V5h-5.33v14zm-7.34 0V5H3v14h5.33z" />,
  'ViewColumn',
);
const FilterIcon = createSvgIcon(
  <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />,
  'FilterList',
);
const PivotIcon = createSvgIcon(
  <path d="M21 7.5L17.5 4l-1.41 1.41L17.67 7H10v2h7.67l-1.59 1.59L17.5 12 21 8.5V7.5zM7 7H3v2h4V7zm0 4H3v2h4v-2zm0 4H3v2h4v-2zm12 0h-8v2h6.59l-1.59 1.59L17.5 20l3.5-3.5v-1L17.5 12l-1.41 1.41L17.67 15H19v0z" />,
  'PivotTableChart',
);
const ChartIcon = createSvgIcon(
  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />,
  'InsertChartOutlined',
);
const DownloadIcon = createSvgIcon(
  <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />,
  'SaveAlt',
);

interface PremiumChartViewToolbarProps {
  datasets: DataStudioDataset[];
  activeDatasetId: string;
  onDatasetChange: (id: string) => void;
  mode: ChartWorkspaceMode;
  onModeChange: (next: ChartWorkspaceMode) => void;
}

function PremiumChartViewToolbar({
  datasets,
  activeDatasetId,
  onDatasetChange,
  mode,
  onModeChange,
}: PremiumChartViewToolbarProps) {
  return (
    <Toolbar>
      <Select
        size="small"
        value={activeDatasetId}
        onChange={(event) => onDatasetChange(event.target.value as string)}
        inputProps={{ 'aria-label': 'Dataset' }}
        sx={{ minWidth: 160, height: 32, fontSize: '0.8125rem' }}
      >
        {datasets.map((dataset) => (
          <MenuItem key={dataset.id} value={dataset.id}>
            {typeof dataset.label === 'string' ? dataset.label : dataset.id}
          </MenuItem>
        ))}
      </Select>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={mode}
        onChange={(_event, next: ChartWorkspaceMode | null) => {
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

/**
 * Built-in chart workspace for `plan="premium"`. Renders the active dataset in
 * a `<DataGridPremium chartsIntegration>` and overlays the chart through
 * `<GridChartsRendererProxy>` so users can configure + preview a chart without
 * leaving the dataset. Toggle between chart-only and grid-only views via the
 * toolbar's `ToggleButtonGroup`.
 *
 * Override by passing your own component via `slots.chartView`.
 */
export function DataStudioPremiumChartView(props: DataStudioChartViewProps) {
  const { dataset, datasets, onChangeDataset, dataSourceCache } = props;
  const chartGridApiRef = useGridApiRef();
  const [mode, setMode] = React.useState<ChartWorkspaceMode>('chart');

  if (!dataset) {
    return <Box sx={{ p: 3, color: 'text.secondary' }}>No data source selected.</Box>;
  }

  return (
    <GridChartsIntegrationContextProvider>
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
              ? (row: Record<string, unknown>) => row[dataset.rowIdField as string] as string
              : undefined)
          }
          dataSource={dataset.dataSource}
          dataSourceCache={dataSourceCache}
          chartsIntegration
          showToolbar
          density="compact"
          slots={{
            chartsPanel: GridChartsPanel,
            toolbar: PremiumChartViewToolbar as any,
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
              [`& .${gridClasses.columnHeaders}`]: { display: 'none' },
              [`& .${gridClasses.virtualScroller}`]: { display: 'none' },
              [`& .${gridClasses.overlayWrapper}, & .${gridClasses.overlayWrapperInner}`]: {
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
