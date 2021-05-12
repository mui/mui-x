import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridApiContext } from '../GridApiContext';

export interface ColumnHeaderFilterIconProps {
  counter?: number;
}

export function ColumnHeaderFilterIcon(props: ColumnHeaderFilterIconProps) {
  const { counter } = props;
  const apiRef = React.useContext(GridApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);

  const FilteredColumnIconElement = apiRef!.current.components.ColumnFilteredIcon!;

  const toggleFilter = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const { open, openedPanelValue } = preferencePanel;
      if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
        apiRef!.current.hideFilterPanel();
      } else {
        apiRef!.current.showFilterPanel();
      }
    },
    [apiRef, preferencePanel],
  );

  if (!counter || options.disableColumnFilter) {
    return null;
  }

  const iconButton = (
    <IconButton
      onClick={toggleFilter}
      color="default"
      aria-label={apiRef!.current.getLocaleText('columnHeaderFiltersLabel')}
      size="small"
      tabIndex={-1}
    >
      <FilteredColumnIconElement className="MuiDataGrid-filterIcon" fontSize="small" />
    </IconButton>
  );

  return (
    <Tooltip
      title={
        apiRef!.current.getLocaleText('columnHeaderFiltersTooltipActive')(
          counter,
        ) as React.ReactElement
      }
      enterDelay={1000}
    >
      <div className="MuiDataGrid-iconButtonContainer">
        <div>
          {counter > 1 && (
            <Badge badgeContent={counter} color="default">
              {iconButton}
            </Badge>
          )}
          {counter === 1 && iconButton}
        </div>
      </div>
    </Tooltip>
  );
}
