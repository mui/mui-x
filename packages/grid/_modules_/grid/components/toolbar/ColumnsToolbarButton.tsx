import * as React from 'react';
import Button from '@material-ui/core/Button';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { preferencePanelStateSelector } from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { useIcons } from '../../hooks/utils/useIcons';
import { ApiContext } from '../api-context';

export const ColumnsToolbarButton: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const icons = useIcons();
  const iconElement = React.createElement(icons.ColumnSelector!, {});
  const { open, openedPanelValue } = useGridSelector(apiRef, preferencePanelStateSelector);

  const showColumns = React.useCallback(() => {
    if (open && openedPanelValue === PreferencePanelsValue.columns) {
      apiRef!.current.hidePreferences();
    } else {
      apiRef!.current.showPreferences(PreferencePanelsValue.columns);
    }
  }, [apiRef, open, openedPanelValue]);

  return (
    <Button
      onClick={showColumns}
      color="primary"
      aria-label="Show Column Selector"
      startIcon={iconElement}
    >
      Columns
    </Button>
  );
};
