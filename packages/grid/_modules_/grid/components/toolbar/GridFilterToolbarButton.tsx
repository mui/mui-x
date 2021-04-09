import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { capitalize } from '@material-ui/core/utils';
import * as React from 'react';
import { gridColumnLookupSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import {
  activeGridFilterItemsSelector,
  filterGridItemsCounterSelector,
} from '../../hooks/features/filter/gridFilterSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridTranslationKeys } from '../../models/api/gridLocaleTextApi';
import { GridApiContext } from '../GridApiContext';

const useStyles = makeStyles(
  (theme) => ({
    list: {
      margin: theme.spacing(1),
      padding: theme.spacing(0, 1),
    },
  }),
  { name: 'MuiDataGridFilterButtonTooltipList' },
);

export const GridFilterToolbarButton: React.FC<{}> = () => {
  const classes = useStyles();
  const apiRef = React.useContext(GridApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const counter = useGridSelector(apiRef, filterGridItemsCounterSelector);
  const activeFilters = useGridSelector(apiRef, activeGridFilterItemsSelector);
  const lookup = useGridSelector(apiRef, gridColumnLookupSelector);
  const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);

  const tooltipContentNode = React.useMemo(() => {
    if (preferencePanel.open) {
      return apiRef!.current.getLocaleText('toolbarFiltersTooltipHide') as React.ReactElement;
    }
    if (counter === 0) {
      return apiRef!.current.getLocaleText('toolbarFiltersTooltipShow') as React.ReactElement;
    }
    return (
      <div>
        {apiRef!.current.getLocaleText('toolbarFiltersTooltipActive')(counter)}
        <ul className={classes.list}>
          {activeFilters.map((item) => ({
            ...(lookup[item.columnField!] && (
              <li key={item.id}>
                {`${lookup[item.columnField!].headerName || item.columnField}
                ${apiRef!.current.getLocaleText(
                  `filterOperator${capitalize(item.operatorValue!)}` as GridTranslationKeys,
                )}
                ${item.value}`}
              </li>
            )),
          }))}
        </ul>
      </div>
    );
  }, [apiRef, preferencePanel.open, counter, activeFilters, lookup, classes]);

  const toggleFilter = React.useCallback(() => {
    const { open, openedPanelValue } = preferencePanel;
    if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
      apiRef!.current.hideFilterPanel();
    } else {
      apiRef!.current.showFilterPanel();
    }
  }, [apiRef, preferencePanel]);

  // Disable the button if the corresponding is disabled
  if (options.disableColumnFilter) {
    return null;
  }

  const OpenFilterButtonIcon = apiRef!.current.components!.OpenFilterButtonIcon!;
  return (
    <Tooltip title={tooltipContentNode} enterDelay={1000}>
      <Button
        onClick={toggleFilter}
        size="small"
        color="primary"
        aria-label={apiRef!.current.getLocaleText('toolbarFiltersLabel')}
        startIcon={
          <Badge badgeContent={counter} color="primary">
            <OpenFilterButtonIcon />
          </Badge>
        }
      >
        {apiRef!.current.getLocaleText('toolbarFilters')}
      </Button>
    </Tooltip>
  );
};
