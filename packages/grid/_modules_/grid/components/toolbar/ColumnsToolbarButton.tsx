import * as React from 'react';
import Button from '@material-ui/core/Button';
import { GridState } from '../../hooks/features/core/gridState';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { useIcons } from '../../hooks/utils/useIcons';
import { ApiContext } from '../api-context';

export const ColumnsToolbarButton: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const icons = useIcons();
  const iconElement = React.createElement(icons.ColumnSelector!, {});

  const showColumns = React.useCallback(() => {
    const {open, openedPanelValue} = apiRef?.current.getState<GridState>().preferencePanel!;
    if(open && openedPanelValue ===  PreferencePanelsValue.columns) {
      apiRef!.current.hidePreferences();
    } else {
      apiRef!.current.showPreferences(PreferencePanelsValue.columns);
    }
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
