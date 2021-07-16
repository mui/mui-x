import * as React from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import Badge from '@material-ui/core/Badge';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import { capitalize } from '@material-ui/core/utils';
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
import { GridFilterItem } from '../../models/gridFilterItem';
import { createTheme } from '../../utils/utils';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: Theme) => ({
    list: {
      margin: theme.spacing(1, 1, 0.5),
      padding: theme.spacing(0, 1),
    },
  }),
  { name: 'MuiGridToolbarFilterButton', defaultTheme },
);

export interface GridToolbarFilterButtonProps extends Omit<TooltipProps, 'title' | 'children'> {
  /**
   * The props used for each slot inside.
   */
  componentProps?: {
    button?: ButtonProps;
  };
}

export const GridToolbarFilterButton = React.forwardRef<
  HTMLButtonElement,
  GridToolbarFilterButtonProps
>(function GridToolbarFilterButton(props, ref) {
  const { componentProps = {}, ...other } = props;
  const { onClick: onButtonClick, ...buttonProps } = componentProps.button ?? {};
  const classes = useStyles();
  const apiRef = useGridApiContext();
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

    const getOperatorLabel = (item: GridFilterItem): string =>
      lookup[item.columnField!].filterOperators!.find(
        (operator) => operator.value === item.operatorValue,
      )!.label ||
      apiRef!
        .current!.getLocaleText(
          `filterOperator${capitalize(item.operatorValue!)}` as GridTranslationKeys,
        )!
        .toString();

    return (
      <div>
        {apiRef!.current.getLocaleText('toolbarFiltersTooltipActive')(counter)}
        <ul className={classes.list}>
          {activeFilters.map((item) => ({
            ...(lookup[item.columnField!] && (
              <li key={item.id}>
                {`${lookup[item.columnField!].headerName || item.columnField}
                  ${getOperatorLabel(item)}
                  ${item.value}`}
              </li>
            )),
          }))}
        </ul>
      </div>
    );
  }, [apiRef, preferencePanel.open, counter, activeFilters, lookup, classes]);

  const toggleFilter = React.useCallback(
    (event) => {
      const { open, openedPanelValue } = preferencePanel;
      if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
        apiRef!.current.hideFilterPanel();
      } else {
        apiRef!.current.showFilterPanel();
      }
      onButtonClick?.(event);
    },
    [apiRef, preferencePanel, onButtonClick],
  );

  // Disable the button if the corresponding is disabled
  if (options.disableColumnFilter) {
    return null;
  }

  const OpenFilterButtonIcon = apiRef!.current.components!.OpenFilterButtonIcon!;
  return (
    <Tooltip title={tooltipContentNode} enterDelay={1000} {...other}>
      <Button
        ref={ref}
        size="small"
        color="primary"
        aria-label={apiRef!.current.getLocaleText('toolbarFiltersLabel')}
        startIcon={
          <Badge badgeContent={counter} color="primary">
            <OpenFilterButtonIcon />
          </Badge>
        }
        onClick={toggleFilter}
        {...buttonProps}
      >
        {apiRef!.current.getLocaleText('toolbarFilters')}
      </Button>
    </Tooltip>
  );
});
