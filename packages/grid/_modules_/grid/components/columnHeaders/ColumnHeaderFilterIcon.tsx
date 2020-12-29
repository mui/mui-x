import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { preferencePanelStateSelector } from '../../hooks/features/preferencesPanel/preferencePanelSelector';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { useIcons } from '../../hooks/utils/useIcons';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { ApiContext } from '../api-context';

export interface ColumnHeaderFilterIconProps {
  counter?: number;
}

export function ColumnHeaderFilterIcon(props: ColumnHeaderFilterIconProps) {
  const { counter } = props;
  const apiRef = React.useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const preferencePanel = useGridSelector(apiRef, preferencePanelStateSelector);

  const icons = useIcons();
  const filteredColumnIconElement = React.createElement(icons.ColumnFiltered!, {
    fontSize: 'small',
  });
  const toggleFilter = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const { open, openedPanelValue } = preferencePanel;
      if (open && openedPanelValue === PreferencePanelsValue.filters) {
        apiRef!.current.hideFilterPanel();
      } else {
        apiRef!.current.showFilterPanel();
      }
    },
    [apiRef, preferencePanel],
  );

  if (!counter || options.disableColumnFilter || options.showToolbar) {
    return null;
  }

  const iconButton = (
    <IconButton
      onClick={toggleFilter}
      color="default"
      aria-label={apiRef!.current.getLocaleText('columnHeaderFiltersLabel')}
      size="small"
    >
      {filteredColumnIconElement}
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
