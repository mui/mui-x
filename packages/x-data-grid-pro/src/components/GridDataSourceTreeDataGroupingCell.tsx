import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import {
  getDataGridUtilityClass,
  GridRenderCellParams,
  GridDataSourceGroupNode,
  useGridSelector,
} from '@mui/x-data-grid';
import { vars, gridRowSelector } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { DataGridProProcessedProps } from '../models/dataGridProProps';
import {
  gridDataSourceErrorSelector,
  gridDataSourceLoadingIdSelector,
} from '../hooks/features/dataSource/gridDataSourceSelector';

type OwnerState = Pick<DataGridProProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['treeDataGroupingCell'],
    toggle: ['treeDataGroupingCellToggle'],
    loadingContainer: ['treeDataGroupingCellLoadingContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface GridTreeDataGroupingCellProps extends GridRenderCellParams<
  any,
  any,
  any,
  GridDataSourceGroupNode
> {
  hideDescendantCount?: boolean;
  /**
   * The cell offset multiplier used for calculating cell offset (`rowNode.depth * offsetMultiplier` px).
   * @default 2
   */
  offsetMultiplier?: number;
}

interface GridTreeDataGroupingCellIconProps extends Pick<
  GridTreeDataGroupingCellProps,
  'id' | 'field' | 'rowNode' | 'row'
> {
  descendantCount: number;
}

function GridTreeDataGroupingCellIcon(props: GridTreeDataGroupingCellIconProps) {
  const apiRef = useGridPrivateApiContext();
  const { slots, slotProps, classes: rootPropsClasses } = useGridRootProps();
  const classes = useUtilityClasses({ classes: rootPropsClasses });
  const { rowNode, id, field, descendantCount } = props;

  const isDataLoading = useGridSelector(apiRef, gridDataSourceLoadingIdSelector, id);
  const error = useGridSelector(apiRef, gridDataSourceErrorSelector, id);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!rowNode.childrenExpanded) {
      // always fetch/get from cache the children when the node is expanded
      apiRef.current.dataSource.fetchRows(id);
    } else {
      // Collapse the node and remove child rows from the grid
      apiRef.current.setRowChildrenExpansion(id, false);
      apiRef.current.removeChildrenRows(id);
    }
    apiRef.current.setCellFocus(id, field);
    event.stopPropagation(); // TODO remove event.stopPropagation
  };

  const Icon = rowNode.childrenExpanded ? slots.treeDataCollapseIcon : slots.treeDataExpandIcon;

  if (isDataLoading) {
    return (
      <div className={classes.loadingContainer}>
        <slots.baseCircularProgress size="1rem" color="inherit" />
      </div>
    );
  }

  return descendantCount === -1 || descendantCount > 0 ? (
    <slots.baseIconButton
      size="small"
      onClick={handleClick}
      tabIndex={-1}
      aria-label={
        rowNode.childrenExpanded
          ? apiRef.current.getLocaleText('treeDataCollapse')
          : apiRef.current.getLocaleText('treeDataExpand')
      }
      {...slotProps?.baseIconButton}
    >
      <slots.baseTooltip title={error?.message ?? null}>
        <slots.baseBadge variant="dot" color="error" invisible={!error}>
          <Icon fontSize="inherit" />
        </slots.baseBadge>
      </slots.baseTooltip>
    </slots.baseIconButton>
  ) : null;
}

export function GridDataSourceTreeDataGroupingCell(props: GridTreeDataGroupingCellProps) {
  const { id, field, formattedValue, rowNode, hideDescendantCount, offsetMultiplier = 2 } = props;

  const { dataSource, classes: rootPropsClasses } = useGridRootProps();
  const apiRef = useGridPrivateApiContext();
  const row = useGridSelector(apiRef, gridRowSelector, id);
  const classes = useUtilityClasses({ classes: rootPropsClasses });

  let descendantCount = 0;
  if (row) {
    descendantCount = dataSource?.getChildrenCount?.(row) ?? 0;
  }

  return (
    <div
      className={classes.root}
      style={{ marginLeft: vars.spacing(rowNode.depth * offsetMultiplier) }}
    >
      <div className={classes.toggle}>
        <GridTreeDataGroupingCellIcon
          id={id}
          field={field}
          rowNode={rowNode}
          row={row}
          descendantCount={descendantCount}
        />
      </div>
      <span>
        {formattedValue === undefined ? rowNode.groupingKey : formattedValue}
        {!hideDescendantCount && descendantCount > 0 ? ` (${descendantCount})` : ''}
      </span>
    </div>
  );
}
