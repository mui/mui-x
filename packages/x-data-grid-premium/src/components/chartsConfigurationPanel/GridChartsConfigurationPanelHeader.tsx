import * as React from 'react';
import { SidebarHeader } from '../sidebar';
import { GridChartsConfigurationPanelSearch } from './GridChartsConfigurationPanelSearch';

export interface GridChartsConfigurationPanelHeaderProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
}

function GridChartsConfigurationPanelHeader(props: GridChartsConfigurationPanelHeaderProps) {
  const { searchValue, onSearchValueChange } = props;

  return (
    <SidebarHeader>
      <GridChartsConfigurationPanelSearch
        value={searchValue}
        onClear={() => onSearchValueChange('')}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSearchValueChange(event.target.value)
        }
      />
    </SidebarHeader>
  );
}

export { GridChartsConfigurationPanelHeader };
