import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { GridEvents } from '../../constants/eventsConstants';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridTabIndexColumnHeaderSelector } from '../../hooks/features/focus/gridFocusStateSelector';
import { gridSelectionStateSelector } from '../../hooks/features/selection/gridSelectionSelector';
import { GridColumnHeaderParams } from '../../models/params/gridColumnHeaderParams';
import { isNavigationKey, isSpaceKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';
import { GridHeaderSelectionCheckboxParams } from '../../models/params/gridHeaderSelectionCheckboxParams';
import { gridVisibleSortedRowIdsSelector } from '../../hooks/features/filter/gridFilterSelector';
import { gridPaginatedVisibleSortedGridRowIdsSelector } from '../../hooks/features/pagination/gridPaginationSelector';

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['checkboxInput'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridHeaderCheckbox = React.forwardRef<HTMLInputElement, GridColumnHeaderParams>(
  function GridHeaderCheckbox(props, ref) {
    const [, forceUpdate] = React.useState(false);
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
    const tabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
    const selection = useGridSelector(apiRef, gridSelectionStateSelector);
    const visibleRowIds = useGridSelector(apiRef, gridVisibleSortedRowIdsSelector);
    const paginatedVisibleRowIds = useGridSelector(
      apiRef,
      gridPaginatedVisibleSortedGridRowIdsSelector,
    );

    const filteredSelection = React.useMemo(
      () =>
        typeof rootProps.isRowSelectable === 'function'
          ? selection.filter((id) => rootProps.isRowSelectable!(apiRef.current.getRowParams(id)))
          : selection,
      [apiRef, rootProps.isRowSelectable, selection],
    );

    // All the rows that could be selected / unselected by toggling this checkbox
    const selectionCandidates = React.useMemo(() => {
      const rowIds =
        !rootProps.pagination || !rootProps.checkboxSelectionVisibleOnly
          ? visibleRowIds
          : paginatedVisibleRowIds;

      // Convert to an object to make O(1) checking if a row exists or not
      // TODO create selector that returns visibleRowIds/paginatedVisibleRowIds as an object
      return rowIds.reduce((acc, id) => {
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

      apiRef.current.publishEvent(GridEvents.headerSelectionCheckboxChange, params);
    };

    const tabIndex = tabIndexState !== null && tabIndexState.field === props.field ? 0 : -1;
    React.useLayoutEffect(() => {
      const element = apiRef.current.getColumnHeaderElement(props.field);
      if (tabIndex === 0 && element) {
        element!.tabIndex = -1;
      }
    }, [tabIndex, apiRef, props.field]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (isSpaceKey(event.key)) {
          event.stopPropagation();
        }
        if (isNavigationKey(event.key) && !event.shiftKey) {
          apiRef.current.publishEvent(GridEvents.columnHeaderNavigationKeyDown, props, event);
        }
      },
      [apiRef, props],
    );

    const handleSelectionChange = React.useCallback(() => {
      forceUpdate((p) => !p);
    }, []);

    React.useEffect(() => {
      return apiRef.current.subscribeEvent(GridEvents.selectionChange, handleSelectionChange);
    }, [apiRef, handleSelectionChange]);

    return (
      <rootProps.components.BaseCheckbox
        ref={ref}
        indeterminate={isIndeterminate}
        checked={isChecked}
        onChange={handleChange}
        className={classes.root}
        color="primary"
        inputProps={{ 'aria-label': 'Select All Rows checkbox' }}
        tabIndex={tabIndex}
        onKeyDown={handleKeyDown}
        {...rootProps.componentsProps?.baseCheckbox}
      />
    );
  },
);

GridHeaderCheckbox.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
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
