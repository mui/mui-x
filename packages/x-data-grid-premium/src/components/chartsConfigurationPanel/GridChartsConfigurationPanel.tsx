import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridChartsConfigurationOptions } from '../../models/gridChartsIntegration';
import { GridChartTypeSelector } from './GridChartTypeSelector';
import { GridChartsDataPanelHeader } from './GridChartsDataPanelHeader';
import { GridChartsDataPanelBody } from './GridChartsDataPanelBody';
import { GridChartsConfigurationForm } from './GridChartsConfigurationForm';
import { Tab, TabList, TabPanel, Tabs } from '../tabs';

export interface GridChartsConfigurationPanelProps {
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

function GridChartsConfigurationPanel(_: GridChartsConfigurationPanelProps) {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  return (
    <Tabs initialTab="chartType">
      <TabList>
        <Tab value="chartType">
          {apiRef.current.getLocaleText('chartsConfigurationTabChartType')}
        </Tab>
        <Tab value="fields">{apiRef.current.getLocaleText('chartsConfigurationTabFields')}</Tab>
        <Tab value="configuration">
          {apiRef.current.getLocaleText('chartsConfigurationTabConfig')}
        </Tab>
        <rootProps.slots.baseIconButton
          onClick={() => {
            apiRef.current.setChartsConfigurationPanelOpen(false);
          }}
          aria-label={apiRef.current.getLocaleText('chartsConfigurationCloseButton')}
          {...rootProps.slotProps?.baseIconButton}
        >
          <rootProps.slots.sidebarCloseIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </TabList>
      <TabPanel value="chartType">
        <GridChartTypeSelector />
      </TabPanel>
      <TabPanel value="fields">
        <GridChartsDataPanelHeader searchValue={searchValue} onSearchValueChange={setSearchValue} />
        <GridChartsDataPanelBody searchValue={searchValue} />
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
