import { IconButton } from '@material-ui/core';
import * as React from 'react';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { useIcons } from '../../hooks/utils/useIcons';
import { ApiContext } from '../api-context';

export const ColumnsToolbarButton: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const icons = useIcons();
  const iconElement = React.createElement(icons.ColumnSelector!, {});

  const showColumns = React.useCallback(() => {
    apiRef!.current.showPreferences(PreferencePanelsValue.columns);
  }, [apiRef]);

  return (
    <IconButton onClick={showColumns} color="primary" aria-label="Show Column Selector">
      {iconElement}
    </IconButton>
  );
};
