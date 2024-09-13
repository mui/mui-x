import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { ToggleButtonProps } from '@mui/material/ToggleButton';
import { TooltipProps } from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridFilterActiveItemsSelector } from '../../hooks/features/filter/gridFilterSelector';

export interface GridToolbarFilterToggleButtonProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: { toggleButton?: Partial<ToggleButtonProps>; tooltip?: Partial<TooltipProps> };
}

const GridToolbarFilterToggleButton = React.forwardRef<
  HTMLButtonElement,
  GridToolbarFilterToggleButtonProps
>(function GridToolbarFilterToggleButton(props, ref) {
  const { slotProps = {} } = props;
  const toggleButtonProps = slotProps.toggleButton || {};
  const tooltipProps = slotProps.tooltip || {};
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);
  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
  const filterButtonId = useId();
  const filterPanelId = useId();

  const toggleFilter = () => {
    const { open, openedPanelValue } = preferencePanel;
    if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
      apiRef.current.hidePreferences();
    } else {
      apiRef.current.showPreferences(
        GridPreferencePanelsValue.filters,
        filterPanelId,
        filterButtonId,
      );
    }
  };

  // Disable the button if the corresponding is disabled
  if (rootProps.disableColumnFilter) {
    return null;
  }

  const isOpen = preferencePanel.open && preferencePanel.panelId === filterPanelId;
  return (
    <rootProps.slots.baseTooltip
      title={
        preferencePanel.open
          ? (apiRef.current.getLocaleText('toolbarFiltersTooltipHide') as React.ReactElement)
          : (apiRef.current.getLocaleText('toolbarFiltersTooltipShow') as React.ReactElement)
      }
      enterDelay={1000}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      }}
      {...tooltipProps}
      {...rootProps.slotProps?.baseTooltip}
    >
      <Badge badgeContent={activeFilters.length} color="primary" variant="dot" overlap="circular">
        <rootProps.slots.baseToggleButton
          ref={ref}
          id={filterButtonId}
          size="small"
          sx={{
            border: 0,
          }}
          aria-label={apiRef.current.getLocaleText('toolbarFiltersLabel')}
          aria-controls={isOpen ? filterPanelId : undefined}
          aria-expanded={isOpen}
          aria-haspopup
          value="filter"
          selected={isOpen}
          onChange={toggleFilter}
          {...rootProps.slotProps?.baseToggleButton}
          {...toggleButtonProps}
        >
          <rootProps.slots.openFilterButtonIcon fontSize="small" />
        </rootProps.slots.baseToggleButton>
      </Badge>
    </rootProps.slots.baseTooltip>
  );
});

GridToolbarFilterToggleButton.propTypes = {
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

export { GridToolbarFilterToggleButton };
