import * as React from 'react';
import Button from '@material-ui/core/Button';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { preferencePanelStateSelector } from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { ApiContext } from '../api-context';

export const ColumnsToolbarButton: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const ColumnSelectorIcon = apiRef!.current.components.ColumnSelectorIcon!;
  const { open, openedPanelValue } = useGridSelector(apiRef, preferencePanelStateSelector);

  const showColumns = React.useCallback(() => {
    if (open && openedPanelValue === PreferencePanelsValue.columns) {
      apiRef!.current.hidePreferences();
    } else {
      apiRef!.current.showPreferences(PreferencePanelsValue.columns);
    }
  }, [apiRef, open, openedPanelValue]);

  // Disable the button if the corresponding is disabled
  if (options.disableColumnSelector) {
    return null;
  }

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
