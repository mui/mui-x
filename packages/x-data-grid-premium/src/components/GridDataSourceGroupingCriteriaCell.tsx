import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import composeClasses from '@mui/utils/composeClasses';
import {
  useGridPrivateApiContext,
  gridDataSourceErrorSelector,
  gridDataSourceLoadingIdSelector,
  gridRowSelector,
  vars,
  gridPivotActiveSelector,
} from '@mui/x-data-grid-pro/internals';
import {
  useGridSelector,
  getDataGridUtilityClass,
  GridRenderCellParams,
  GridGroupNode,
} from '@mui/x-data-grid-pro';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';
import { GridPrivateApiPremium } from '../models/gridApiPremium';
import { gridRowGroupingModelSelector } from '../hooks/features/rowGrouping/gridRowGroupingSelector';

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['groupingCriteriaCell'],
    toggle: ['groupingCriteriaCellToggle'],
    loadingContainer: ['groupingCriteriaCellLoadingContainer'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

interface GridGroupingCriteriaCellProps extends GridRenderCellParams<any, any, any, GridGroupNode> {
  hideDescendantCount?: boolean;
}

interface GridGroupingCriteriaCellIconProps extends Pick<
  GridGroupingCriteriaCellProps,
  'id' | 'field' | 'rowNode' | 'row'
> {
  descendantCount: number;
}

function GridGroupingCriteriaCellIcon(props: GridGroupingCriteriaCellIconProps) {
  const apiRef = useGridPrivateApiContext() as RefObject<GridPrivateApiPremium>;
  const { slots, slotProps, classes: classesRootProps } = useGridRootProps();
  const classes = useUtilityClasses({ classes: classesRootProps });
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
    event.stopPropagation();
  };

  const Icon = rowNode.childrenExpanded
    ? slots.groupingCriteriaCollapseIcon
    : slots.groupingCriteriaExpandIcon;

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

export function GridDataSourceGroupingCriteriaCell(props: GridGroupingCriteriaCellProps) {
  const { id, field, rowNode, hideDescendantCount, formattedValue } = props;

  const { dataSource, rowGroupingColumnMode, classes: classesRootProps } = useGridRootProps();
  const apiRef = useGridApiContext();
  const row = useGridSelector(apiRef, gridRowSelector, id);
  const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
  const rowGroupingModelLength = useGridSelector(apiRef, gridRowGroupingModelSelector).length;
  const classes = useUtilityClasses({ classes: classesRootProps });
  const shouldShowToggleContainer = !pivotActive || rowGroupingModelLength > 1;
  // Do not allow expand/collapse the last grouping criteria cell when in pivot mode
  const shouldShowToggleButton = !pivotActive || rowNode.depth < rowGroupingModelLength - 1;

  let descendantCount = 0;
  if (row) {
    descendantCount = dataSource?.getChildrenCount?.(row) ?? 0;
  }

  let cellContent: React.ReactNode;

  const colDef = apiRef.current.getColumn(rowNode.groupingField!);
  if (typeof colDef?.renderCell === 'function') {
    cellContent = colDef.renderCell(props);
  } else if (typeof formattedValue !== 'undefined') {
    cellContent = <span>{formattedValue}</span>;
  } else {
    cellContent = <span>{rowNode.groupingKey}</span>;
  }

  return (
    <div
      className={classes.root}
      style={{
        marginLeft:
          rowGroupingColumnMode === 'multiple'
            ? 0
            : `calc(var(--DataGrid-cellOffsetMultiplier) * ${vars.spacing(rowNode.depth)})`,
      }}
    >
      {shouldShowToggleContainer && (
        <div className={classes.toggle}>
          {shouldShowToggleButton && (
            <GridGroupingCriteriaCellIcon
              id={id}
              field={field}
              rowNode={rowNode}
              row={row}
              descendantCount={descendantCount}
            />
          )}
        </div>
      )}
      {cellContent}
      {!hideDescendantCount && descendantCount > 0 ? (
        <span style={{ whiteSpace: 'pre' }}> ({descendantCount})</span>
      ) : null}
    </div>
  );
}
