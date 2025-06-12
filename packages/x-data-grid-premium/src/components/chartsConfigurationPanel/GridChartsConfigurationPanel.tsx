import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridChartsConfigurationOptions } from '../../models/gridChartsIntegration';
import { GridChartTypeSelector } from './GridChartTypeSelector';
import { GridChartsConfigurationPanelHeader } from './GridChartsConfigurationPanelHeader';
import { GridChartsConfigurationPanelBody } from './GridChartsConfigurationPanelBody';
import { GridChartsConfigurationForm } from './GridChartsConfigurationForm';
import { Tab, TabList, TabPanel, Tabs } from '../tabs';

export interface GridChartsConfigurationPanelProps {
  schema?: GridChartsConfigurationOptions;
}

function GridChartsConfigurationPanel() {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  return (
    <Tabs initialTab="chartType">
      <TabList>
        <Tab value="chartType">Chart</Tab>
        <Tab value="data">Data</Tab>
        <Tab value="configuration">Config</Tab>
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
      <TabPanel value="chartType">
        <GridChartTypeSelector />
      </TabPanel>
      <TabPanel value="data">
        <GridChartsConfigurationPanelHeader
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
        />
        <GridChartsConfigurationPanelBody searchValue={searchValue} />
      </TabPanel>
      <TabPanel value="configuration">
        <GridChartsConfigurationForm />
      </TabPanel>
    </Tabs>
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
