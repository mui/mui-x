import * as React from 'react';
import PropTypes from 'prop-types';
import {
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
  unstable_useId as useId,
} from '@mui/utils';
import Badge from '@mui/material/Badge';
import { ButtonProps } from '@mui/material/Button';
import { TooltipProps } from '@mui/material/Tooltip';
import { styled } from '../../utils/styled';
import { gridColumnLookupSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridFilterActiveItemsSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { GridTranslationKeys } from '../../models/api/gridLocaleTextApi';
import { GridFilterItem } from '../../models/gridFilterItem';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../constants/gridClasses';

type OwnerState = DataGridProcessedProps;

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
  overridesResolver: (_props, styles) => styles.toolbarFilterList,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  margin: theme.spacing(1, 1, 0.5),
  padding: theme.spacing(0, 1),
}));

export interface GridToolbarFilterButtonProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: { button?: Partial<ButtonProps>; tooltip?: Partial<TooltipProps> };
}

const GridToolbarFilterButton = React.forwardRef<HTMLButtonElement, GridToolbarFilterButtonProps>(
  function GridToolbarFilterButton(props, ref) {
    const { slotProps = {} } = props;
    const buttonProps = slotProps.button || {};
    const tooltipProps = slotProps.tooltip || {};
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
    const lookup = useGridSelector(apiRef, gridColumnLookupSelector);
    const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const classes = useUtilityClasses(rootProps);
    const filterButtonId = useId();
    const filterPanelId = useId();

    const tooltipContentNode = React.useMemo(() => {
      if (preferencePanel.open) {
        return apiRef.current.getLocaleText('toolbarFiltersTooltipHide') as React.ReactElement;
      }
      if (activeFilters.length === 0) {
        return apiRef.current.getLocaleText('toolbarFiltersTooltipShow') as React.ReactElement;
      }

      const getOperatorLabel = (item: GridFilterItem): string =>
        lookup[item.field!].filterOperators!.find((operator) => operator.value === item.operator)!
          .label ||
        apiRef.current
          .getLocaleText(`filterOperator${capitalize(item.operator!)}` as GridTranslationKeys)!
          .toString();

      const getFilterItemValue = (item: GridFilterItem): string => {
        const { getValueAsString } = lookup[item.field!].filterOperators!.find(
          (operator) => operator.value === item.operator,
        )!;

        return getValueAsString ? getValueAsString(item.value) : item.value;
      };

      return (
        <div>
          {apiRef.current.getLocaleText('toolbarFiltersTooltipActive')(activeFilters.length)}
          <GridToolbarFilterListRoot className={classes.root} ownerState={rootProps}>
            {activeFilters.map((item, index) => ({
              ...(lookup[item.field!] && (
                <li key={index}>
                  {`${lookup[item.field!].headerName || item.field}
                  ${getOperatorLabel(item)}
                  ${
                    // implicit check for null and undefined
                    item.value != null ? getFilterItemValue(item) : ''
                  }`}
                </li>
              )),
            }))}
          </GridToolbarFilterListRoot>
        </div>
      );
    }, [apiRef, rootProps, preferencePanel.open, activeFilters, lookup, classes]);

    const toggleFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
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
      buttonProps.onClick?.(event);
    };

    // Disable the button if the corresponding is disabled
    if (rootProps.disableColumnFilter) {
      return null;
    }

    const isOpen = preferencePanel.open && preferencePanel.panelId === filterPanelId;
    return (
      <rootProps.slots.baseTooltip
        title={tooltipContentNode}
        enterDelay={1000}
        {...tooltipProps}
        {...rootProps.slotProps?.baseTooltip}
      >
        <rootProps.slots.baseButton
          ref={ref}
          id={filterButtonId}
          size="small"
          aria-label={apiRef.current.getLocaleText('toolbarFiltersLabel')}
          aria-controls={isOpen ? filterPanelId : undefined}
          aria-expanded={isOpen}
          aria-haspopup
          startIcon={
            <Badge badgeContent={activeFilters.length} color="primary">
              <rootProps.slots.openFilterButtonIcon />
            </Badge>
          }
          {...buttonProps}
          onClick={toggleFilter}
          {...rootProps.slotProps?.baseButton}
        >
          {apiRef.current.getLocaleText('toolbarFilters')}
        </rootProps.slots.baseButton>
      </rootProps.slots.baseTooltip>
    );
  },
);

GridToolbarFilterButton.propTypes = {
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

export { GridToolbarFilterButton };
