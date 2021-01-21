import * as React from 'react';
import { allColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { preferencePanelStateSelector } from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { ApiContext } from '../api-context';

export function PreferencesPanel() {
  const apiRef = React.useContext(ApiContext);
  const columns = useGridSelector(apiRef, allColumnsSelector);
  const options = useGridSelector(apiRef, optionsSelector);
  const preferencePanelState = useGridSelector(apiRef, preferencePanelStateSelector);

  const isColumnsTabOpen = preferencePanelState.openedPanelValue === PreferencePanelsValue.columns;
  const isFiltersTabOpen = !preferencePanelState.openedPanelValue || !isColumnsTabOpen;

  const ColumnSelectorComponent = apiRef!.current.components.ColumnsPanel!;
  const FilterPanelComponent = apiRef!.current.components.FilterPanel!;
  const Panel = apiRef!.current.components.Panel!;
  return (
    <Panel
      open={columns.length > 0 && preferencePanelState.open}
      {...apiRef?.current.componentsProps?.panel}
    >
      {!options.disableColumnSelector && isColumnsTabOpen && (
        <ColumnSelectorComponent {...apiRef?.current.componentsProps?.columnsPanel} />
      )}
      {!options.disableColumnFilter && isFiltersTabOpen && (
        <FilterPanelComponent {...apiRef?.current.componentsProps?.filterPanel} />
      )}
    </Panel>
  );
}
