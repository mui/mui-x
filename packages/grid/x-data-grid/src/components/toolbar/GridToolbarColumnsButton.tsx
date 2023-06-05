import * as React from 'react';
import { ButtonProps } from '@mui/material/Button';
import { unstable_useId as useId } from '@mui/material/utils';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export const GridToolbarColumnsButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function GridToolbarColumnsButton(props, ref) {
    const { onClick, ...other } = props;
    const columnButtonId = useId();
    const columnPanelId = useId();

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
        apiRef.current.showPreferences(
          GridPreferencePanelsValue.columns,
          columnPanelId,
          columnButtonId,
        );
      }

      onClick?.(event);
    };

    // Disable the button if the corresponding is disabled
    if (rootProps.disableColumnSelector) {
      return null;
    }

    const isOpen = preferencePanel.open && preferencePanel.panelId === columnPanelId;

    return (
      <rootProps.slots.baseButton
        ref={ref}
        id={columnButtonId}
        size="small"
        aria-label={apiRef.current.getLocaleText('toolbarColumnsLabel')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? columnPanelId : undefined}
        startIcon={<rootProps.slots.columnSelectorIcon />}
        {...other}
        onClick={showColumns}
        {...rootProps.slotProps?.baseButton}
      >
        {apiRef.current.getLocaleText('toolbarColumns')}
      </rootProps.slots.baseButton>
    );
  },
);
