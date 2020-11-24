import { IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
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
