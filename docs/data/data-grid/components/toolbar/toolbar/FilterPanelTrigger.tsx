import * as React from 'react';
import { unstable_useId as useId } from '@mui/utils';
import {
  Grid,
  GridPreferencePanelsValue,
  gridFilterActiveItemsSelector,
  gridPreferencePanelStateSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';

export const FilterPanelTrigger = React.forwardRef<HTMLButtonElement>(
  function FilterPanelTrigger(props, ref) {
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const { open, openedPanelValue } = useGridSelector(
      apiRef,
      gridPreferencePanelStateSelector,
    );
    const isOpen = open && openedPanelValue === GridPreferencePanelsValue.filters;
    const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
    const filterCount = activeFilters.length;
    const hasFilters = filterCount > 0;

    const toggleFilterPanel = () => {
      if (isOpen) {
        apiRef.current.hidePreferences();
      } else {
        apiRef.current.showPreferences(
          GridPreferencePanelsValue.filters,
          panelId,
          buttonId,
        );
      }
    };

    return (
      <Tooltip title="Filters">
        <Badge
          badgeContent={filterCount}
          color="primary"
          variant="dot"
          overlap="circular"
        >
          <Grid.Toolbar.Button
            ref={ref}
            id={buttonId}
            aria-haspopup="true"
            aria-expanded={isOpen ? 'true' : undefined}
            aria-controls={isOpen ? panelId : undefined}
            color={hasFilters ? 'primary' : undefined}
            onClick={toggleFilterPanel}
          >
            <FilterListIcon
              fontSize="small"
              color={hasFilters ? 'primary' : undefined}
            />
          </Grid.Toolbar.Button>
        </Badge>
      </Tooltip>
    );
  },
);
