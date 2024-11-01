import * as React from 'react';
import PropTypes from 'prop-types';
import { ToggleButtonProps } from '@mui/material/ToggleButton';
import { TooltipProps } from '@mui/material/Tooltip';
import { unstable_useId as useId } from '@mui/material/utils';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridToolbarTooltip } from './GridToolbarTooltip';
import { GridToolbarToggleButton } from './GridToolbarToggleButton';

interface GridToolbarColumnsItemProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: { toggleButton?: Partial<ToggleButtonProps>; tooltip?: Partial<TooltipProps> };
}

const GridToolbarColumnsItem = React.forwardRef<HTMLButtonElement, GridToolbarColumnsItemProps>(
  function GridToolbarColumnsItem(props, ref) {
    const { slotProps = {} } = props;
    const toggleButtonProps = slotProps.toggleButton || {};
    const tooltipProps = slotProps.tooltip || {};
    const columnButtonId = useId();
    const columnPanelId = useId();

    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);

    const showColumns = () => {
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
    };

    // Disable the button if the corresponding is disabled
    if (rootProps.disableColumnSelector) {
      return null;
    }

    const isOpen = preferencePanel.open && preferencePanel.panelId === columnPanelId;

    return (
      <GridToolbarTooltip
        title={apiRef.current.getLocaleText('toolbarColumnsLabel')}
        {...tooltipProps}
      >
        <GridToolbarToggleButton
          ref={ref}
          id={columnButtonId}
          aria-label={apiRef.current.getLocaleText('toolbarColumnsLabel')}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={isOpen ? columnPanelId : undefined}
          value="columns"
          selected={isOpen}
          onChange={showColumns}
          {...toggleButtonProps}
        >
          <rootProps.slots.columnSelectorIcon fontSize="small" />
        </GridToolbarToggleButton>
      </GridToolbarTooltip>
    );
  },
);

GridToolbarColumnsItem.propTypes = {
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

export { GridToolbarColumnsItem };
