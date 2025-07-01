'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import useId from '@mui/utils/useId';
import { useGridSelector, vars } from '@mui/x-data-grid-pro/internals';
import { GridMenu } from '@mui/x-data-grid-pro';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { ChartState, GridChartsConfigurationOptions } from '../../models/gridChartsIntegration';
import { GridChartsPanelChart } from './chart/GridChartsPanelChart';
import { GridChartsPanelCustomize } from './customize/GridChartsPanelCustomize';
import { Tab, TabList, TabPanel, Tabs } from '../tabs';
import { gridChartsIntegrationActiveChartIdSelector } from '../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import { useGridChartsIntegrationContext } from '../../hooks/utils/useGridChartIntegration';
import { GridChartsPanelData } from './data/GridChartsPanelData';
import { SidebarHeader } from '../sidebar';

export interface GridChartsPanelProps {
  /**
   * The schema of the charts configuration.
   * @type {GridChartsConfigurationOptions}
   */
  schema?: GridChartsConfigurationOptions;
  /**
   * Override the default column name generation logic. Use field in combination with the grid state to determine the name of the column that will be shown to the user.
   * @param {string} field The field name
   * @returns {string} The name of the column
   */
  getColumnName?: (field: string) => string;
}

type OwnerState = DataGridPremiumProcessedProps;

const GridChartsPanelHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelHeader',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.spacing(1),
  padding: vars.spacing(1, 0.75, 0, 1.5),
  boxSizing: 'border-box',
});

const GridChartsPanelTitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelTitle',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.large,
  fontWeight: vars.typography.fontWeight.medium,
});

const GridChartsPanelChartSelection = styled('button', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelChartSelection',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.25),
  padding: 0,
  font: vars.typography.font.large,
  fontWeight: vars.typography.fontWeight.medium,
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  outline: 'none',
});

function GridChartsPanelChartSelector(props: {
  activeChartId: string;
  chartEntries: [string, ChartState][];
}) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const { activeChartId, chartEntries } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const menuId = useId();
  const triggerId = useId();
  const activeChart = chartEntries.find(([chartId]) => chartId === activeChartId);

  return (
    <React.Fragment>
      <GridChartsPanelChartSelection
        id={triggerId}
        aria-haspopup="true"
        aria-controls={open ? menuId : undefined}
        aria-expanded={open ? 'true' : undefined}
        ownerState={rootProps}
        onClick={() => setOpen(!open)}
        ref={triggerRef}
      >
        {activeChart?.[1]?.label}
        <rootProps.slots.promptChangesToggleIcon fontSize="small" />
      </GridChartsPanelChartSelection>
      <GridMenu
        open={open}
        target={triggerRef.current}
        onClose={() => setOpen(false)}
        position="bottom-start"
      >
        <rootProps.slots.baseMenuList
          id={menuId}
          aria-labelledby={triggerId}
          autoFocusItem
          {...rootProps.slotProps?.baseMenuList}
        >
          {chartEntries.map(([chartId, chartState]) => (
            <rootProps.slots.baseMenuItem
              key={chartId}
              value={chartId}
              onClick={() => {
                apiRef.current.setActiveChartId(chartId);
                setOpen(false);
              }}
              selected={chartId === activeChartId}
              {...rootProps.slotProps?.baseMenuItem}
            >
              {chartState.label || chartId}
            </rootProps.slots.baseMenuItem>
          ))}
        </rootProps.slots.baseMenuList>
      </GridMenu>
    </React.Fragment>
  );
}

GridChartsPanelChartSelector.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  activeChartId: PropTypes.string.isRequired,
  chartEntries: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          categories: PropTypes.arrayOf(
            PropTypes.shape({
              data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))
                .isRequired,
              id: PropTypes.string.isRequired,
              label: PropTypes.string.isRequired,
            }),
          ).isRequired,
          configuration: PropTypes.object.isRequired,
          label: PropTypes.string,
          series: PropTypes.arrayOf(PropTypes.object).isRequired,
          synced: PropTypes.bool.isRequired,
          type: PropTypes.string.isRequired,
        }),
        PropTypes.string,
      ]).isRequired,
    ),
  ).isRequired,
} as any;

function GridChartsPanel(_: GridChartsPanelProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const activeChartId = useGridSelector(apiRef, gridChartsIntegrationActiveChartIdSelector);
  const { chartStateLookup, setChartState } = useGridChartsIntegrationContext();
  const chartEntries = Object.entries(chartStateLookup);

  const handleChartSyncChange = React.useCallback(
    (newSyncState: boolean) => {
      apiRef.current.setChartSynchronizationState(activeChartId, newSyncState);
    },
    [apiRef, activeChartId],
  );

  const handleChartTypeChange = React.useCallback(
    (type: string) => {
      setChartState(activeChartId, { type });
    },
    [activeChartId, setChartState],
  );

  // TODO: render a placeholder if there are no charts available - use the locale text `chartsConfigurationNoCharts`

  return (
    <Tabs initialTab="chart">
      <SidebarHeader>
        <GridChartsPanelHeader ownerState={rootProps}>
          {chartEntries.length > 1 ? (
            <GridChartsPanelChartSelector
              activeChartId={activeChartId}
              chartEntries={chartEntries}
            />
          ) : (
            <GridChartsPanelTitle ownerState={rootProps}>Charts</GridChartsPanelTitle>
          )}
          <rootProps.slots.baseIconButton
            onClick={() => {
              apiRef.current.setChartsPanelOpen(false);
            }}
            aria-label={apiRef.current.getLocaleText('chartsCloseButton')}
            {...rootProps.slotProps?.baseIconButton}
          >
            <rootProps.slots.sidebarCloseIcon fontSize="small" />
          </rootProps.slots.baseIconButton>
        </GridChartsPanelHeader>
        <TabList>
          <Tab value="chart">{apiRef.current.getLocaleText('chartsTabChart')}</Tab>
          <Tab value="data">{apiRef.current.getLocaleText('chartsTabFields')}</Tab>
          <Tab value="customize">{apiRef.current.getLocaleText('chartsTabCustomize')}</Tab>
        </TabList>
      </SidebarHeader>
      <TabPanel value="chart">
        <GridChartsPanelChart
          charts={chartStateLookup}
          activeChartId={activeChartId}
          selectedChartType={chartStateLookup[activeChartId]?.type}
          onChartSyncChange={handleChartSyncChange}
          onChartTypeChange={handleChartTypeChange}
        />
      </TabPanel>
      <TabPanel value="data">
        <GridChartsPanelData />
      </TabPanel>
      <TabPanel value="customize">
        <GridChartsPanelCustomize activeChartId={activeChartId} />
      </TabPanel>
    </Tabs>
  );
}

GridChartsPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override the default column name generation logic. Use field in combination with the grid state to determine the name of the column that will be shown to the user.
   * @param {string} field The field name
   * @returns {string} The name of the column
   */
  getColumnName: PropTypes.func,
  /**
   * The schema of the charts configuration.
   * @type {GridChartsConfigurationOptions}
   */
  schema: PropTypes.object,
} as any;

export { GridChartsPanel };
