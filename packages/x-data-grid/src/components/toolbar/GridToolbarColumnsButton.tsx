import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { ButtonProps } from '@mui/material/Button';
import { TooltipProps } from '@mui/material/Tooltip';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridToolbarColumnsButtonProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: { button?: Partial<ButtonProps>; tooltip?: Partial<TooltipProps> };
}

const GridToolbarColumnsButton = forwardRef<HTMLButtonElement, GridToolbarColumnsButtonProps>(
  function GridToolbarColumnsButton(props, ref) {
    const { slotProps = {} } = props;
    const buttonProps = slotProps.button || {};
    const tooltipProps = slotProps.tooltip || {};
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

      buttonProps.onClick?.(event);
    };

    // Disable the button if the corresponding is disabled
    if (rootProps.disableColumnSelector) {
      return null;
    }

    const isOpen = preferencePanel.open && preferencePanel.panelId === columnPanelId;

    return (
      <rootProps.slots.baseTooltip
        title={apiRef.current.getLocaleText('toolbarColumnsLabel')}
        enterDelay={1000}
        {...rootProps.slotProps?.baseTooltip}
        {...tooltipProps}
      >
        <rootProps.slots.baseButton
          id={columnButtonId}
          size="small"
          aria-label={apiRef.current.getLocaleText('toolbarColumnsLabel')}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={isOpen ? columnPanelId : undefined}
          startIcon={<rootProps.slots.columnSelectorIcon />}
          onClick={showColumns}
          {...rootProps.slotProps?.baseButton}
          {...buttonProps}
          ref={ref}
        >
          {apiRef.current.getLocaleText('toolbarColumns')}
        </rootProps.slots.baseButton>
      </rootProps.slots.baseTooltip>
    );
  },
);

GridToolbarColumnsButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: PropTypes.object,
} as any;

export { GridToolbarColumnsButton };
