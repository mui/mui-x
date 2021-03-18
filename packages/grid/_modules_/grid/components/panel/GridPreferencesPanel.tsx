import * as React from 'react';
import { allGridColumnsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridBaseComponentProps } from '../../hooks/features/useGridBaseComponentProps';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridApiContext } from '../GridApiContext';

export const GridPreferencesPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function GridPreferencesPanel(props, ref) {
  const { className, ...other } = props;
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
      ref={ref}
      className={className}
      open={columns.length > 0 && preferencePanelState.open}
      {...baseProps}
      {...apiRef?.current.componentsProps?.panel}
      {...other}
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
});
