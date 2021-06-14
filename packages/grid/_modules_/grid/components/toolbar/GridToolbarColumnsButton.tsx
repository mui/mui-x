import * as React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';

export const GridToolbarColumnsButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function GridToolbarColumnsButton(props, ref) {
    const apiRef = useGridApiContext();
    const options = useGridSelector(apiRef, optionsSelector);
    const ColumnSelectorIcon = apiRef!.current.components.ColumnSelectorIcon!;
    const { open, openedPanelValue } = useGridSelector(apiRef, gridPreferencePanelStateSelector);

    const showColumns = React.useCallback(() => {
      if (open && openedPanelValue === GridPreferencePanelsValue.columns) {
        apiRef!.current.hidePreferences();
      } else {
        apiRef!.current.showPreferences(GridPreferencePanelsValue.columns);
      }
    }, [apiRef, open, openedPanelValue]);

    // Disable the button if the corresponding is disabled
    if (options.disableColumnSelector) {
      return null;
    }

    return (
      <Button
        ref={ref}
        onClick={showColumns}
        size="small"
        color="primary"
        aria-label={apiRef!.current.getLocaleText('toolbarColumnsLabel')}
        startIcon={<ColumnSelectorIcon />}
        {...props}
      >
        {apiRef!.current.getLocaleText('toolbarColumns')}
      </Button>
    );
  },
);
