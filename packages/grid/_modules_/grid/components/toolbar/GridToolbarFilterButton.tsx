import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import Badge from '@mui/material/Badge';
import Button, { ButtonProps } from '@mui/material/Button';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import { capitalize } from '@mui/material/utils';
import { gridColumnLookupSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridFilterActiveItemsSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { GridTranslationKeys } from '../../models/api/gridLocaleTextApi';
import { GridFilterItem } from '../../models/gridFilterItem';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';
import { getDataGridUtilityClass } from '../../gridClasses';

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarFilterList'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridToolbarFilterListRoot = styled('ul', {
  name: 'MuiDataGrid',
  slot: 'ToolbarFilterList',
})(({ theme }) => ({
  margin: theme.spacing(1, 1, 0.5),
  padding: theme.spacing(0, 1),
}));

export interface GridToolbarFilterButtonProps
  extends Omit<TooltipProps, 'title' | 'children' | 'componentsProps'> {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  componentsProps?: { button?: ButtonProps };
}

const GridToolbarFilterButton = React.forwardRef<HTMLButtonElement, GridToolbarFilterButtonProps>(
  function GridToolbarFilterButton(props, ref) {
    const { componentsProps = {}, ...other } = props;
    const buttonProps = componentsProps.button || {};
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
    const lookup = useGridSelector(apiRef, gridColumnLookupSelector);
    const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);

    const tooltipContentNode = React.useMemo(() => {
      if (preferencePanel.open) {
        return apiRef.current.getLocaleText('toolbarFiltersTooltipHide') as React.ReactElement;
      }
      if (activeFilters.length === 0) {
        return apiRef.current.getLocaleText('toolbarFiltersTooltipShow') as React.ReactElement;
      }

      const getOperatorLabel = (item: GridFilterItem): string =>
        lookup[item.columnField!].filterOperators!.find(
          (operator) => operator.value === item.operatorValue,
        )!.label ||
        apiRef.current
          .getLocaleText(`filterOperator${capitalize(item.operatorValue!)}` as GridTranslationKeys)!
          .toString();

      return (
        <div>
          {apiRef.current.getLocaleText('toolbarFiltersTooltipActive')(activeFilters.length)}
          <GridToolbarFilterListRoot className={classes.root}>
            {activeFilters.map((item, index) => ({
              ...(lookup[item.columnField!] && (
                <li key={index}>
                  {`${lookup[item.columnField!].headerName || item.columnField}
                  ${getOperatorLabel(item)}
                  ${item.value}`}
                </li>
              )),
            }))}
          </GridToolbarFilterListRoot>
        </div>
      );
    }, [apiRef, preferencePanel.open, activeFilters, lookup, classes]);

    const toggleFilter = (event) => {
      const { open, openedPanelValue } = preferencePanel;
      if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
        apiRef.current.hideFilterPanel();
      } else {
        apiRef.current.showFilterPanel();
      }
      buttonProps.onClick?.(event);
    };

    // Disable the button if the corresponding is disabled
    if (rootProps.disableColumnFilter) {
      return null;
    }

    return (
      <Tooltip title={tooltipContentNode} enterDelay={1000} {...other}>
        <Button
          ref={ref}
          size="small"
          color="primary"
          aria-label={apiRef.current.getLocaleText('toolbarFiltersLabel')}
          startIcon={
            <Badge badgeContent={activeFilters.length} color="primary">
              <rootProps.components.OpenFilterButtonIcon />
            </Badge>
          }
          {...buttonProps}
          onClick={toggleFilter}
        >
          {apiRef.current.getLocaleText('toolbarFilters')}
        </Button>
      </Tooltip>
    );
  },
);

GridToolbarFilterButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The props used for each slot inside.
   * @default {}
   */
  componentsProps: PropTypes.object,
} as any;

export { GridToolbarFilterButton };
