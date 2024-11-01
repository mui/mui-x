import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_capitalize as capitalize,
  unstable_useId as useId,
} from '@mui/utils';
import { TooltipProps } from '@mui/material/Tooltip';
import { ChipProps } from '@mui/material/Chip';
import { gridColumnLookupSelector } from '../../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridFilterActiveItemsSelector } from '../../../hooks/features/filter/gridFilterSelector';
import { gridPreferencePanelStateSelector } from '../../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { GridTranslationKeys } from '../../../models/api/gridLocaleTextApi';
import { GridFilterItem } from '../../../models/gridFilterItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { getDataGridUtilityClass } from '../../../constants/gridClasses';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarFilterList'],
    chip: ['toolbarChip'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridToolbarFilterListRoot = styled('ul', {
  name: 'MuiDataGrid',
  slot: 'ToolbarFilterList',
  overridesResolver: (_props, styles) => styles.toolbarFilterList,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(0, 1),
}));

const GridToolbarChip = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ToolbarChip',
  overridesResolver: (_props, styles) => styles.toolbarChip,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  margin: theme.spacing(0, 0.25),
}));

export interface GridToolbarFilterChipProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: { chip?: Partial<ChipProps>; tooltip?: Partial<TooltipProps> };
}

const GridToolbarFilterChip = React.forwardRef<HTMLDivElement, GridToolbarFilterChipProps>(
  function GridToolbarFilterChip(props, ref) {
    const { slotProps = {} } = props;
    const chipProps = slotProps.chip || {};
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
      );
    }, [apiRef, rootProps, activeFilters, lookup, classes]);

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
    if (rootProps.disableColumnFilter || activeFilters.length === 0) {
      return null;
    }

    return (
      <rootProps.slots.baseTooltip
        title={tooltipContentNode}
        enterDelay={1000}
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -10],
                },
              },
            ],
          },
        }}
        {...tooltipProps}
        {...rootProps.slotProps?.baseTooltip}
      >
        <GridToolbarChip
          ref={ref}
          ownerState={rootProps}
          className={classes.chip}
          label={apiRef.current.getLocaleText('toolbarFiltersTooltipActive')(activeFilters.length)}
          onClick={toggleFilter}
          onDelete={() => {
            apiRef.current.setFilterModel({
              items: [],
            });
          }}
          {...chipProps}
          {...rootProps.slotProps?.baseChip}
        />
      </rootProps.slots.baseTooltip>
    );
  },
);

GridToolbarFilterChip.propTypes = {
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

export { GridToolbarFilterChip };
