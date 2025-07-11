import * as React from 'react';
import { SidebarHeader } from '../../sidebar';
import { GridChartsPanelDataSearch } from './GridChartsPanelDataSearch';

export interface GridChartsPanelDataHeaderProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
}

function GridChartsPanelDataHeader(props: GridChartsPanelDataHeaderProps) {
  const { searchValue, onSearchValueChange } = props;

  return (
    <SidebarHeader>
      <GridChartsPanelDataSearch
        value={searchValue}
        onClear={() => onSearchValueChange('')}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSearchValueChange(event.target.value)
        }
      />
    </SidebarHeader>
  );
}

export { GridChartsPanelDataHeader };
