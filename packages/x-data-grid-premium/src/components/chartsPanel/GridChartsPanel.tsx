'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import useId from '@mui/utils/useId';
import type { GridChartsConfigurationOptions } from '@mui/x-internals/types';
import { useGridSelector, vars } from '@mui/x-data-grid-pro/internals';
import { GridMenu, GridOverlay } from '@mui/x-data-grid-pro';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { ChartState } from '../../models/gridChartsIntegration';
import { GridChartsPanelChart } from './chart/GridChartsPanelChart';
import { GridChartsPanelCustomize } from './customize/GridChartsPanelCustomize';
import { gridChartsIntegrationActiveChartIdSelector } from '../../hooks/features/chartsIntegration/gridChartsIntegrationSelectors';
import { useGridChartsIntegrationContext } from '../../hooks/utils/useGridChartIntegration';
import { GridChartsPanelData } from './data/GridChartsPanelData';

export interface GridChartsPanelProps {
  /**
   * The schema of the charts configuration.
   * @type {GridChartsConfigurationOptions}
   * @default {}
   */
  schema?: GridChartsConfigurationOptions;
  /**
   * Override the default column name generation logic. Use field in combination with the grid state to determine the name of the column that will be shown to the user.
   * @param {string} field The field name
   * @returns {string | undefined} The name of the column or undefined if the column name should be determined by the grid
   */
  getColumnName?: (field: string) => string | undefined;
}

type OwnerState = DataGridPremiumProcessedProps;

const GridChartsPanelHeader = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelHeader',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.25),
  padding: vars.spacing(1, 0.5, 0, 0.75),
  boxSizing: 'border-box',
});

const GridChartsPanelTitle = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelTitle',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.large,
  fontWeight: vars.typography.fontWeight.medium,
  marginLeft: vars.spacing(0.5),
  marginRight: 'auto',
});

const GridChartsPanelChartSelection = styled('button', {
  name: 'MuiDataGrid',
  slot: 'ChartsPanelChartSelection',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.25),
  padding: vars.spacing(0.75, 0.5),
  borderRadius: vars.radius.base,
  font: vars.typography.font.large,
  fontWeight: vars.typography.fontWeight.medium,
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  outline: 'none',
  marginRight: 'auto',
  '&:hover, &:focus-visible': {
    backgroundColor: vars.colors.interactive.hover,
  },
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
          configuration: PropTypes.object.isRequired,
          dimensions: PropTypes.arrayOf(
            PropTypes.shape({
              data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))
                .isRequired,
              id: PropTypes.string.isRequired,
              label: PropTypes.string.isRequired,
            }),
          ).isRequired,
          dimensionsLabel: PropTypes.string,
          label: PropTypes.string,
          maxDimensions: PropTypes.number,
          maxValues: PropTypes.number,
          synced: PropTypes.bool.isRequired,
          type: PropTypes.string.isRequired,
          values: PropTypes.arrayOf(
            PropTypes.shape({
              data: PropTypes.arrayOf(PropTypes.number).isRequired,
              id: PropTypes.string.isRequired,
              label: PropTypes.string.isRequired,
            }),
          ).isRequired,
          valuesLabel: PropTypes.string,
        }),
        PropTypes.string,
      ]).isRequired,
    ),
  ).isRequired,
} as any;

function GridChartsPanel(props: GridChartsPanelProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const { schema = {} } = props;
  const activeChartId = useGridSelector(apiRef, gridChartsIntegrationActiveChartIdSelector);
  const { chartStateLookup } = useGridChartsIntegrationContext();
  const [activeTab, setActiveTab] = React.useState('chart');

  const chartEntries = React.useMemo(() => Object.entries(chartStateLookup), [chartStateLookup]);
  const activeChartType = React.useMemo(
    () => chartStateLookup[activeChartId]?.type || '',
    [chartStateLookup, activeChartId],
  );
  const currentChartConfiguration: GridChartsConfigurationOptions[string] = React.useMemo(() => {
    return schema[activeChartType] || {};
  }, [schema, activeChartType]);

  const handleChartSyncChange = React.useCallback(
    (newSyncState: boolean) => {
      apiRef.current.setChartSynchronizationState(activeChartId, newSyncState);
    },
    [apiRef, activeChartId],
  );

  const handleChartTypeChange = React.useCallback(
    (type: string) => {
      apiRef.current.setChartType(activeChartId, type);
    },
    [apiRef, activeChartId],
  );

  const tabItems = React.useMemo(
    () => [
      {
        value: 'chart',
        label: apiRef.current.getLocaleText('chartsTabChart'),
        children: (
          <GridChartsPanelChart
            schema={schema}
            selectedChartType={chartStateLookup[activeChartId]?.type}
            onChartTypeChange={handleChartTypeChange}
          />
        ),
      },
      {
        value: 'data',
        label: apiRef.current.getLocaleText('chartsTabFields'),
        children: <GridChartsPanelData />,
      },
      {
        value: 'customize',
        label: apiRef.current.getLocaleText('chartsTabCustomize'),
        children: (
          <GridChartsPanelCustomize
            activeChartId={activeChartId}
            sections={currentChartConfiguration.customization || []}
          />
        ),
      },
    ],
    [
      apiRef,
      activeChartId,
      chartStateLookup,
      handleChartTypeChange,
      schema,
      currentChartConfiguration,
    ],
  );

  return (
    <React.Fragment>
      <GridChartsPanelHeader ownerState={rootProps}>
        {chartEntries.length > 1 ? (
          <GridChartsPanelChartSelector activeChartId={activeChartId} chartEntries={chartEntries} />
        ) : (
          <GridChartsPanelTitle ownerState={rootProps}>Charts</GridChartsPanelTitle>
        )}
        {chartEntries.length > 0 && (
          <rootProps.slots.baseTooltip title={rootProps.localeText.chartsSyncButtonLabel}>
            <rootProps.slots.baseToggleButton
              value="sync"
              aria-label={rootProps.localeText.chartsSyncButtonLabel}
              selected={chartStateLookup[activeChartId]?.synced}
              onClick={() => {
                handleChartSyncChange(!chartStateLookup[activeChartId]?.synced);
              }}
            >
              {chartStateLookup[activeChartId]?.synced ? (
                <rootProps.slots.chartsSyncIcon fontSize="small" />
              ) : (
                <rootProps.slots.chartsSyncDisabledIcon fontSize="small" />
              )}
            </rootProps.slots.baseToggleButton>
          </rootProps.slots.baseTooltip>
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
      {chartEntries.length > 0 ? (
        <rootProps.slots.baseTabs
          items={tabItems}
          value={activeTab}
          onChange={(_event, value) => {
            setActiveTab(value);
          }}
          {...rootProps.slotProps?.baseTabs}
        />
      ) : (
        <GridOverlay>{apiRef.current.getLocaleText('chartsNoCharts')}</GridOverlay>
      )}
    </React.Fragment>
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
   * @returns {string | undefined} The name of the column or undefined if the column name should be determined by the grid
   */
  getColumnName: PropTypes.func,
  /**
   * The schema of the charts configuration.
   * @type {GridChartsConfigurationOptions}
   * @default {}
   */
  schema: PropTypes.object,
} as any;

export { GridChartsPanel };
