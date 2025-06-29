import * as React from 'react';
import { SidebarHeader } from '../sidebar';
import { GridChartsDataPanelSearch } from './GridChartsDataPanelSearch';

export interface GridChartsDataPanelHeaderProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
}

function GridChartsDataPanelHeader(props: GridChartsDataPanelHeaderProps) {
  const { searchValue, onSearchValueChange } = props;

  return (
    <SidebarHeader>
      <GridChartsDataPanelSearch
        value={searchValue}
        onClear={() => onSearchValueChange('')}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSearchValueChange(event.target.value)
        }
      />
    </SidebarHeader>
  );
}

export { GridChartsDataPanelHeader };
