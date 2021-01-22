import * as React from 'react';
import Button from '@material-ui/core/Button';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { preferencePanelStateSelector } from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { ApiContext } from '../api-context';

export const ColumnsToolbarButton: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const ColumnSelectorIcon = apiRef!.current.components.ColumnSelectorIcon!;
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
      size="small"
      color="primary"
      aria-label={apiRef!.current.getLocaleText('toolbarColumnsLabel')}
      startIcon={<ColumnSelectorIcon />}
    >
      {apiRef!.current.getLocaleText('toolbarColumns')}
    </Button>
  );
};
