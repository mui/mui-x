import composeClasses from '@mui/utils/composeClasses';
import PropTypes from 'prop-types';
import * as React from 'react';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { gridExpandedSortedRowIdsSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridTabIndexColumnHeaderSelector } from '../../hooks/features/focus/gridFocusStateSelector';
import { gridPaginatedVisibleSortedGridRowIdsSelector } from '../../hooks/features/pagination/gridPaginationSelector';
import { gridRowSelectionStateSelector } from '../../hooks/features/rowSelection/gridRowSelectionSelector';
import { isMultipleRowSelectionEnabled } from '../../hooks/features/rowSelection/utils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import type { GridRowId } from '../../models/gridRows';
import type { GridColumnHeaderParams } from '../../models/params/gridColumnHeaderParams';
import type { GridHeaderSelectionCheckboxParams } from '../../models/params/gridHeaderSelectionCheckboxParams';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['checkboxInput'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridHeaderCheckbox = React.forwardRef<HTMLButtonElement, GridColumnHeaderParams>(
  function GridHeaderCheckbox(props, ref) {
    const { field, colDef, ...other } = props;
    const [, forceUpdate] = React.useState(false);
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
    const selection = useGridSelector(apiRef, gridRowSelectionStateSelector);
    const visibleRowIds = useGridSelector(apiRef, gridExpandedSortedRowIdsSelector);
    const paginatedVisibleRowIds = useGridSelector(
      apiRef,
      gridPaginatedVisibleSortedGridRowIdsSelector,
    );

    const filteredSelection = React.useMemo(() => {
      if (typeof rootProps.isRowSelectable !== 'function') {
        return selection;
      }

      return selection.filter((id) => {
        // The row might have been deleted
        if (!apiRef.current.getRow(id)) {
          return false;
        }

        return rootProps.isRowSelectable!(apiRef.current.getRowParams(id));
      });
    }, [apiRef, rootProps.isRowSelectable, selection]);

    // All the rows that could be selected / unselected by toggling this checkbox
    const selectionCandidates = React.useMemo(() => {
      const rowIds =
        !rootProps.pagination || !rootProps.checkboxSelectionVisibleOnly
          ? visibleRowIds
          : paginatedVisibleRowIds;

      // Convert to an object to make O(1) checking if a row exists or not
      // TODO create selector that returns visibleRowIds/paginatedVisibleRowIds as an object
      return rowIds.reduce<Record<GridRowId, true>>((acc, id) => {
        acc[id] = true;
        return acc;
      }, {});
    }, [
      rootProps.pagination,
      rootProps.checkboxSelectionVisibleOnly,
      paginatedVisibleRowIds,
      visibleRowIds,
    ]);

    // Amount of rows selected and that are visible in the current page
    const currentSelectionSize = React.useMemo(
      () => filteredSelection.filter((id) => selectionCandidates[id]).length,
      [filteredSelection, selectionCandidates],
    );

    const isIndeterminate =
      currentSelectionSize > 0 && currentSelectionSize < Object.keys(selectionCandidates).length;

    const isChecked = currentSelectionSize > 0;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const params: GridHeaderSelectionCheckboxParams = {
        value: event.target.checked,
      };

      apiRef.current.publishEvent('headerSelectionCheckboxChange', params);
    };

    const tabIndex = tabIndexState !== null && tabIndexState.field === props.field ? 0 : -1;
    React.useLayoutEffect(() => {
      const element = apiRef.current.getColumnHeaderElement(props.field);
      if (tabIndex === 0 && element) {
        element!.tabIndex = -1;
      }
    }, [tabIndex, apiRef, props.field]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === ' ') {
          // imperative toggle the checkbox because Space is disable by some preventDefault
          apiRef.current.publishEvent('headerSelectionCheckboxChange', {
            value: !isChecked,
          });
        }
      },
      [apiRef, isChecked],
    );

    const handleSelectionChange = React.useCallback(() => {
      forceUpdate((p) => !p);
    }, []);

    React.useEffect(() => {
      return apiRef.current.subscribeEvent('rowSelectionChange', handleSelectionChange);
    }, [apiRef, handleSelectionChange]);

    const label = apiRef.current.getLocaleText(
      isChecked ? 'checkboxSelectionUnselectAllRows' : 'checkboxSelectionSelectAllRows',
    );

    const checked =
      rootProps.indeterminateCheckboxAction === 'select'
        ? isChecked && !isIndeterminate
        : isChecked;

    return (
      <rootProps.slots.baseCheckbox
        ref={ref}
        indeterminate={isIndeterminate}
        checked={checked}
        onChange={handleChange}
        className={classes.root}
        inputProps={{ 'aria-label': label }}
        tabIndex={tabIndex}
        onKeyDown={handleKeyDown}
        disabled={!isMultipleRowSelectionEnabled(rootProps)}
        id={'checkbox_header'}
        {...rootProps.slotProps?.baseCheckbox}
        {...other}
      />
    );
  },
);

GridHeaderCheckbox.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The column of the current header component.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The column field of the column that triggered the event
   */
  field: PropTypes.string.isRequired,
} as any;

export { GridHeaderCheckbox };
