import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import Box from '@mui/material/Box';
import {
  getDataGridUtilityClass,
  useGridSelector,
  useGridRootProps,
  gridDataSourceLoadingIdSelector,
  gridDataSourceErrorSelector,
  useGridApiContext,
  gridRowsLookupSelector,
} from '@mui/x-data-grid-pro';
import {
  useGridPrivateApiContext,
  createSelector,
} from '@mui/x-data-grid-pro/internals';
import useEventCallback from '@mui/utils/useEventCallback';
import CircularProgress from '@mui/material/CircularProgress';

const gridRowSelector = createSelector(
  gridRowsLookupSelector,
  (lookup, id) => lookup[id],
);

const useUtilityClasses = (ownerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle'],
    loadingContainer: ['treeDataGroupingCellLoadingContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridTreeDataGroupingCellIcon(props) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses({ classes: rootProps.classes });
  const { rowNode, id, field, descendantCount, row, nestedLevelRef } = props;

  const isDataLoading = useGridSelector(apiRef, gridDataSourceLoadingIdSelector, id);
  const error = useGridSelector(apiRef, gridDataSourceErrorSelector, id);

  const expanded = rowNode.childrenExpanded || row.expanded;

  const handleClick = useEventCallback((event) => {
    apiRef.current?.setRows([]);
    if (!expanded) {
      props.setExpandedRows((prev) => [
        ...prev,
        {
          ...row,
          groupingKey: rowNode.groupingKey,
          expanded: true,
          depth: nestedLevelRef.current,
        },
      ]);
      if (apiRef.current.state.pagination.paginationModel.page > 0) {
        apiRef.current.setPage(0);
      }
    } else if (row.expanded) {
      props.setExpandedRows((prev) => {
        const index = prev.findIndex((r) => r.id === id);
        return prev.slice(0, index);
      });
      if (apiRef.current.state.pagination.paginationModel.page > 0) {
        apiRef.current.setPage(0);
      }
    } else {
      apiRef.current.setRowChildrenExpansion(id, !expanded);
    }
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation(); // TODO remove event.stopPropagation
  });

  const Icon = expanded
    ? rootProps.slots.treeDataCollapseIcon
    : rootProps.slots.treeDataExpandIcon;

  if (isDataLoading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress size="1rem" color="inherit" />
      </div>
    );
  }
  return descendantCount > 0 ? (
    <rootProps.slots.baseIconButton
      size="small"
      onClick={handleClick}
      tabIndex={-1}
      aria-label={
        rowNode.childrenExpanded
          ? apiRef.current.getLocaleText('treeDataCollapse')
          : apiRef.current.getLocaleText('treeDataExpand')
      }
      {...rootProps?.slotProps?.baseIconButton}
    >
      <rootProps.slots.baseTooltip title={error?.message ?? null}>
        <rootProps.slots.baseBadge variant="dot" color="error" invisible={!error}>
          <Icon fontSize="inherit" />
        </rootProps.slots.baseBadge>
      </rootProps.slots.baseTooltip>
    </rootProps.slots.baseIconButton>
  ) : null;
}

export function NestedPaginationGroupingCell(props) {
  const {
    id,
    field,
    formattedValue,
    rowNode,
    hideDescendantCount,
    offsetMultiplier = 2,
    setExpandedRows,
    nestedLevelRef,
  } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridPrivateApiContext();
  const row = useGridSelector(apiRef, gridRowSelector, id);
  const classes = useUtilityClasses(rootProps);

  let descendantCount = 0;
  if (row) {
    descendantCount = Math.max(
      rootProps.dataSource?.getChildrenCount?.(row) ?? 0,
      0,
    );
  }

  let depth = row.depth ? row.depth : rowNode.depth;
  if (!row.expanded && nestedLevelRef.current > 0) {
    depth = nestedLevelRef.current;
  }

  return (
    <Box className={classes.root} sx={{ ml: depth * offsetMultiplier }}>
      <div className={classes.toggle}>
        <GridTreeDataGroupingCellIcon
          id={id}
          field={field}
          rowNode={rowNode}
          row={row}
          setExpandedRows={setExpandedRows}
          nestedLevelRef={nestedLevelRef}
          descendantCount={descendantCount}
        />
      </div>
      <span>
        {formattedValue === undefined
          ? (rowNode.groupingKey ?? row.groupingKey)
          : formattedValue}
        {!hideDescendantCount && descendantCount > 0 ? ` (${descendantCount})` : ''}
      </span>
    </Box>
  );
}
