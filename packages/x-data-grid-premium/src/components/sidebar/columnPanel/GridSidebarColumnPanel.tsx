import * as React from 'react';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridSidebarColumnPanelHeader as Header } from './GridSidebarColumnPanelHeader';
import { GridSidebarColumnPanelBody as Body } from './GridSidebarColumnPanelBody';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';

export function GridSidebarColumnPanel({
  pivotParams,
}: {
  pivotParams: NonNullable<DataGridPremiumProcessedProps['pivotParams']>;
}) {
  const { pivotMode, onPivotModeChange, pivotModel, onPivotModelChange } = pivotParams;
  const rootProps = useGridRootProps();
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

      {pivotMode ? (
        <Body
          pivotModel={pivotModel}
          columns={pivotParams.initialColumns ?? []}
          onPivotModelChange={onPivotModelChange}
          searchState={searchState}
        />
      ) : (
        <rootProps.slots.columnsManagement hideHeader {...rootProps.slotProps?.columnsManagement} />
      )}
    </React.Fragment>
  );
}
