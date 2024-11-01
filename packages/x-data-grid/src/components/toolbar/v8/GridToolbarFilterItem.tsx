import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { ToggleButtonProps } from '@mui/material/ToggleButton';
import { TooltipProps } from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { gridFilterActiveItemsSelector } from '../../../hooks/features/filter/gridFilterSelector';
import { GridToolbarToggleButton } from './GridToolbarToggleButton';
import { GridToolbarTooltip } from './GridToolbarTooltip';

export interface GridToolbarFilterItemProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: { toggleButton?: Partial<ToggleButtonProps>; tooltip?: Partial<TooltipProps> };
}

const GridToolbarFilterItem = React.forwardRef<HTMLButtonElement, GridToolbarFilterItemProps>(
  function GridToolbarFilterItem(props, ref) {
    const { slotProps = {} } = props;
    const toggleButtonProps = slotProps.toggleButton || {};
    const tooltipProps = slotProps.tooltip || {};
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
    const filterButtonId = useId();
    const filterPanelId = useId();

    const filterCount = activeFilters.length;
    const hasFilters = filterCount > 0;

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
      <GridToolbarTooltip
        title={
          preferencePanel.open
            ? (apiRef.current.getLocaleText('toolbarFiltersTooltipHide') as React.ReactElement)
            : (apiRef.current.getLocaleText('toolbarFiltersTooltipShow') as React.ReactElement)
        }
        {...tooltipProps}
      >
        <Badge badgeContent={filterCount} color="primary" variant="dot" overlap="circular">
          <GridToolbarToggleButton
            ref={ref}
            id={filterButtonId}
            aria-label={apiRef.current.getLocaleText('toolbarFiltersLabel')}
            aria-controls={isOpen ? filterPanelId : undefined}
            aria-expanded={isOpen}
            aria-haspopup
            value="filter"
            selected={isOpen}
            color={hasFilters ? 'primary' : undefined}
            onChange={toggleFilter}
            {...toggleButtonProps}
          >
            <rootProps.slots.openFilterButtonIcon
              fontSize="small"
              color={hasFilters ? 'primary' : undefined}
            />
          </GridToolbarToggleButton>
        </Badge>
      </GridToolbarTooltip>
    );
  },
);

GridToolbarFilterItem.propTypes = {
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

export { GridToolbarFilterItem };
