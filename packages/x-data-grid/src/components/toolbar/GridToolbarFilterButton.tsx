import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import capitalize from '@mui/utils/capitalize';
import useId from '@mui/utils/useId';
import useForkRef from '@mui/utils/useForkRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import type { GridSlotProps } from '../../models/gridSlotsComponentsProps';
import { vars } from '../../constants/cssVariables';
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
import { useGridPanelContext } from '../panel/GridPanelContext';

type OwnerState = Pick<DataGridProcessedProps, 'classes'>;

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
})({
  margin: vars.spacing(1, 1, 0.5),
  padding: vars.spacing(0, 1),
});

export interface GridToolbarFilterButtonProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: {
    button?: Partial<GridSlotProps['baseButton']>;
    tooltip?: Partial<GridSlotProps['baseTooltip']>;
    badge?: Partial<GridSlotProps['baseBadge']>;
  };
}

/**
 * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/filter-panel/ Filter Panel Trigger} component instead. This component will be removed in a future major release.
 */
const GridToolbarFilterButton = forwardRef<HTMLButtonElement, GridToolbarFilterButtonProps>(
  function GridToolbarFilterButton(props, ref) {
    const { slotProps = {} } = props;
    const buttonProps = slotProps.button || {};
    const tooltipProps = slotProps.tooltip || {};
    const badgeProps = slotProps.badge || {};
    const apiRef = useGridApiContext();
    const {
      classes: rootPropsClasses,
      disableColumnFilter,
      slots,
      slotProps: rootPropsSlotProps,
    } = useGridRootProps();
    const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
    const lookup = useGridSelector(apiRef, gridColumnLookupSelector);
    const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const classes = useUtilityClasses({ classes: rootPropsClasses });
    const filterButtonId = useId();
    const filterPanelId = useId();
    const { filterPanelTriggerRef } = useGridPanelContext();
    const handleRef = useForkRef(ref, filterPanelTriggerRef);

    const tooltipContentNode = React.useMemo(() => {
      if (preferencePanel.open) {
        return apiRef.current.getLocaleText('toolbarFiltersTooltipHide') as React.ReactElement<any>;
      }
      if (activeFilters.length === 0) {
        return apiRef.current.getLocaleText('toolbarFiltersTooltipShow') as React.ReactElement<any>;
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
          <GridToolbarFilterListRoot className={classes.root}>
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
    }, [apiRef, preferencePanel.open, activeFilters, lookup, classes]);

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
    if (disableColumnFilter) {
      return null;
    }

    const isOpen = preferencePanel.open && preferencePanel.panelId === filterPanelId;
    return (
      <slots.baseTooltip
        title={tooltipContentNode}
        enterDelay={1000}
        {...rootPropsSlotProps?.baseTooltip}
        {...tooltipProps}
      >
        <slots.baseButton
          id={filterButtonId}
          size="small"
          aria-label={apiRef.current.getLocaleText('toolbarFiltersLabel')}
          aria-controls={isOpen ? filterPanelId : undefined}
          aria-expanded={isOpen}
          aria-haspopup
          startIcon={
            <slots.baseBadge
              badgeContent={activeFilters.length}
              color="primary"
              {...rootPropsSlotProps?.baseBadge}
              {...badgeProps}
            >
              <slots.openFilterButtonIcon />
            </slots.baseBadge>
          }
          {...rootPropsSlotProps?.baseButton}
          {...buttonProps}
          onClick={toggleFilter}
          onPointerUp={(event) => {
            if (preferencePanel.open) {
              event.stopPropagation();
            }
            buttonProps.onPointerUp?.(event);
          }}
          ref={handleRef}
        >
          {apiRef.current.getLocaleText('toolbarFilters')}
        </slots.baseButton>
      </slots.baseTooltip>
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
