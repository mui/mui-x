import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridChartTypeSelector } from './GridChartTypeSelector';
import { GridChartsConfigurationPanelHeader } from './GridChartsConfigurationPanelHeader';
import { GridChartsConfigurationPanelBody } from './GridChartsConfigurationPanelBody';

const TabsRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationTabsRoot',
})({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

const TabList = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationTabList',
})({
  display: 'flex',
  borderBottom: `1px solid ${vars.colors.border.base}`,
  background: vars.colors.background.base,
});

const Tab = styled('button', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationTab',
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ selected }) => ({
  flex: 1,
  padding: vars.spacing(1, 2),
  background: selected ? vars.colors.background.base : 'transparent',
  color: selected ? vars.colors.interactive.selected : vars.colors.foreground.base,
  border: 'none',
  borderBottom: selected
    ? `2px solid ${vars.colors.interactive.selected}`
    : '2px solid transparent',
  font: vars.typography.font.body,
  fontWeight: selected ? vars.typography.fontWeight.medium : vars.typography.fontWeight.regular,
  cursor: 'pointer',
  outline: 'none',
  transition: 'color 0.2s, border-bottom 0.2s',
  '&:hover': {
    background: vars.colors.interactive.hover,
    color: vars.colors.interactive.selected,
  },
}));

const TabPanel = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ChartsConfigurationTabPanel',
  shouldForwardProp: (prop) => prop !== 'hidden',
})<{ hidden?: boolean }>(({ hidden }) => ({
  background: vars.colors.background.base,
  overflow: 'hidden',
  display: hidden ? 'none' : 'flex',
  flexDirection: 'column',
}));

export interface GridChartsConfigurationPanelProps {
  schema?: Record<string, any>;
}

function GridChartsConfigurationPanel() {
  const [activeTab, setActiveTab] = React.useState<'chartType' | 'data' | 'configuration'>(
    'chartType',
  );
  const [searchValue, setSearchValue] = React.useState<string>('');
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  return (
    <TabsRoot>
      <TabList role="tablist">
        <Tab
          type="button"
          role="tab"
          aria-selected={activeTab === 'chartType'}
          tabIndex={activeTab === 'chartType' ? 0 : -1}
          selected={activeTab === 'chartType'}
          onClick={() => setActiveTab('chartType')}
        >
          Chart
        </Tab>
        <Tab
          type="button"
          role="tab"
          aria-selected={activeTab === 'data'}
          tabIndex={activeTab === 'data' ? 0 : -1}
          selected={activeTab === 'data'}
          onClick={() => setActiveTab('data')}
        >
          Data
        </Tab>
        <Tab
          type="button"
          role="tab"
          aria-selected={activeTab === 'configuration'}
          tabIndex={activeTab === 'configuration' ? 0 : -1}
          selected={activeTab === 'configuration'}
          onClick={() => setActiveTab('configuration')}
        >
          Config
        </Tab>
        <rootProps.slots.baseIconButton
          onClick={() => {
            apiRef.current.setChartsConfigurationPanelOpen(false);
          }}
          aria-label={apiRef.current.getLocaleText('pivotCloseButton')}
          {...rootProps.slotProps?.baseIconButton}
        >
          <rootProps.slots.sidebarCloseIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </TabList>
      <TabPanel role="tabpanel" hidden={activeTab !== 'chartType'} aria-labelledby="chart-type-tab">
        <GridChartTypeSelector />
      </TabPanel>
      <TabPanel role="tabpanel" hidden={activeTab !== 'data'} aria-labelledby="data-tab">
        <GridChartsConfigurationPanelHeader
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
        />
        <GridChartsConfigurationPanelBody searchValue={searchValue} />
      </TabPanel>
      <TabPanel
        role="tabpanel"
        hidden={activeTab !== 'configuration'}
        aria-labelledby="configuration-tab"
      >
        <p style={{ padding: '0 16px' }}>
          Will contain chart specific configuration - legend, axes, etc.
        </p>
      </TabPanel>
    </TabsRoot>
  );
}

GridChartsConfigurationPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  schema: PropTypes.object,
} as any;

export { GridChartsConfigurationPanel };
