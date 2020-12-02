import * as React from 'react';
import { allColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { preferencePanelStateSelector } from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { ApiContext } from '../api-context';
import { ColumnsPanel } from './ColumnsPanel';
import { FilterPanel } from './filterPanel/FilterPanel';
import { Panel } from './Panel';

export function PreferencesPanel() {
  const apiRef = React.useContext(ApiContext);
  const columns = useGridSelector(apiRef, allColumnsSelector);
  const options = useGridSelector(apiRef, optionsSelector);
  const preferencePanelState = useGridSelector(apiRef, preferencePanelStateSelector);

  const isColumnsTabOpen = preferencePanelState.openedPanelValue === PreferencePanelsValue.columns;
  const isFiltersTabOpen = !preferencePanelState.openedPanelValue || !isColumnsTabOpen;

  return (
    <Panel open={columns.length > 0 && preferencePanelState.open}>
      {!options.disableColumnSelector && isColumnsTabOpen && <ColumnsPanel />}
      {!options.disableColumnFilter && isFiltersTabOpen && <FilterPanel />}
    </Panel>
  );
}
