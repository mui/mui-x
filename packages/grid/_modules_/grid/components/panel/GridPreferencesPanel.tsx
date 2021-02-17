import * as React from 'react';
import { allGridColumnsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridBaseComponentProps } from '../../hooks/features/useGridBaseComponentProps';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridApiContext } from '../GridApiContext';

export function GridPreferencesPanel() {
  const apiRef = React.useContext(GridApiContext);
  const columns = useGridSelector(apiRef, allGridColumnsSelector);
  const options = useGridSelector(apiRef, optionsSelector);
  const preferencePanelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);
  const baseProps = useGridBaseComponentProps(apiRef);

  const isColumnsTabOpen =
    preferencePanelState.openedPanelValue === GridPreferencePanelsValue.columns;
  const isFiltersTabOpen = !preferencePanelState.openedPanelValue || !isColumnsTabOpen;

  const ColumnSelectorComponent = apiRef!.current.components.ColumnsPanel!;
  const FilterPanelComponent = apiRef!.current.components.FilterPanel!;
  const Panel = apiRef!.current.components.Panel!;
  return (
    <Panel
      open={columns.length > 0 && preferencePanelState.open}
      {...baseProps}
      {...apiRef?.current.componentsProps?.panel}
    >
      {!options.disableColumnSelector && isColumnsTabOpen && (
        <ColumnSelectorComponent
          {...baseProps}
          {...apiRef?.current.componentsProps?.columnsPanel}
        />
      )}
      {!options.disableColumnFilter && isFiltersTabOpen && (
        <FilterPanelComponent {...baseProps} {...apiRef?.current.componentsProps?.filterPanel} />
      )}
    </Panel>
  );
}
