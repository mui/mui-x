import * as React from 'react';
import { ButtonProps } from '@mui/material/Button';
import { useId } from 'react';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export const GridToolbarColumnsButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function GridToolbarColumnsButton(props, ref) {
    const { onClick, ...other } = props;
    const buttonId = useId();
    const panelId = useId();

    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);

    const showColumns = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (
        preferencePanel.open &&
        preferencePanel.openedPanelValue === GridPreferencePanelsValue.columns
      ) {
        apiRef.current.hidePreferences();
      } else {
        apiRef.current.showPreferences(GridPreferencePanelsValue.columns, { panelId, buttonId });
      }

      onClick?.(event);
    };

    // Disable the button if the corresponding is disabled
    if (rootProps.disableColumnSelector) {
      return null;
    }

    const isOpen = preferencePanel.open && preferencePanel.ids?.panelId === panelId;

    return (
      <rootProps.components.BaseButton
        ref={ref}
        id={buttonId}
        size="small"
        aria-label={apiRef.current.getLocaleText('toolbarColumnsLabel')}
        aria-controls={isOpen ? panelId : undefined}
        aria-expanded={isOpen}
        aria-haspopup
        startIcon={<rootProps.components.ColumnSelectorIcon />}
        {...other}
        onClick={showColumns}
        {...rootProps.componentsProps?.baseButton}
      >
        {apiRef.current.getLocaleText('toolbarColumns')}
      </rootProps.components.BaseButton>
    );
  },
);
