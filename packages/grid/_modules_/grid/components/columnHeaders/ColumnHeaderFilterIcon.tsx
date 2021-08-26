import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { gridClasses } from '../../gridClasses';

export interface ColumnHeaderFilterIconProps {
  counter?: number;
}

export function ColumnHeaderFilterIcon(props: ColumnHeaderFilterIconProps) {
  const { counter } = props;
  const apiRef = useGridApiContext();

  const FilteredColumnIconElement = apiRef!.current.components.ColumnFilteredIcon!;

  const toggleFilter = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const { open, openedPanelValue } = gridPreferencePanelStateSelector(apiRef.current.state);

      if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
        apiRef.current.hideFilterPanel();
      } else {
        apiRef.current.showFilterPanel();
      }
    },
    [apiRef],
  );

  if (!counter) {
    return null;
  }

  const iconButton = (
    <IconButton
      onClick={toggleFilter}
      color="default"
      aria-label={apiRef.current.getLocaleText('columnHeaderFiltersLabel')}
      size="small"
      tabIndex={-1}
    >
      <FilteredColumnIconElement className={gridClasses.filterIcon} fontSize="small" />
    </IconButton>
  );

  return (
    <Tooltip
      title={
        apiRef.current.getLocaleText('columnHeaderFiltersTooltipActive')(
          counter,
        ) as React.ReactElement
      }
      enterDelay={1000}
    >
      <div className={gridClasses.iconButtonContainer}>
        {counter > 1 && (
          <Badge badgeContent={counter} color="default">
            {iconButton}
          </Badge>
        )}
        {counter === 1 && iconButton}
      </div>
    </Tooltip>
  );
}
