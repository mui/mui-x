import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import {
  getDataGridUtilityClass,
  GridRenderCellParams,
  GridDataSourceGroupNode,
  useGridSelector,
  useGridRootProps,
  DataGridProProcessedProps,
  GridPrivateApiPro,
  GridStatePro,
} from '@mui/x-data-grid-pro';
import { useGridPrivateApiContext } from '@mui/x-data-grid-pro/internals';
import { useGridSelectorV8, createSelectorV8 } from '@mui/x-data-grid/internals';
import CircularProgress from '@mui/material/CircularProgress';

export const gridDataSourceStateSelector = (state: GridStatePro) => state.dataSource;

export const gridDataSourceLoadingIdSelector = createSelectorV8(
  gridDataSourceStateSelector,
  (dataSource, id: GridRowId) => dataSource.loading[id] ?? false,
);

export const gridDataSourceErrorSelector = createSelectorV8(
  gridDataSourceStateSelector,
  (dataSource, id: GridRowId) => dataSource.errors[id],
);

type OwnerState = DataGridProProcessedProps;

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
    setExpandedRows: (rows: GridValidRowModel[]) => void;
    nestedLevelRef: React.RefObject<number>;
  },
) {
  const apiRef =
    useGridPrivateApiContext() as React.MutableRefObject<GridPrivateApiPro>;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const { rowNode, id, field, descendantCount, row, nestedLevelRef } = props;

  const isDataLoading = useGridSelectorV8(
    apiRef,
    gridDataSourceLoadingIdSelector,
    id,
  );
  const error = useGridSelectorV8(apiRef, gridDataSourceErrorSelector, id);

  const expanded = rowNode.childrenExpanded || row.expanded;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
  };

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
        <Badge variant="dot" color="error" invisible={!error}>
          <Icon fontSize="inherit" />
        </Badge>
      </rootProps.slots.baseTooltip>
    </rootProps.slots.baseIconButton>
  ) : null;
}

export function NestedPaginationGroupingCell(
  props: GridTreeDataGroupingCellProps & {
    setExpandedRows: (rows: GridValidRowModel[]) => void;
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
  const rowSelector = (state: GridStatePro) => state.rows.dataRowIdToModelLookup[id];
  const row = useGridSelector(apiRef, rowSelector);
  const classes = useUtilityClasses(rootProps);

  let descendantCount = 0;
  if (row) {
    descendantCount = Math.max(
      rootProps.unstable_dataSource?.getChildrenCount?.(row) ?? 0,
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
