'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridSelector } from '@mui/x-data-grid-pro/internals';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridChartsConfigurationOptions } from '../../models/gridChartsIntegration';
import { GridChartsPanelChart } from './chart/GridChartsPanelChart';
import { GridChartsPanelDataHeader } from './data/GridChartsPanelDataHeader';
import { GridChartsPanelDataBody } from './data/GridChartsPanelDataBody';
import { GridChartsPanelCustomize } from './customize/GridChartsPanelCustomize';
import { Tab, TabList, TabPanel, Tabs } from '../tabs';
import { gridChartsIntegrationActiveChartIdSelector } from '../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import { useGridChartsIntegrationContext } from '../../hooks/utils/useGridChartIntegration';

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

function GridChartsPanel(_: GridChartsPanelProps) {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const activeChartId = useGridSelector(apiRef, gridChartsIntegrationActiveChartIdSelector);
  const { chartStateLookup, setChartState } = useGridChartsIntegrationContext();

  const handleActiveChartChange = React.useCallback(
    (chartId: string) => {
      apiRef.current.setActiveChartId(chartId);
    },
    [apiRef],
  );

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
      <TabList>
        <Tab value="chart">{apiRef.current.getLocaleText('chartsTabChart')}</Tab>
        <Tab value="data">{apiRef.current.getLocaleText('chartsTabFields')}</Tab>
        <Tab value="customize">{apiRef.current.getLocaleText('chartsTabCustomize')}</Tab>
        <rootProps.slots.baseIconButton
          onClick={() => {
            apiRef.current.setChartsPanelOpen(false);
          }}
          aria-label={apiRef.current.getLocaleText('chartsCloseButton')}
          {...rootProps.slotProps?.baseIconButton}
        >
          <rootProps.slots.sidebarCloseIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </TabList>
      <TabPanel value="chart">
        <GridChartsPanelChart
          charts={chartStateLookup}
          activeChartId={activeChartId}
          selectedChartType={chartStateLookup[activeChartId]?.type}
          onActiveChartChange={handleActiveChartChange}
          onChartSyncChange={handleChartSyncChange}
          onChartTypeChange={handleChartTypeChange}
        />
      </TabPanel>
      <TabPanel value="data">
        <GridChartsPanelDataHeader searchValue={searchValue} onSearchValueChange={setSearchValue} />
        <GridChartsPanelDataBody searchValue={searchValue} />
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
