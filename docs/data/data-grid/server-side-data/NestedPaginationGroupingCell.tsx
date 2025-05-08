import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import Box from '@mui/material/Box';
import {
  getDataGridUtilityClass,
  GridRenderCellParams,
  GridDataSourceGroupNode,
  useGridSelector,
  useGridRootProps,
  GridPrivateApiPro,
  gridDataSourceLoadingIdSelector,
  gridDataSourceErrorSelector,
  useGridApiContext,
  GridValidRowModel,
  gridRowsLookupSelector,
  type GridRowId,
  type GridClasses,
} from '@mui/x-data-grid-pro';
import {
  useGridPrivateApiContext,
  createSelector,
} from '@mui/x-data-grid-pro/internals';
import useEventCallback from '@mui/utils/useEventCallback';
import CircularProgress from '@mui/material/CircularProgress';

const gridRowSelector = createSelector(
  gridRowsLookupSelector,
  (lookup, id: GridRowId) => lookup[id],
);

type OwnerState = { classes?: Partial<GridClasses> };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle'],
    loadingContainer: ['treeDataGroupingCellLoadingContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface GridTreeDataGroupingCellProps
  extends GridRenderCellParams<any, any, any, GridDataSourceGroupNode> {
  hideDescendantCount?: boolean;
  /**
   * The cell offset multiplier used for calculating cell offset (`rowNode.depth * offsetMultiplier` px).
   * @default 2
   */
  offsetMultiplier?: number;
}

interface GridTreeDataGroupingCellIconProps
  extends Pick<GridTreeDataGroupingCellProps, 'id' | 'field' | 'rowNode' | 'row'> {
  descendantCount: number;
}

function GridTreeDataGroupingCellIcon(
  props: GridTreeDataGroupingCellIconProps & {
    setExpandedRows: React.Dispatch<React.SetStateAction<GridValidRowModel[]>>;
    nestedLevelRef: React.RefObject<number>;
  },
) {
  const apiRef = useGridApiContext() as React.MutableRefObject<GridPrivateApiPro>;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses({ classes: rootProps.classes });
  const { rowNode, id, field, descendantCount, row, nestedLevelRef } = props;

  const isDataLoading = useGridSelector(apiRef, gridDataSourceLoadingIdSelector, id);
  const error = useGridSelector(apiRef, gridDataSourceErrorSelector, id);

  const expanded = rowNode.childrenExpanded || row.expanded;

  const handleClick = useEventCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
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
      } else if (row.expanded) {
        props.setExpandedRows((prev) => {
          const index = prev.findIndex((r) => r.id === id);
          return prev.slice(0, index);
        });
      } else {
        apiRef.current.setRowChildrenExpansion(id, !expanded);
      }
      apiRef.current.setCellFocus(id, field);
      event.stopPropagation(); // TODO remove event.stopPropagation
    },
  );

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

export default function NestedPaginationGroupingCell(
  props: GridTreeDataGroupingCellProps & {
    setExpandedRows: React.Dispatch<React.SetStateAction<GridValidRowModel[]>>;
    nestedLevelRef: React.RefObject<number>;
  },
) {
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
