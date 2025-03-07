import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/system';
import clsx from 'clsx';
// import { NotRendered } from '../../utils/assert';
import { GridSlotProps } from '../../models/gridSlotsComponent';
import { getDataGridUtilityClass } from '../../constants';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { TextFieldProps } from '../../models/gridBaseSlots';
import { GridFilterModel } from '../../models/gridFilterModel';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { QuickFilter, QuickFilterClear, QuickFilterControl } from '../quickFilter';
import { ToolbarButton } from '../toolbarV8';
import { QuickFilterTrigger } from '../quickFilter/QuickFilterTrigger';

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarQuickFilter'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

// TODO: Use NotRendered from /utils/assert
// Currently causes react-docgen to fail
const GridToolbarQuickFilterRoot = styled(
  (_props: GridSlotProps['baseTextField']) => {
    throw new Error('Failed assertion: should not be rendered');
  },
  {
    name: 'MuiDataGrid',
    slot: 'ToolbarQuickFilter',
  },
)({
  width: 260,
});

export type GridToolbarQuickFilterProps = {
  className?: string;
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   * @default (searchText: string) => searchText
   *   .split(' ')
   *   .filter((word) => word !== '')
   */
  quickFilterParser?: (input: string) => any[];
  /**
   * Function responsible for formatting values of quick filter in a string when the model is modified
   * @param {any[]} values The new values passed to the quick filter model
   * @returns {string} The string to display in the text field
   * @default (values: string[]) => values.join(' ')
   */
  quickFilterFormatter?: (values: NonNullable<GridFilterModel['quickFilterValues']>) => string;
  /**
   * The debounce time in milliseconds.
   * @default 150
   */
  debounceMs?: number;
  slotProps?: {
    root: TextFieldProps;
  };
};

function GridToolbarQuickFilter(props: GridToolbarQuickFilterProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  const { quickFilterParser, quickFilterFormatter, debounceMs, className, slotProps, ...other } =
    props;

  return (
    <QuickFilter
      parser={quickFilterParser}
      formatter={quickFilterFormatter}
      debounceMs={debounceMs}
    >
      <QuickFilterTrigger
        render={(triggerProps) => (
          <rootProps.slots.baseTooltip
            title={apiRef.current.getLocaleText('toolbarQuickFilterLabel')}
          >
            <ToolbarButton {...triggerProps} color="default">
              <rootProps.slots.quickFilterIcon fontSize="small" />
            </ToolbarButton>
          </rootProps.slots.baseTooltip>
        )}
      />

      <QuickFilterControl
        render={({ ref, slotProps: controlSlotProps, ...controlProps }) => (
          <GridToolbarQuickFilterRoot
            as={rootProps.slots.baseTextField}
            className={clsx(classes.root, className)}
            inputRef={ref}
            aria-label={apiRef.current.getLocaleText('toolbarQuickFilterLabel')}
            placeholder={apiRef.current.getLocaleText('toolbarQuickFilterPlaceholder')}
            size="small"
            slotProps={{
              input: {
                startAdornment: <rootProps.slots.quickFilterIcon fontSize="small" />,
                endAdornment: (
                  <QuickFilterClear
                    render={
                      <rootProps.slots.baseIconButton
                        size="small"
                        edge="end"
                        aria-label={apiRef.current.getLocaleText(
                          'toolbarQuickFilterDeleteIconLabel',
                        )}
                      >
                        <rootProps.slots.quickFilterClearIcon fontSize="small" />
                      </rootProps.slots.baseIconButton>
                    }
                  />
                ),
                ...controlSlotProps?.input,
              },
              ...controlSlotProps,
            }}
            {...rootProps.slotProps?.baseTextField}
            {...controlProps}
            {...slotProps?.root}
            {...other}
          />
        )}
      />
    </QuickFilter>
  );
}

GridToolbarQuickFilter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  /**
   * The debounce time in milliseconds.
   * @default 150
   */
  debounceMs: PropTypes.number,
  /**
   * Function responsible for formatting values of quick filter in a string when the model is modified
   * @param {any[]} values The new values passed to the quick filter model
   * @returns {string} The string to display in the text field
   * @default (values: string[]) => values.join(' ')
   */
  quickFilterFormatter: PropTypes.func,
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   * @default (searchText: string) => searchText
   *   .split(' ')
   *   .filter((word) => word !== '')
   */
  quickFilterParser: PropTypes.func,
  slotProps: PropTypes.object,
} as any;

/**
 * Demos:
 * - [Filtering - overview](https://mui.com/x/react-data-grid/filtering/)
 * - [Filtering - quick filter](https://mui.com/x/react-data-grid/filtering/quick-filter/)
 *
 * API:
 * - [GridToolbarQuickFilter API](https://mui.com/x/api/data-grid/grid-toolbar-quick-filter/)
 */
export { GridToolbarQuickFilter };
