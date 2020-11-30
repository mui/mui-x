import * as React from 'react';
import { allColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { preferencePanelStateSelector } from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { ApiRef } from '../../models/api/apiRef';
import { ColumnsPanel } from './ColumnsPanel';
import { FilterPanel } from './FilterPanel';
import { Panel } from './Panel';

interface PreferencesPanelProps {
  apiRef?: ApiRef;
}

export function PreferencesPanel(props: PreferencesPanelProps) {
  const { apiRef } = props;
  const columns = useGridSelector(apiRef, allColumnsSelector);
  const options = useGridSelector(apiRef, optionsSelector);
  const preferencePanelState = useGridSelector(apiRef, preferencePanelStateSelector);

  const isColumnsTabOpen = preferencePanelState.openedPanelValue === PreferencePanelsValue.columns;
  const isFiltersTabOpen = !preferencePanelState.openedPanelValue || !isColumnsTabOpen;

  return (
    <Panel open={columns.length > 0 && preferencePanelState.open}>
      {/* apiRef deopt for plugin-transform-react-constant-elements */}
      {!options.disableColumnSelector && isColumnsTabOpen && <ColumnsPanel apiRef={apiRef} />}
      {/* apiRef deopt for plugin-transform-react-constant-elements */}
      {!options.disableColumnFilter && isFiltersTabOpen && <FilterPanel apiRef={apiRef} />}
    </Panel>
  );
}
