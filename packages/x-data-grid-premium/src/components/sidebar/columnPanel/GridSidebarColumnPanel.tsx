import * as React from 'react';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridSidebarColumnPanelHeader as Header } from './GridSidebarColumnPanelHeader';
import { GridSidebarColumnPanelBody as Body } from './GridSidebarColumnPanelBody';

export function GridSidebarColumnPanel({
  pivotParams,
}: {
  pivotParams: NonNullable<DataGridPremiumProcessedProps['pivotParams']>;
}) {
  const { pivotMode, onPivotModeChange, pivotModel, onPivotModelChange } = pivotParams;
  const [searchState, setSearchState] = React.useState<{
    value: string;
    enabled: boolean;
  }>({
    value: '',
    enabled: false,
  });

  return (
    <React.Fragment>
      <Header
        pivotMode={pivotMode}
        onPivotModeChange={onPivotModeChange}
        searchState={searchState}
        onSearchStateChange={setSearchState}
      />
      <Body
        pivotModel={pivotModel}
        columns={pivotParams.initialColumns ?? []}
        onPivotModelChange={onPivotModelChange}
        searchState={searchState}
      />
    </React.Fragment>
  );
}
